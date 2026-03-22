from langchain_core.messages import SystemMessage
from langgraph.graph import StateGraph, END, MessagesState
from langgraph.prebuilt import ToolNode
from langgraph.checkpoint.memory import MemorySaver

from llm_factory import create_llm
from tools.weather import show_weather
from tools.profile import show_profile
from tools.task_manager import show_task_list
from tools.login_form import show_login_form
from tools.stats_dashboard import show_stats_card
from designer import design_widget

# All available tools
tools = [
    show_weather,
    show_profile,
    show_task_list,
    show_login_form,
    show_stats_card,
    design_widget,
]

SYSTEM_PROMPT = """You are an AI assistant that can generate rich UI widgets using A2UI.

You have the following tools available:

- show_weather: Show a weather card. Use when the user asks about weather.
- show_profile: Show a user profile card. Use for user/profile display.
- show_task_list: Show an interactive task list with checkboxes.
- show_login_form: Show a login form with email/password fields.
- show_stats_card: Show a stats dashboard with labeled numbers and icons.
- design_widget: Design any custom A2UI widget from a natural language description.
  Use this when the user's request doesn't match one of the specific tools above.

When the user asks you to show, display, or create a UI widget, use the appropriate tool.
For general questions that don't need a widget, just respond with text.

When using show_weather, provide realistic weather data for the requested city.
When using show_profile, provide realistic sample data if the user doesn't specify.
When using design_widget, provide a clear, detailed description of what the widget should look like.
"""


def create_agent():
    """Create and compile the LangGraph agent."""
    llm = create_llm()
    llm_with_tools = llm.bind_tools(tools)

    tool_node = ToolNode(tools)

    def chatbot(state: MessagesState):
        messages = state["messages"]
        # Prepend system message if not already present
        if not messages or not isinstance(messages[0], SystemMessage):
            messages = [SystemMessage(content=SYSTEM_PROMPT)] + messages
        response = llm_with_tools.invoke(messages)
        return {"messages": [response]}

    def should_continue(state: MessagesState):
        last_message = state["messages"][-1]
        if last_message.tool_calls:
            return "tools"
        return END

    graph = StateGraph(MessagesState)
    graph.add_node("chatbot", chatbot)
    graph.add_node("tools", tool_node)

    graph.set_entry_point("chatbot")
    graph.add_conditional_edges("chatbot", should_continue, {"tools": "tools", END: END})
    graph.add_edge("tools", "chatbot")

    memory = MemorySaver()
    return graph.compile(checkpointer=memory)


# Module-level compiled agent
agent = create_agent()
