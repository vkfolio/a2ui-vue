import uuid

from langchain_core.tools import tool

from a2ui_utils import component, create_surface_payload, event_action


@tool
def collect_user_input(
    question: str,
    field_label: str,
    field_hint: str = "",
    field_type: str = "shortText",
) -> str:
    """Show a widget that collects one missing piece of user input."""
    surface_id = f"input-{uuid.uuid4().hex[:8]}"
    components = [
        component("root", "Card", child="col"),
        component("col", "Column", children={"explicitList": ["title", "hint", "field", "submit"]}, align="stretch"),
        component("title", "Text", text=question, variant="h3"),
        component("hint", "Text", text=field_hint or "Submit your answer to continue.", variant="caption"),
        component("field", "TextField", label=field_label, value={"path": "/userInput"}, variant=field_type),
        component("submitText", "Text", text="Submit"),
        component("submit", "Button", child="submitText", action=event_action("submit"), variant="primary"),
    ]
    return create_surface_payload(surface_id, components, data={"userInput": ""})
