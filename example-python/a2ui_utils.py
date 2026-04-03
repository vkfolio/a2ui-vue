import json
import re
from pathlib import Path
from typing import Any, Literal

from pydantic import BaseModel


CATALOG_ID = "a2ui-vue"

ComponentType = Literal[
    "Text", "Image", "Icon", "Video", "AudioPlayer",
    "Badge", "Progress", "Rating", "Avatar", "Alert", "Stat",
    "Row", "Column", "List", "Card", "Tabs", "Modal", "Divider",
    "Button", "TextField", "CheckBox", "ChoicePicker", "Slider", "DateTimeInput",
]

SUPPORTED_COMPONENTS = set(ComponentType.__args__)


class ComponentDef(BaseModel):
    model_config = {"extra": "allow"}
    id: str
    component: ComponentType


class SurfaceUpdate(BaseModel):
    model_config = {"extra": "allow"}
    surfaceId: str
    components: list[ComponentDef] = []


class CreateSurface(BaseModel):
    model_config = {"extra": "allow"}
    surfaceId: str
    catalogId: str = CATALOG_ID


class UpdateComponents(BaseModel):
    model_config = {"extra": "allow"}
    surfaceId: str
    components: list[ComponentDef]


class DataModelUpdate(BaseModel):
    model_config = {"extra": "allow"}
    surfaceId: str


class BeginRendering(BaseModel):
    model_config = {"extra": "allow"}
    surfaceId: str


class A2UIMessage(BaseModel):
    model_config = {"extra": "allow"}
    version: str | None = None
    createSurface: CreateSurface | None = None
    updateComponents: UpdateComponents | None = None
    updateDataModel: DataModelUpdate | None = None
    surfaceUpdate: SurfaceUpdate | None = None
    dataModelUpdate: DataModelUpdate | None = None
    beginRendering: BeginRendering | None = None


class A2UIPayload(BaseModel):
    """A complete A2UI message payload."""
    messages: list[A2UIMessage]


def _component_type(definition: Any) -> str | None:
    if not isinstance(definition, dict):
        return None
    component = definition.get("component")
    if isinstance(component, str):
        return component
    if isinstance(component, dict) and len(component) == 1:
        return next(iter(component))
    return None


def component(component_id: str, component_type: str, **props: Any) -> dict[str, Any]:
    return {"id": component_id, "component": component_type, **props}


def event_action(name: str, context: dict[str, Any] | None = None) -> dict[str, Any]:
    event: dict[str, Any] = {"name": name}
    if context:
        event["context"] = context
    return {"event": event}


def create_surface_payload(
    surface_id: str,
    components: list[dict[str, Any]],
    data: dict[str, Any] | None = None,
    root_id: str = "root",
) -> str:
    messages: list[dict[str, Any]] = [
        {
            "version": "v0.10",
            "createSurface": {
                "surfaceId": surface_id,
                "catalogId": CATALOG_ID,
                "rootComponentId": root_id,
            },
        },
        {
            "version": "v0.10",
            "updateComponents": {
                "surfaceId": surface_id,
                "components": components,
            },
        },
    ]
    if data is not None:
        messages.append(
            {
                "version": "v0.10",
                "updateDataModel": {
                    "surfaceId": surface_id,
                    "path": "/",
                    "value": data,
                },
            }
        )
    return json.dumps(messages)


def extract_catalog_text() -> str:
    catalog_path = Path(__file__).resolve().parents[1] / "src" / "designer" / "catalog.ts"
    source = catalog_path.read_text(encoding="utf-8")
    match = re.search(r"export const A2UI_COMPONENT_CATALOG = `([\s\S]*?)`\n", source)
    if not match:
        raise ValueError("Could not extract A2UI_COMPONENT_CATALOG from src/designer/catalog.ts")
    return match.group(1).strip()


