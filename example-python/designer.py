import json

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.tools import tool

from a2ui_utils import (
    SUPPORTED_COMPONENTS,
    extract_catalog_text,
    parse_payload,
    validate_payload_shape,
)
from gallery_examples import get_relevant_examples
from llm_factory import create_llm


def _normalize_components(payload: list) -> list:
    """Walk the payload and fix unsupported component names and common
    prop mistakes. Deterministic — no LLM call needed."""
    import difflib

    def _fix_component_field(definition: dict) -> None:
        comp = definition.get("component")
        if isinstance(comp, str) and comp not in SUPPORTED_COMPONENTS:
            matches = difflib.get_close_matches(comp, SUPPORTED_COMPONENTS, n=1, cutoff=0.4)
            definition["component"] = matches[0] if matches else "Text"
        elif isinstance(comp, dict) and len(comp) == 1:
            name = next(iter(comp))
            if name not in SUPPORTED_COMPONENTS:
                matches = difflib.get_close_matches(name, SUPPORTED_COMPONENTS, n=1, cutoff=0.4)
                new_name = matches[0] if matches else "Text"
                comp[new_name] = comp.pop(name)

    def _fix_props(definition: dict) -> None:
        comp = definition.get("component")
        comp_name = comp if isinstance(comp, str) else (next(iter(comp)) if isinstance(comp, dict) and len(comp) == 1 else None)

        # Remove placeholder (not a real prop — LLMs hallucinate it)
        definition.pop("placeholder", None)

        # Fix onClick/onPress → action
        for click_prop in ("onClick", "onPress", "onTap", "click"):
            if click_prop in definition and "action" not in definition:
                click_val = definition.pop(click_prop)
                if isinstance(click_val, dict) and "event" in click_val:
                    definition["action"] = click_val
                elif isinstance(click_val, str):
                    definition["action"] = {"event": {"name": click_val}}
                else:
                    definition["action"] = {"event": {"name": "click"}}
            elif click_prop in definition:
                definition.pop(click_prop)

        # Fix src → url on Image/Video/AudioPlayer
        if comp_name in ("Image", "Video", "AudioPlayer") and "src" in definition and "url" not in definition:
            definition["url"] = definition.pop("src")

        # Fix type → variant on TextField
        if comp_name == "TextField" and "type" in definition and "variant" not in definition:
            type_map = {"password": "obscured", "number": "number", "email": "shortText", "text": "shortText", "textarea": "longText"}
            definition["variant"] = type_map.get(definition.pop("type"), "shortText")
        elif comp_name == "TextField" and "type" in definition:
            definition.pop("type")

        # Fix title → text on Text
        if comp_name == "Text" and "title" in definition and "text" not in definition:
            definition["text"] = definition.pop("title")

        # Button: icon → convert to child Text, ensure action exists
        if comp_name == "Button":
            definition.pop("icon", None)
            if "action" not in definition:
                definition["action"] = {"event": {"name": "click"}}

        # Progress: progress → value
        if comp_name == "Progress":
            if "progress" in definition and "value" not in definition:
                definition["value"] = definition.pop("progress")
            elif "progress" in definition:
                definition.pop("progress")

    ALLOWED_PROPS = {
        "Text": {"text", "variant", "usageHint"},
        "Image": {"url", "src", "fit", "variant", "usageHint", "alt"},
        "Icon": {"name", "size", "color"},
        "Video": {"url", "src"},
        "AudioPlayer": {"url", "src", "description"},
        "Badge": {"label", "text", "variant"},
        "Progress": {"value", "label", "variant"},
        "Rating": {"value", "label", "maxStars", "interactive", "action"},
        "Avatar": {"src", "name", "size", "status"},
        "Alert": {"title", "message", "text", "severity", "dismissible"},
        "Stat": {"value", "text", "label", "trend", "trendDirection", "icon"},
        "Row": {"children", "justify", "align", "distribution", "alignment"},
        "Column": {"children", "justify", "align", "distribution", "alignment"},
        "List": {"children", "direction", "align", "alignment"},
        "Card": {"child"},
        "Tabs": {"tabs"},
        "Modal": {"trigger", "content"},
        "Divider": {"axis"},
        "Button": {"child", "label", "text", "action", "variant", "checks"},
        "TextField": {"label", "value", "text", "variant", "textFieldType", "dataPath", "checks", "placeholder"},
        "CheckBox": {"label", "value", "checks"},
        "ChoicePicker": {"label", "options", "value", "variant", "displayStyle", "filterable", "checks"},
        "Slider": {"label", "min", "max", "value", "checks"},
        "DateTimeInput": {"value", "enableDate", "enableTime", "min", "max", "label", "checks"},
    }
    COMMON_PROPS = {"id", "component", "accessibility", "weight"}

    def _strip_unknown_props(definition: dict) -> None:
        comp = definition.get("component")
        comp_name = comp if isinstance(comp, str) else (next(iter(comp)) if isinstance(comp, dict) and len(comp) == 1 else None)
        if not comp_name or comp_name not in ALLOWED_PROPS:
            return
        allowed = ALLOWED_PROPS[comp_name] | COMMON_PROPS
        unknown = [k for k in definition if k not in allowed]
        for k in unknown:
            definition.pop(k)

    for message in payload:
        if not isinstance(message, dict):
            continue
        for key in ("updateComponents", "surfaceUpdate"):
            update = message.get(key)
            if isinstance(update, dict):
                for defn in update.get("components", []):
                    if isinstance(defn, dict):
                        _fix_component_field(defn)
                        _fix_props(defn)
                        _strip_unknown_props(defn)

    return payload


