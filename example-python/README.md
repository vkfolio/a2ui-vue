# A2UI Python Backend (FastAPI + LangGraph)

A FastAPI server that uses LangGraph to serve an AI agent capable of generating A2UI widgets.

## Setup

```bash
cd example-python
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

pip install -r requirements.txt

cp .env.example .env
# Edit .env with your API key(s)
```

## Configuration

Set `LLM_PROVIDER` in `.env` to one of: `openai`, `anthropic`, `google`.

Provide the corresponding API key:
- `OPENAI_API_KEY` for OpenAI
- `ANTHROPIC_API_KEY` for Anthropic
- `GOOGLE_API_KEY` for Google

## Run

```bash
python server.py
```

The server starts on `http://localhost:8006`.

## API

### POST /agent

AG-UI compatible SSE endpoint. Send a JSON body:

```json
{
  "messages": [{"role": "user", "content": "Show me the weather in Tokyo"}],
  "threadId": "optional-thread-id"
}
```

Returns an SSE stream with events: `RUN_STARTED`, `TEXT_MESSAGE_CONTENT`, `TOOL_CALL_START`, `TOOL_CALL_RESULT`, `RUN_FINISHED`.

Tool results containing A2UI JSON are emitted as `TOOL_CALL_RESULT` events.

## Available Tools

| Tool | Description |
|------|-------------|
| `show_weather` | Weather card with temperature and forecast |
| `show_profile` | User profile card with avatar and stats |
| `show_task_list` | Interactive task list with checkboxes |
| `show_login_form` | Login form with email/password fields |
| `show_stats_card` | Stats dashboard with icons and numbers |
| `design_widget` | LLM-powered custom widget designer |