def parse_payload(raw: str) -> Any:
    candidate = raw.strip()
    if candidate.startswith("```"):
        candidate = re.sub(r"^```(?:json)?\s*", "", candidate)
        candidate = re.sub(r"\s*```$", "", candidate)
    try:
        result = json.loads(candidate)
        if isinstance(result, list):
            return result
    except json.JSONDecodeError:
        pass

    # Extract all valid JSON candidates and prefer arrays over objects
    candidates = _extract_embedded_json_candidates(candidate)
    arrays = []
    objects = []
    for extracted in candidates:
        try:
            parsed = json.loads(extracted)
            if isinstance(parsed, list):
                arrays.append(parsed)
            elif isinstance(parsed, dict):
                objects.append(parsed)
        except json.JSONDecodeError:
            continue

    # Prefer the longest array (most complete payload)
    if arrays:
        return max(arrays, key=len)

    # If only individual objects found, combine them into an array
    if objects:
        return objects

    return json.loads(candidate)


def _extract_embedded_json_candidates(text: str) -> list[str]:
    results: list[str] = []

    for start, char in enumerate(text):
        if char not in "[{":
            continue

        depth = 0
        in_string = False
        escaped = False

        for end in range(start, len(text)):
            current = text[end]

            if escaped:
                escaped = False
                continue

            if current == "\\":
                escaped = True
                continue

            if current == '"':
                in_string = not in_string
                continue

            if in_string:
                continue

            if current in "[{":
                depth += 1
                continue

            if current in "]}":
                depth -= 1
                if depth == 0:
                    results.append(text[start : end + 1])
                    break

    return results


def validate_payload_shape(payload: Any) -> str | None:
    if not isinstance(payload, list) or not payload:
        return "Expected a non-empty array of A2UI messages."

    kinds = set()
    for message in payload:
        if not isinstance(message, dict):
            return "Every A2UI message must be an object."

        if "updateComponents" in message:
            kinds.add("updateComponents")
            update = message["updateComponents"]
            if not isinstance(update, dict) or not isinstance(update.get("components"), list):
                return "updateComponents.components must be an array."
            for definition in update["components"]:
                if not isinstance(definition, dict):
                    return "Each component definition must be an object."
                component_type = _component_type(definition)
                if component_type not in SUPPORTED_COMPONENTS:
                    return f"Unsupported component: {component_type!r}"
                if not isinstance(definition.get("id"), str) or not definition["id"]:
                    return "Each component must have a non-empty id."
        elif "surfaceUpdate" in message:
            kinds.add("surfaceUpdate")
            update = message["surfaceUpdate"]
            if not isinstance(update, dict) or not isinstance(update.get("components"), list):
                return "surfaceUpdate.components must be an array."
            for definition in update["components"]:
                if not isinstance(definition, dict):
                    return "Each component definition must be an object."
                component_type = _component_type(definition)
                if component_type not in SUPPORTED_COMPONENTS:
                    return f"Unsupported component: {component_type!r}"
                if not isinstance(definition.get("id"), str) or not definition["id"]:
                    return "Each component must have a non-empty id."
        elif "createSurface" in message:
            kinds.add("createSurface")
        elif "updateDataModel" in message:
            kinds.add("updateDataModel")
        elif "dataModelUpdate" in message:
            kinds.add("dataModelUpdate")
        elif "beginRendering" in message:
            kinds.add("beginRendering")
        else:
            return "Unsupported top-level message type."

    if "updateComponents" in kinds and "createSurface" not in kinds:
        return "v0.10 payloads must include createSurface before updateComponents."
    if "createSurface" in kinds and "updateComponents" not in kinds:
        return "v0.10 createSurface must be followed by updateComponents with component definitions."
    if "surfaceUpdate" in kinds and "beginRendering" not in kinds:
        return "v0.8 compatibility payloads must include beginRendering."
    if "beginRendering" in kinds and "surfaceUpdate" not in kinds:
        return "v0.8 beginRendering must have a matching surfaceUpdate."

    return None
