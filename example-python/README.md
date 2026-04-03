# A2UI Python Backend (FastAPI + LangGraph)

Reference LangGraph backend for the `a2ui-vue` package.

This backend demonstrates a widget-first HIL flow:

- ask for missing input with an A2UI form
- request confirmation with an A2UI confirm card
- generate the final widget from the package component library

## Setup

```bash
cd example-python
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env
```

Set `LLM_PROVIDER` in `.env` to `openai`, `anthropic`, or `google`, then provide the matching API key.

## Run

```bash
python server.py
```

The server starts on `http://localhost:8006`.

## API

`POST /agent` accepts AG-UI-style chat input:

```json
{
  "messages": [{"role": "user", "content": "Show me the weather"}],
  "threadId": "optional-thread-id"
}
```

The SSE response emits:

- `RUN_STARTED`
- `TEXT_MESSAGE_CONTENT`
- `TOOL_CALL_START`
- `TOOL_CALL_RESULT`
- `RUN_FINISHED`

Widget payloads are emitted inside `TOOL_CALL_RESULT`.

## Tools

| Tool | Description |
|------|-------------|
| `show_weather` | Weather card |
| `show_profile` | Profile card |
| `show_task_list` | Interactive task list |
| `show_login_form` | Login form |
| `show_stats_card` | Stats dashboard |
| `confirm_action` | Human approval card |
| `collect_user_input` | Missing-input widget |
| `design_widget` | LLM-powered custom widget designer |
