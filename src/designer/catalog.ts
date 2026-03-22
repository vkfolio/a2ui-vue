/**
 * A2UI Component Catalog for LLM Context
 *
 * This provides the component specification as a string that can be
 * included in LLM system prompts to enable AI agents to generate
 * valid A2UI component JSON.
 */

export const A2UI_COMPONENT_CATALOG = `
# A2UI Component Catalog (v0.10)

You generate A2UI component JSON. Each surface is an array of messages:
1. surfaceUpdate: defines components
2. dataModelUpdate: sets data values
3. beginRendering: starts rendering from root

## Message Format

\`\`\`json
[
  {
    "surfaceUpdate": {
      "surfaceId": "unique-id",
      "components": [ ...component definitions... ]
    }
  },
  {
    "dataModelUpdate": {
      "surfaceId": "unique-id",
      "contents": [
        { "key": "fieldName", "valueString": "value or JSON string" }
      ]
    }
  },
  {
    "beginRendering": {
      "surfaceId": "unique-id",
      "root": "root"
    }
  }
]
\`\`\`

## Component Definition Format

Each component is: { "id": "unique-id", "component": { "ComponentType": { ...props } } }

One component MUST have id "root" to serve as the tree root.

## Available Components

### Layout Components

**Row** — Horizontal flex container
Props: children (ChildList), alignment (start|center|end|stretch), distribution (start|center|end|spaceBetween|spaceAround|spaceEvenly)

**Column** — Vertical flex container
Props: children (ChildList), alignment (start|center|end|stretch), distribution (start|center|end|spaceBetween|spaceAround|spaceEvenly)

**List** — Scrollable list
Props: children (ChildList), direction (vertical|horizontal), alignment (start|center|end|stretch)

**Card** — Bordered container with shadow
Props: child (single component ID)

**Tabs** — Tabbed interface
Props: tabs (array of {title: DynamicString, child: componentId})

**Modal** — Overlay dialog
Props: trigger (componentId), content (componentId)

**Divider** — Horizontal or vertical line
Props: axis (horizontal|vertical)

### Content Components

**Text** — Display text with typography
Props: text (DynamicString), usageHint/variant (h1|h2|h3|h4|h5|caption|body)

**Image** — Display image
Props: url (DynamicString), fit (contain|cover|fill|none|scaleDown), usageHint (icon|avatar|smallFeature|mediumFeature|largeFeature|header)

**Icon** — Material icon
Props: name (icon name string, e.g. "home", "search", "settings", "favorite", "star", "check", "close", "edit", "delete", "add", "person", "mail", "phone", "locationOn", "calendarToday", "shoppingCart", "payment", "lock", "visibility")

**Video** — Video player
Props: url (DynamicString)

**AudioPlayer** — Audio player
Props: url (DynamicString), description (DynamicString)

### Input Components

**TextField** — Text input
Props: label (DynamicString), value (DynamicString), variant (shortText|longText|number|obscured)

**CheckBox** — Boolean toggle
Props: label (DynamicString), value (DynamicBoolean)

**ChoicePicker** — Select/multi-select
Props: label (DynamicString), options ([{label, value}]), value (DynamicStringList), variant (mutuallyExclusive|multipleSelection), displayStyle (checkbox|chips)

**Slider** — Numeric range
Props: label (DynamicString), min (number), max (number), value (DynamicNumber)

**DateTimeInput** — Date/time picker
Props: value (DynamicString), enableDate (bool), enableTime (bool), label (DynamicString)

### Navigation Components

**Button** — Clickable button
Props: child (componentId — usually a Text), action ({name: string, context: []}), variant (default|primary|borderless)

## Dynamic Values

- Literal string: "Hello"
- Data binding: { "path": "/dataKey" }
- Both reference keys in dataModelUpdate

## ChildList

- Static: { "explicitList": ["child-1", "child-2"] }
- Dynamic template: { "componentId": "template-id", "path": "/listKey" }

## Example: Weather Card

\`\`\`json
[
  {
    "surfaceUpdate": {
      "surfaceId": "weather",
      "components": [
        { "id": "root", "component": { "Card": { "child": "col" } } },
        { "id": "col", "component": { "Column": { "children": { "explicitList": ["city", "temp", "cond"] }, "alignment": "center" } } },
        { "id": "city", "component": { "Text": { "text": { "path": "/city" }, "usageHint": "h2" } } },
        { "id": "temp", "component": { "Text": { "text": { "path": "/temp" }, "usageHint": "h1" } } },
        { "id": "cond", "component": { "Text": { "text": { "path": "/condition" }, "usageHint": "caption" } } }
      ]
    }
  },
  {
    "dataModelUpdate": {
      "surfaceId": "weather",
      "contents": [
        { "key": "city", "valueString": "Tokyo" },
        { "key": "temp", "valueString": "22°C" },
        { "key": "condition", "valueString": "Partly Cloudy" }
      ]
    }
  },
  { "beginRendering": { "surfaceId": "weather", "root": "root" } }
]
\`\`\`

RULES:
- Always include surfaceUpdate, dataModelUpdate, and beginRendering
- Root component must have id "root"
- Use data bindings ({ "path": "/key" }) for dynamic values
- Keep component IDs short and descriptive
- Wrap multiple children in Row or Column containers
- Use Card as the outermost wrapper for visual polish
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