@tool
def design_widget(description: str) -> str:
    """Design a custom A2UI widget from a natural language description."""
    llm = create_llm()
    catalog_text = extract_catalog_text()
    examples = get_relevant_examples(description, max_examples=2)

    # Build a concise prompt with just the best matching example
    example_json = json.dumps(examples[0]["messages"], indent=2) if examples else ""
    system_prompt = (
        f"{catalog_text}\n\n"
        "You are an A2UI widget designer.\n"
        "CRITICAL RULES:\n"
        "1. Output ONLY a raw JSON array — no markdown, no explanation.\n"
        "2. The array MUST contain ALL of these messages in order:\n"
        '   - createSurface (with surfaceId, catalogId, rootComponentId)\n'
        '   - updateComponents (with surfaceId and components array — this is where ALL components go)\n'
        '   - updateDataModel (with surfaceId and data object — for dynamic values)\n'
        "3. One component must have id \"root\".\n"
        "4. Use ONLY components from the catalog. Never invent component names.\n\n"
        + (f"Reference example ({examples[0]['name']}):\n```json\n{example_json}\n```\n\n"
           "Adapt this pattern to the user's request. Keep the same message structure." if example_json else "")
    )

    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=description),
    ]

    for attempt in range(2):
        response = llm.invoke(messages)
        result_text = response.content if isinstance(response.content, str) else str(response.content)

        try:
            parsed = parse_payload(result_text)
            parsed = _normalize_components(parsed)
            validation_error = validate_payload_shape(parsed)
            if validation_error:
                if attempt == 0:
                    messages.append(response)
                    messages.append(HumanMessage(
                        content=f"Validation error: {validation_error}\n\nYou MUST output a JSON array with createSurface, updateComponents, and updateDataModel. Output only the corrected JSON."
                    ))
                    continue
                raise ValueError(validation_error)
        except json.JSONDecodeError as exc:
            if attempt == 0:
                messages.append(HumanMessage(content=f"Invalid JSON: {exc}\n\nOutput only a valid JSON array."))
                continue
            return json.dumps({"error": f"Invalid A2UI JSON generated: {exc}"})
        except ValueError as exc:
            return json.dumps({"error": f"Invalid A2UI JSON generated: {exc}"})

        return json.dumps(parsed)

    return json.dumps({"error": "Failed to generate valid A2UI payload after retries."})
