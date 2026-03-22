import json
import uuid
from langchain_core.tools import tool


@tool
def show_login_form(
    title: str = "Welcome back",
    subtitle: str = "Sign in to your account",
) -> str:
    """Show a login form widget with email and password fields and a sign-in button."""
    surface_id = f"login-{uuid.uuid4().hex[:8]}"

    components = [
        {"id": "root", "component": {"Card": {"child": "main-column"}}},
        {
            "id": "main-column",
            "component": {
                "Column": {
                    "children": {
                        "explicitList": [
                            "header",
                            "email-field",
                            "password-field",
                            "login-btn",
                            "divider",
                            "signup-row",
                        ]
                    },
                },
            },
        },
        {
            "id": "header",
            "component": {
                "Column": {
                    "children": {
                        "explicitList": ["title-text", "subtitle-text"]
                    },
                    "alignment": "center",
                },
            },
        },
        {
            "id": "title-text",
            "component": {
                "Text": {
                    "text": {"literalString": title},
                    "usageHint": "h2",
                },
            },
        },
        {
            "id": "subtitle-text",
            "component": {
                "Text": {
                    "text": {"literalString": subtitle},
                    "usageHint": "caption",
                },
            },
        },
        {
            "id": "email-field",
            "component": {
                "TextField": {
                    "label": {"literalString": "Email"},
                    "text": {"path": "/email"},
                },
            },
        },
        {
            "id": "password-field",
            "component": {
                "TextField": {
                    "label": {"literalString": "Password"},
                    "text": {"path": "/password"},
                    "textFieldType": "obscured",
                },
            },
        },
        {
            "id": "login-btn-text",
            "component": {"Text": {"text": {"literalString": "Sign in"}}},
        },
        {
            "id": "login-btn",
            "component": {
                "Button": {
                    "child": "login-btn-text",
                    "action": {"name": "login", "context": []},
                },
            },
        },
        {"id": "divider", "component": {"Divider": {}}},
        {
            "id": "signup-row",
            "component": {
                "Row": {
                    "children": {
                        "explicitList": ["no-account-text", "signup-btn"]
                    },
                    "distribution": "center",
                },
            },
        },
        {
            "id": "no-account-text",
            "component": {
                "Text": {
                    "text": {"literalString": "Don't have an account?"},
                    "usageHint": "caption",
                },
            },
        },
        {
            "id": "signup-btn-text",
            "component": {"Text": {"text": {"literalString": "Sign up"}}},
        },
        {
            "id": "signup-btn",
            "component": {
                "Button": {
                    "child": "signup-btn-text",
                    "action": {"name": "signup", "context": []},
                },
            },
        },
    ]

    contents = [
        {"key": "email", "valueString": ""},
        {"key": "password", "valueString": ""},
    ]

    messages = [
        {"surfaceUpdate": {"surfaceId": surface_id, "components": components}},
        {"dataModelUpdate": {"surfaceId": surface_id, "contents": contents}},
        {"beginRendering": {"surfaceId": surface_id, "root": "root"}},
    ]

    return json.dumps(messages)
