import json
from langchain_core.tools import tool
from llm_factory import create_llm

A2UI_COMPONENT_CATALOG = """
# A2UI Component Catalog (v0.8)

You generate A2UI component JSON. Each surface is an array of three messages:
1. surfaceUpdate: defines components
2. dataModelUpdate: sets data values
3. beginRendering: starts rendering from root

## Message Format

```json
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
```

## Component Definition Format

Each component is: { "id": "unique-id", "component": { "ComponentType": { ...props } } }

One component MUST have id "root" to serve as the tree root.

## Available Components

### Layout Components

**Row** - Horizontal flex container
Props: children (ChildList), alignment (start|center|end|stretch), distribution (start|center|end|spaceBetween|spaceAround|spaceEvenly)

**Column** - Vertical flex container
Props: children (ChildList), alignment (start|center|end|stretch), distribution (start|center|end|spaceBetween|spaceAround|spaceEvenly)

**Card** - Bordered container with shadow
Props: child (single component ID)

**Divider** - Horizontal or vertical line
Props: axis (horizontal|vertical)

**Tabs** - Tabbed interface
Props: tabs (array of {title: DynamicString, child: componentId})

### Content Components

**Text** - Display text with typography
Props: text (DynamicString), usageHint (h1|h2|h3|h4|h5|caption|body)

**Image** - Display image
Props: url (DynamicString), fit (contain|cover|fill|none|scaleDown), usageHint (icon|avatar|smallFeature|mediumFeature|largeFeature|header)

**Icon** - Material icon
Props: name (DynamicString - e.g. "home", "search", "settings", "favorite", "star", "check", "close", "edit", "delete", "add", "person", "mail", "phone", "locationOn", "calendarToday", "shoppingCart", "payment", "lock", "visibility")

### Input Components

**TextField** - Text input
Props: label (DynamicString), text (DynamicString), textFieldType (shortText|longText|number|obscured)

**CheckBox** - Boolean toggle
Props: label (DynamicString), value (DynamicBoolean)

**ChoicePicker** - Select/multi-select
Props: label (DynamicString), options ([{label, value}]), value (DynamicStringList), variant (mutuallyExclusive|multipleSelection)

**Slider** - Numeric range
Props: label (DynamicString), min (number), max (number), value (DynamicNumber)

### Navigation Components

**Button** - Clickable button
Props: child (componentId - usually a Text), action ({name: string, context: []}), variant (default|primary|borderless)

## Dynamic Values

- Literal string: { "literalString": "Hello" } or just "Hello"
- Data binding: { "path": "/dataKey" }
- Data bindings reference keys in dataModelUpdate contents

## ChildList

- Static: { "explicitList": ["child-1", "child-2"] }
- Dynamic template: { "componentId": "template-id", "path": "/listKey" }

## RULES:
- Always include all three messages: surfaceUpdate, dataModelUpdate, beginRendering
- Root component must have id "root"
- Use data bindings ({ "path": "/key" }) for dynamic values
- Keep component IDs short and descriptive
- Wrap multiple children in Row or Column containers
- Use Card as the outermost wrapper for visual polish
- Output ONLY the JSON array, no markdown or explanation
"""


@tool
def design_widget(description: str) -> str:
    """Design a custom A2UI widget from a natural language description.
    Use this for any widget request that doesn't match a specific tool
    (weather, profile, tasks, login, stats).
    """
    llm = create_llm()

    system_prompt = (
        f"{A2UI_COMPONENT_CATALOG}\n\n"
        "You are an A2UI widget designer. Given a description, generate valid "
        "A2UI JSON (an array of three messages: surfaceUpdate, dataModelUpdate, "
        "beginRendering). Output ONLY the raw JSON array, no markdown fences, "
        "no explanation. Use a unique surfaceId. Populate the data model with "
        "realistic sample data."
    )

    response = llm.invoke([
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": description},
    ])

    result_text = response.content.strip()

    # Strip markdown fences if present
    if result_text.startswith("```"):
        lines = result_text.split("\n")
        # Remove first line (```json) and last line (```)
        lines = [l for l in lines if not l.strip().startswith("```")]
        result_text = "\n".join(lines)

    # Validate JSON structure
    try:
        parsed = json.loads(result_text)
        if not isinstance(parsed, list) or len(parsed) < 3:
            raise ValueError("Expected array of 3 messages")
        has_surface = any("surfaceUpdate" in m for m in parsed)
        has_data = any("dataModelUpdate" in m for m in parsed)
        has_render = any("beginRendering" in m for m in parsed)
        if not (has_surface and has_data and has_render):
            raise ValueError(
                "Missing required message types "
                "(surfaceUpdate, dataModelUpdate, beginRendering)"
            )
    except (json.JSONDecodeError, ValueError) as e:
        # Return error as text so the agent can report it
        return json.dumps({"error": f"Invalid A2UI JSON generated: {e}"})

    return result_text
