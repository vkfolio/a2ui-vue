/**
 * A2UI Component Catalog for LLM Context
 *
 * This string is the canonical prompt contract for example backends in this repo.
 * It should stay aligned with the renderer components implemented in `src/`.
 */

export const A2UI_COMPONENT_CATALOG = `
# A2UI Vue Component Catalog

You generate valid A2UI JSON for the components implemented by this package.

Prefer the v0.10 message flow:
1. createSurface
2. updateComponents
3. updateDataModel

The renderer also supports the older v0.8 compatibility flow:
1. surfaceUpdate
2. dataModelUpdate
3. beginRendering

## Preferred v0.10 Message Format

\`\`\`json
[
  {
    "version": "v0.10",
    "createSurface": {
      "surfaceId": "unique-id",
      "catalogId": "a2ui-vue",
      "rootComponentId": "root"
    }
  },
  {
    "version": "v0.10",
    "updateComponents": {
      "surfaceId": "unique-id",
      "components": [ ...flat component definitions... ]
    }
  },
  {
    "version": "v0.10",
    "updateDataModel": {
      "surfaceId": "unique-id",
      "path": "/",
      "value": { "fieldName": "value" }
    }
  }
]
\`\`\`

## Component Definition Formats

Preferred flat format:
\`\`\`json
{ "id": "title", "component": "Text", "text": "Hello", "variant": "h2" }
\`\`\`

Compatibility format still accepted by the renderer:
\`\`\`json
{ "id": "title", "component": { "Text": { "text": "Hello", "usageHint": "h2" } } }
\`\`\`

One component must have id \`"root"\`.

## Available Components

### Layout

- Row: children, justify, align. Compat aliases: distribution, alignment.
- Column: children, justify, align. Compat aliases: distribution, alignment.
- List: children, direction, align. Compat alias: alignment.
- Card: child.
- Tabs: tabs.
- Modal: trigger, content.
- Divider: axis.

### Content

- Text: text, variant. Compat alias: usageHint.
- Image: url, fit, variant. Compat aliases: src, usageHint.
- Icon: name.
- Video: url.
- AudioPlayer: url, description.
- Badge: label/text, variant.
- Progress: value, label, variant.
- Rating: value, label, maxStars, interactive, action.
- Avatar: src, name, size, status.
- Alert: title, message/text, severity, dismissible.
- Stat: value/text, label, trend, trendDirection, icon.

### Form Controls

- TextField: label, value, variant. Compat aliases: text, textFieldType, dataPath.
- CheckBox: label, value.
- ChoicePicker: label, options, value, variant, displayStyle, filterable.
- Slider: label, min, max, value.
- DateTimeInput: value, enableDate, enableTime, min, max, label.

### Navigation

- Button: child or label/text, action, variant.

## Actions

Preferred action format:
\`\`\`json
{
  "event": {
    "name": "submit",
    "context": {
      "source": "hil-form"
    }
  }
}
\`\`\`

Compatibility action formats still accepted:
- \`"submit"\`
- \`{ "name": "submit", "context": {} }\`

## Dynamic Values

- Literal string: \`"Hello"\`
- Literal wrapper: \`{ "literalString": "Hello" }\`
- Data binding: \`{ "path": "/user/name" }\`

## Child Lists

- Static list: \`{ "explicitList": ["child-a", "child-b"] }\`
- Template list: \`{ "componentId": "row-template", "path": "/items" }\`

## Example: Human-In-The-Loop Input Widget

\`\`\`json
[
  {
    "version": "v0.10",
    "createSurface": {
      "surfaceId": "city-question",
      "catalogId": "a2ui-vue",
      "rootComponentId": "root"
    }
  },
  {
    "version": "v0.10",
    "updateComponents": {
      "surfaceId": "city-question",
      "components": [
        { "id": "root", "component": "Card", "child": "col" },
        { "id": "col", "component": "Column", "children": { "explicitList": ["title", "field", "submit"] }, "align": "stretch" },
        { "id": "title", "component": "Text", "text": "Which city should I use?", "variant": "h3" },
        { "id": "field", "component": "TextField", "label": "City", "value": { "path": "/userInput" }, "variant": "shortText" },
        { "id": "submitText", "component": "Text", "text": "Submit" },
        { "id": "submit", "component": "Button", "child": "submitText", "action": { "event": { "name": "submit" } }, "variant": "primary" }
      ]
    }
  },
  {
    "version": "v0.10",
    "updateDataModel": {
      "surfaceId": "city-question",
      "path": "/",
      "value": {
        "userInput": ""
      }
    }
  }
]
\`\`\`

## Rules

- Use only components implemented by this package.
- Use only supported props for each component.
- Keep ids short and descriptive.
- Use Card as the outer wrapper for HIL questions and compact widgets.
- For HIL actions, always include a clickable Button with an action.
- Never use invented components such as Form, Input, InputField, PasswordField, EmailField, Stack, Container, Section, or Heading.
- If the requested UI is higher-level than this catalog supports, decompose it into the nearest supported primitives instead of inventing a new component.
- If you use v0.8 compatibility shape, keep it fully valid and consistent.
- Output only the JSON payload, with no markdown explanation.
`

export const ICON_NAMES = [
  'accountCircle', 'add', 'arrowBack', 'arrowForward', 'attachFile',
  'calendarToday', 'call', 'camera', 'check', 'close',
  'delete', 'download', 'edit', 'event', 'error',
  'fastForward', 'favorite', 'favoriteOff', 'folder', 'help',
  'home', 'info', 'locationOn', 'lock', 'lockOpen',
  'mail', 'menu', 'moreVert', 'moreHoriz', 'notificationsOff',
  'notifications', 'pause', 'payment', 'person', 'phone',
  'photo', 'play', 'print', 'refresh', 'rewind',
  'search', 'send', 'settings', 'share', 'shoppingCart',
  'skipNext', 'skipPrevious', 'star', 'starHalf', 'starOff',
  'stop', 'upload', 'visibility', 'visibilityOff', 'volumeDown',
  'volumeMute', 'volumeOff', 'volumeUp', 'warning',
] as const
