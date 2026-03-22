# 🎨 a2ui-vue

**Vue 3 Renderer for Google's [A2UI Protocol](https://github.com/google/A2UI)** — Render agent-generated UI components with Tailwind CSS.

[![npm](https://img.shields.io/npm/v/a2ui-vue)](https://npmjs.com/package/a2ui-vue)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> The first Vue renderer for A2UI. Like [CopilotKit's A2UI Composer](https://a2ui-composer.ag-ui.com/) but for Vue/Nuxt — LLM-agnostic, dark mode, extensible.

## What is A2UI?

**A2UI (Agent-to-UI)** is Google's protocol that lets AI agents stream structured UI components (JSON) to frontends. Instead of just text responses, agents can render rich, interactive widgets — weather cards, forms, dashboards, profile cards — that users can interact with.

```
User: "Show me the weather in Tokyo"

Agent → streams A2UI JSON → Vue renderer → 🎨 Beautiful weather card widget
```

## Features

- 🧩 **18 A2UI Components** — Row, Column, Card, Text, Image, Icon, Button, TextField, CheckBox, Slider, and more
- 🌙 **Dark/Light Theme** — CSS custom properties with automatic theme switching
- 🔗 **Data Binding** — Reactive JSON Pointer bindings (`/user/name`)
- 📡 **SSE Streaming** — AG-UI protocol + raw JSONL support
- 🤖 **Multi-LLM** — OpenAI, Anthropic, Google Gemini (backend example)
- 🎨 **Tailwind CSS** — Beautiful defaults, fully customizable
- 📦 **Tree-shakeable** — Import only what you need
- 🔧 **Extensible** — Register custom components

## Quick Start

```bash
npm install a2ui-vue
```

### Render A2UI from an Agent (SSE)

```vue
<script setup>
import { ref } from 'vue'
import { A2Surface } from 'a2ui-vue'

const surfaceRef = ref()
const input = ref('')

function send() {
  surfaceRef.value?.send(input.value)
  input.value = ''
}
</script>

<template>
  <A2Surface ref="surfaceRef" agent-url="http://localhost:8006/agent" />
  <input v-model="input" @keyup.enter="send" />
  <button @click="send">Send</button>
</template>
```

### Render Static A2UI JSON

```vue
<script setup>
import { A2StaticRenderer } from 'a2ui-vue'

const weatherWidget = [
  {
    surfaceUpdate: {
      surfaceId: 'weather',
      components: [
        { id: 'root', component: { Card: { child: 'col' } } },
        { id: 'col', component: { Column: { children: { explicitList: ['city', 'temp'] }, alignment: 'center' } } },
        { id: 'city', component: { Text: { text: { path: '/city' }, usageHint: 'h2' } } },
        { id: 'temp', component: { Text: { text: { path: '/temp' }, usageHint: 'h1' } } },
      ],
    },
  },
  {
    dataModelUpdate: {
      surfaceId: 'weather',
      contents: [
        { key: 'city', valueString: 'Tokyo' },
        { key: 'temp', valueString: '22°C' },
      ],
    },
  },
  { beginRendering: { surfaceId: 'weather', root: 'root' } },
]
</script>

<template>
  <A2StaticRenderer :messages="weatherWidget" />
</template>
```

### Use the Composable

```ts
import { useA2UI } from 'a2ui-vue'

const { send, surfaces, streamingText, isConnected } = useA2UI({
  agentUrl: 'http://localhost:8006/agent',
  onText: (delta) => console.log('Streaming:', delta),
})

await send('Create a login form')
```

## Components

| Category | Components |
|----------|-----------|
| **Layout** | `Row`, `Column`, `List`, `Card`, `Tabs`, `Modal`, `Divider` |
| **Content** | `Text`, `Image`, `Icon`, `Video`, `AudioPlayer` |
| **Input** | `TextField`, `CheckBox`, `ChoicePicker`, `Slider`, `DateTimeInput` |
| **Navigation** | `Button` |

## Dark Mode

```vue
<A2Surface :dark="true" agent-url="..." />
```

Or use the theme system:

```ts
import { injectThemeStyles } from 'a2ui-vue'

injectThemeStyles({ primaryColor: '#8b5cf6' }, isDark)
```

## Backend Setup

See `example-python/` for a complete FastAPI + LangGraph backend:

```bash
cd example-python
pip install -r requirements.txt
cp .env.example .env  # Add your API key
python server.py      # Starts on http://localhost:8006
```

Supports OpenAI, Anthropic, and Google Gemini — switch via `LLM_PROVIDER` env var.

## Example App

See `example-nuxt/` for a full Nuxt 3 Composer app with:
- **Create** — Describe a widget, AI generates it
- **Gallery** — Pre-built widget showcase
- **Components** — Component reference with live previews
- **Icons** — Material Icons browser
- **Designer** — JSON editor + live preview + AI chat

```bash
cd example-nuxt
npm install
npm run dev  # http://localhost:3000
```

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌────────────────┐
│  User types  │────>│  LangGraph   │────>│  Any LLM       │
│  a message   │     │  Agent       │     │  (OpenAI/etc)  │
└─────────────┘     └──────────────┘     └────────────────┘
                           │                      │
                           │ Generates A2UI JSON  │
                           │<─────────────────────┘
                           │
                           │ Streams SSE events
                           v
                    ┌──────────────┐
                    │  a2ui-vue    │
                    │  Renderer    │
                    └──────────────┘
                           │
                           │ Renders Vue components
                           v
                    ┌──────────────┐
                    │  Your App    │
                    └──────────────┘
```

## API Reference

### Components

- `<A2Surface>` — Main entry point, connects to agent SSE endpoint
- `<A2StaticRenderer>` — Render from static A2UI JSON array
- `<A2Renderer>` — Internal recursive renderer (used by Surface)

### Composables

- `useA2UI(options)` — Full agent connection + surface management
- `useSurface()` — Surface lifecycle management
- `useDataModel()` — Reactive data model with JSON Pointer resolution

### Protocol

- `connectSSE(url, body, handlers)` — Connect to SSE endpoint
- `sendAction(url, action)` — Send user action to agent
- `parseA2UIMessages(content)` — Parse A2UI message arrays

### Theme

- `injectThemeStyles(theme, isDark)` — Apply theme CSS variables
- `useTheme()` — Get current theme context

### Designer

- `A2UI_COMPONENT_CATALOG` — Full component catalog for LLM prompts
- `ICON_NAMES` — Array of all valid icon names

## License

MIT
