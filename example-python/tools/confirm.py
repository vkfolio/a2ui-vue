import uuid

from langchain_core.tools import tool

from a2ui_utils import component, create_surface_payload, event_action


@tool
def confirm_action(title: str, description: str) -> str:
    """Show a confirmation widget before a significant action."""
    surface_id = f"confirm-{uuid.uuid4().hex[:8]}"
    components = [
        component("root", "Card", child="col"),
        component("col", "Column", children={"explicitList": ["badge", "title", "desc", "actions"]}, align="stretch"),
        component("badge", "Badge", text="Confirmation", variant="warning"),
        component("title", "Text", text=title, variant="h3"),
        component("desc", "Text", text=description, variant="body"),
        component("actions", "Row", children={"explicitList": ["cancel", "confirm"]}, justify="spaceBetween", align="center"),
        component("cancelText", "Text", text="Cancel"),
        component("cancel", "Button", child="cancelText", action=event_action("cancel"), variant="default"),
        component("confirmText", "Text", text="Confirm"),
        component("confirm", "Button", child="confirmText", action=event_action("confirm"), variant="primary"),
    ]
    return create_surface_payload(surface_id, components)
