import uuid

from langchain_core.tools import tool

from a2ui_utils import component, create_surface_payload, event_action


@tool
def show_login_form(
    title: str = "Welcome back",
    subtitle: str = "Sign in to continue",
) -> str:
    """Show a login form widget with email and password fields."""
    surface_id = f"login-{uuid.uuid4().hex[:8]}"
    components = [
        component("root", "Card", child="main"),
        component("main", "Column", children={"explicitList": ["title", "subtitle", "email", "password", "submit"]}, align="stretch"),
        component("title", "Text", text=title, variant="h2"),
        component("subtitle", "Text", text=subtitle, variant="caption"),
        component("email", "TextField", label="Email", value={"path": "/email"}, variant="shortText"),
        component("password", "TextField", label="Password", value={"path": "/password"}, variant="obscured"),
        component("submitText", "Text", text="Sign in"),
        component("submit", "Button", child="submitText", action=event_action("login"), variant="primary"),
    ]
    return create_surface_payload(surface_id, components, data={"email": "", "password": ""})
