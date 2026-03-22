# Contributing to A2UI Vue

Thank you for your interest in contributing! This document covers how to get set up, the code conventions we follow, and the process for getting your changes merged.

---

## Table of Contents

- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Code Conventions](#code-conventions)
- [Adding a Component](#adding-a-component)
- [Adding a Gallery Widget](#adding-a-gallery-widget)
- [Running the Tests](#running-the-tests)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Issue Labels](#issue-labels)

---

## Development Setup

### Prerequisites

- **Node.js** ≥ 18
- **pnpm** ≥ 8 (`npm i -g pnpm`)
- **Python** ≥ 3.10 (only if working on the backend example)

### Steps

```bash
# 1. Fork and clone
git clone https://github.com/your-org/a2ui-vue.git
cd a2ui-vue

# 2. Install root dependencies
pnpm install

# 3. Build the package
pnpm build

# 4. Set up the example app
cd example-nuxt
pnpm install
pnpm dev
# → http://localhost:3000
```

When working on the package itself (`src/`), run `pnpm build` in the root after each change, then the Nuxt dev server will pick up the new build (you may need to restart the dev server on first run).

---

## Project Structure

```
a2ui-vue/
├── src/
│   ├── index.ts                  # Public API — export everything here
│   ├── types.ts                  # TypeScript interfaces for all component types
│   ├── components/
│   │   ├── A2Renderer.vue        # Recursive renderer — add type→component map here
│   │   ├── A2StaticRenderer.vue  # Static (no SSE) renderer
│   │   ├── A2Surface.vue         # Live SSE surface
│   │   ├── layout/               # Row, Column, List, Card, Tabs, Modal, Divider
│   │   ├── content/              # Text, Image, Icon, Video, AudioPlayer, Badge…
│   │   ├── input/                # TextField, CheckBox, ChoicePicker, Slider…
│   │   └── navigation/           # Button
│   ├── composables/
│   │   ├── useA2UI.ts            # Main composable
│   │   ├── useSurface.ts         # Surface lifecycle + protocol handling
│   │   └── useDataModel.ts       # Reactive data model + JSON Pointer resolution
│   ├── protocol/
│   │   ├── parser.ts             # SSE parser, v0.8/v0.10 message dispatch
│   │   └── emitter.ts            # Action POST back to agent
│   ├── functions/
│   │   └── builtins.ts           # Validation, formatting, logic built-ins
│   └── theme/
│       └── tokens.ts             # CSS variable definitions (dark/light)
├── example-nuxt/                 # Nuxt 3 Composer app
└── example-python/               # FastAPI + LangGraph backend
```

---

## Code Conventions

### Vue components

- Use `<script setup lang="ts">` — no Options API
- Use `scoped` CSS — no global styles, no Tailwind in the package itself
- Use CSS custom properties (`var(--a2ui-*)`) for all colors, radii, and shadows
- Keep templates readable — extract logic into `computed` refs

### Dynamic value resolution

Every component that displays data should use the shared `resolve()` pattern:

```ts
const dataModel = inject('a2ui-data-model') as any

const resolve = (val: any): string => {
  if (!val) return ''
  if (typeof val === 'string') return val
  if (typeof val === 'number') return String(val)
  if (val.literalString !== undefined) return String(val.literalString)
  if (val.path) return String(dataModel?.getPath(props.surfaceId, val.path) ?? '')
  return ''
}
```

### v0.8 / v0.10 dual support

Always support both field names with nullish coalescing:

```ts
// Good
const text = (props.definition as any).value ?? (props.definition as any).text
const variant = (props.definition as any).variant ?? (props.definition as any).textFieldType ?? 'shortText'
```

### Naming

- Components: `PascalCase` starting with `A2` (e.g., `A2Badge.vue`)
- Composables: `camelCase` starting with `use` (e.g., `useDataModel.ts`)
- CSS classes: `a2-component-name__element--modifier` (BEM-style)

---

## Adding a Component

### 1. Create the Vue file

```bash
# Choose the right category:
src/components/content/A2YourComponent.vue
src/components/layout/A2YourComponent.vue
src/components/input/A2YourComponent.vue
src/components/navigation/A2YourComponent.vue
```

Minimum component template:

```vue
<script setup lang="ts">
import { computed, inject } from 'vue'
import type { ComponentDefinition } from '../../types'

const props = defineProps<{
  definition: ComponentDefinition
  surfaceId: string
}>()

const dataModel = inject('a2ui-data-model') as any

const resolve = (val: any): string => {
  if (!val) return ''
  if (typeof val === 'string') return val
  if (typeof val === 'number') return String(val)
  if (val.literalString !== undefined) return String(val.literalString)
  if (val.path) return String(dataModel?.getPath(props.surfaceId, val.path) ?? '')
  return ''
}

const label = computed(() => resolve((props.definition as any).label))
</script>

<template>
  <div class="a2-your-component">{{ label }}</div>
</template>

<style scoped>
.a2-your-component {
  color: var(--a2ui-text);
}
</style>
```

### 2. Register in A2Renderer.vue

```ts
// In src/components/A2Renderer.vue
import A2YourComponent from './content/A2YourComponent.vue'

const componentMap: Record<string, Component> = {
  // ... existing entries ...
  YourComponent: A2YourComponent,
  yourComponent: A2YourComponent,  // also handle camelCase
}
```

### 3. Export from index.ts

```ts
// src/index.ts
export { default as A2YourComponent } from './components/content/A2YourComponent.vue'
```

### 4. Add TypeScript interface

```ts
// src/types.ts
export interface A2YourComponentDefinition extends ComponentDefinition {
  label?: DynamicString
  // ... add your props
}
```

### 5. Add to the Components reference page

Add a section to `example-nuxt/pages/components.vue` with:
- A live preview using `<A2StaticRenderer>`
- A usage JSON example
- A props table

---

## Adding a Gallery Widget

Open `example-nuxt/pages/gallery.vue` and add your widget to the `widgets` array:

```ts
{
  title: 'My Widget',
  surfaces: [
    {
      surfaceId: 'my-widget',
      rootId: 'root',
      components: [
        // your A2UI component tree
      ]
    }
  ]
}
```

Tips:
- Use `picsum.photos/seed/[name]/[width]/[height]` for deterministic placeholder images
- Use `randomuser.me/api/portraits/[men|women]/[0-99].jpg` for avatar portraits
- Keep widgets self-contained — no external API calls in gallery JSON

---

## Running the Tests

```bash
# Unit tests (package)
pnpm test

# Type check
pnpm typecheck

# Lint
pnpm lint
```

> Tests are being actively expanded — writing tests for new components is a great first contribution!

---

## Submitting a Pull Request

1. **Fork** the repo and create a branch: `git checkout -b feat/my-feature`
2. **Make your changes** following the conventions above
3. **Build** the package: `pnpm build`
4. **Test** visually in the example app: `cd example-nuxt && pnpm dev`
5. **Commit** with a clear message: `git commit -m "feat: add A2YourComponent"`
6. **Push** and open a PR against `main`

### PR checklist

- [ ] Component follows the `resolve()` pattern for dynamic values
- [ ] Supports both v0.8 and v0.10 field names
- [ ] Uses CSS custom properties (`var(--a2ui-*)`) — no hardcoded colors
- [ ] Scoped CSS only — no global styles added
- [ ] Registered in `A2Renderer.vue`
- [ ] Exported from `src/index.ts`
- [ ] TypeScript interface added to `src/types.ts`
- [ ] Gallery widget or Components page preview added (if applicable)
- [ ] `pnpm build` passes with no errors

---

## Issue Labels

| Label | Meaning |
|---|---|
| `bug` | Something isn't working |
| `enhancement` | New feature or improvement |
| `component` | New A2UI component |
| `documentation` | Docs-only change |
| `good first issue` | Good for newcomers |
| `help wanted` | Extra attention needed |
| `backend` | Related to `example-python/` |

---

Thanks again for contributing! If you have questions, open a discussion or an issue and we'll help you get unstuck.
