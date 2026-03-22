import json
import uuid
import asyncio
from typing import AsyncGenerator

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse
from langchain_core.messages import HumanMessage, AIMessage, ToolMessage

load_dotenv()

from agent import agent  # noqa: E402 (after load_dotenv)

app = FastAPI(title="A2UI Agent Server")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _is_a2ui_json(content: str) -> bool:
    """Check if a string looks like A2UI JSON (array with surfaceUpdate)."""
    try:
        parsed = json.loads(content)
        if isinstance(parsed, list) and any(
            isinstance(m, dict) and "surfaceUpdate" in m for m in parsed
        ):
            return True
    except (json.JSONDecodeError, TypeError):
        pass
    return False


def _convert_messages(raw_messages: list[dict]) -> list:
    """Convert raw message dicts from the client into LangChain message objects."""
    result = []
    for msg in raw_messages:
        role = msg.get("role", "user")
        content = msg.get("content", "")
        if role == "user":
            result.append(HumanMessage(content=content))
        elif role == "assistant":
            result.append(AIMessage(content=content))
    return result


async def _stream_agent(
    messages: list, thread_id: str
) -> AsyncGenerator[dict, None]:
    """Run the agent and yield AG-UI compatible SSE events."""
    run_id = str(uuid.uuid4())

    yield {"event": "message", "data": json.dumps({
        "type": "RUN_STARTED",
        "threadId": thread_id,
        "runId": run_id,
    })}

    config = {"configurable": {"thread_id": thread_id}}

    try:
        # Stream events from LangGraph
        message_id = str(uuid.uuid4())
        current_tool_call_id = None

        async for event in agent.astream_events(
            {"messages": messages},
            config=config,
            version="v2",
        ):
            kind = event.get("event")

            # LLM text streaming
            if kind == "on_chat_model_stream":
                chunk = event.get("data", {}).get("chunk")
                if chunk and hasattr(chunk, "content") and chunk.content:
                    # Only emit text content, not tool call chunks
                    if isinstance(chunk.content, str) and chunk.content:
                        yield {"event": "message", "data": json.dumps({
                            "type": "TEXT_MESSAGE_CONTENT",
                            "messageId": message_id,
                            "delta": chunk.content,
                        })}

            # Tool call started
            elif kind == "on_tool_start":
                tool_name = event.get("name", "")
                tool_input = event.get("data", {}).get("input", {})
                current_tool_call_id = str(uuid.uuid4())
                yield {"event": "message", "data": json.dumps({
                    "type": "TOOL_CALL_START",
                    "toolCallId": current_tool_call_id,
                    "toolCallName": tool_name,
                })}

            # Tool call completed
            elif kind == "on_tool_end":
                output = event.get("data", {}).get("output")
                if output:
                    content = (
                        output.content
                        if hasattr(output, "content")
                        else str(output)
                    )
                    yield {"event": "message", "data": json.dumps({
                        "type": "TOOL_CALL_RESULT",
                        "toolCallId": current_tool_call_id or str(uuid.uuid4()),
                        "content": content,
                    })}
                    # Start a new message id for subsequent text
                    message_id = str(uuid.uuid4())

    except Exception as e:
        yield {"event": "message", "data": json.dumps({
            "type": "TEXT_MESSAGE_CONTENT",
            "messageId": str(uuid.uuid4()),
            "delta": f"Error: {str(e)}",
        })}

    yield {"event": "message", "data": json.dumps({
        "type": "RUN_FINISHED",
        "threadId": thread_id,
        "runId": run_id,
    })}


@app.post("/agent")
async def agent_endpoint(request: Request):
    """AG-UI compatible agent endpoint that streams SSE events."""
    body = await request.json()

    raw_messages = body.get("messages", [])
    thread_id = body.get("threadId", str(uuid.uuid4()))

    messages = _convert_messages(raw_messages)

    return EventSourceResponse(
        _stream_agent(messages, thread_id),
        media_type="text/event-stream",
    )


@app.get("/health")
async def health():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8006)
