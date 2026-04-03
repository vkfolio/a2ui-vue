import json

from langchain_core.messages import SystemMessage, ToolMessage
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import END, MessagesState, StateGraph
from langgraph.prebuilt import ToolNode

from designer import design_widget
from llm_factory import create_llm
from tools.collect_input import collect_user_input
from tools.confirm import confirm_action
from tools.login_form import show_login_form
from tools.profile import show_profile
from tools.stats_dashboard import show_stats_card
from tools.task_manager import show_task_list
from tools.weather import show_weather

tools = [
    show_weather,
    show_profile,
    show_task_list,
    show_login_form,
    show_stats_card,
    confirm_action,
    collect_user_input,
    design_widget,
]

SYSTEM_PROMPT = """You are a friendly AI assistant that creates interactive UI widgets using the A2UI protocol.

Use the widget tools deliberately:
- If the user already gave enough information, render one appropriate widget.
- If information is missing, ask through `collect_user_input` instead of plain text.
- If the request implies an important or destructive step, ask through `confirm_action`.
- If the request is custom and not covered by a dedicated tool, use `design_widget`.

Behavior rules:
1. Use one widget tool at a time.
2. Prefer widget-first HIL. Do not ask the same thing in plain text if a widget can ask it.
3. After a widget tool renders, stop and wait for the user's next message.
4. If the user says they confirmed, proceed. If they say they cancelled, stop.
5. For general conversation that does not need a widget, respond with concise helpful text.
6. NEVER output raw A2UI JSON in your text response. Always use a tool to generate widgets.
"""


def _is_a2ui_widget_json(content: str) -> bool:
    try:
        parsed = json.loads(content)
        return isinstance(parsed, list) and any(
            isinstance(message, dict)
            and (
                "createSurface" in message
                or "updateComponents" in message
                or "surfaceUpdate" in message
                or "beginRendering" in message
            )
            for message in parsed
        )
    except (json.JSONDecodeError, TypeError, ValueError):
        return False


def create_agent():
    llm = create_llm()
    llm_with_tools = llm.bind_tools(tools)
    tool_node = ToolNode(tools)

    def trim_tool_results(state: MessagesState):
        replacements = []
        for message in state["messages"]:
            if isinstance(message, ToolMessage) and isinstance(message.content, str) and _is_a2ui_widget_json(message.content):
                replacements.append(
                    ToolMessage(
                        content="Widget rendered successfully.",
                        tool_call_id=message.tool_call_id,
                        id=message.id,
                    )
                )
        return {"messages": replacements} if replacements else {}

    def chatbot(state: MessagesState):
        messages = state["messages"]
        if not messages or not isinstance(messages[0], SystemMessage):
            messages = [SystemMessage(content=SYSTEM_PROMPT)] + messages
        response = llm_with_tools.invoke(messages)
        return {"messages": [response]}

    def should_continue(state: MessagesState):
        last_message = state["messages"][-1]
        if hasattr(last_message, "tool_calls") and last_message.tool_calls:
            return "tools"
        return END

    def should_continue_after_trim(state: MessagesState):
        for message in reversed(state["messages"]):
            if isinstance(message, ToolMessage):
                if message.content == "Widget rendered successfully.":
                    return END
                break
        return "chatbot"

    graph = StateGraph(MessagesState)
    graph.add_node("chatbot", chatbot)
    graph.add_node("tools", tool_node)
    graph.add_node("trim_tools", trim_tool_results)
    graph.set_entry_point("chatbot")
    graph.add_conditional_edges("chatbot", should_continue, {"tools": "tools", END: END})
    graph.add_edge("tools", "trim_tools")
    graph.add_conditional_edges("trim_tools", should_continue_after_trim, {"chatbot": "chatbot", END: END})
    return graph.compile(checkpointer=MemorySaver())


agent = create_agent()
