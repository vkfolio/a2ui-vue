# A2UI Vue

Vue 3 renderer and helper library for agent-generated A2UI surfaces.

This repo is package-first:

- `src/` is the npm library
- `example-nuxt/` is the reference frontend
- `example-python/` is the reference LangGraph backend with HIL widgets

## Included

- `A2Surface` for live agent-driven rendering
- `A2StaticRenderer` for previews and static payloads
- `A2UI_COMPONENT_CATALOG` for backend prompting
- Runtime validation helpers:
  - `validateA2UIMessages`
  - `formatA2UIValidationErrors`

## Example HIL Flow

1. User makes a request.
2. The LangGraph agent decides whether more input or confirmation is needed.
3. If needed, it renders a confirm/input widget using the library component set.
4. The user interacts with the widget.
5. The backend generates the final UI payload and the frontend validates it before render.

## Run The Examples

Backend:

```bash
cd example-python
pip install -r requirements.txt
python server.py
```

Frontend:

```bash
cd example-nuxt
npm install
npm run dev
```

Open `http://localhost:3009/try`.

## Run With Docker

1. Create `example-python/.env` from `example-python/.env.example` and set your API key.
2. Start both services:

```bash
docker compose up --build
```

Frontend: `http://localhost:3009/try`

Backend health: `http://localhost:8006/health`
