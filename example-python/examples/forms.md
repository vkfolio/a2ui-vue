# Form Widgets

User input, login, settings, and form-based widgets.

Tags: login, signup, input, form, settings, profile, edit, password, email, field, checkbox, picker, slider

## Login Form (v0.8)

```json
[
  {"surfaceUpdate": {"surfaceId": "login", "components": [
    {"id": "root", "component": {"Card": {"child": "main-column"}}},
    {"id": "main-column", "component": {"Column": {"children": {"explicitList": ["header", "email-field", "password-field", "login-btn", "divider", "signup-text"]}}}},
    {"id": "header", "component": {"Column": {"children": {"explicitList": ["title", "subtitle"]}, "alignment": "center"}}},
    {"id": "title", "component": {"Text": {"text": {"literalString": "Welcome back"}, "usageHint": "h2"}}},
    {"id": "subtitle", "component": {"Text": {"text": {"literalString": "Sign in to your account"}, "usageHint": "caption"}}},
    {"id": "email-field", "component": {"TextField": {"label": {"literalString": "Email"}, "text": {"path": "/email"}}}},
    {"id": "password-field", "component": {"TextField": {"label": {"literalString": "Password"}, "text": {"path": "/password"}, "textFieldType": "obscured"}}},
    {"id": "login-btn-text", "component": {"Text": {"text": {"literalString": "Sign in"}}}},
    {"id": "login-btn", "component": {"Button": {"child": "login-btn-text", "variant": "primary", "action": {"name": "login", "context": []}}}},
    {"id": "divider", "component": {"Divider": {}}},
    {"id": "signup-text", "component": {"Row": {"children": {"explicitList": ["no-account", "signup-link"]}, "distribution": "center"}}},
    {"id": "no-account", "component": {"Text": {"text": {"literalString": "Don't have an account?"}, "usageHint": "caption"}}},
    {"id": "signup-link-text", "component": {"Text": {"text": {"literalString": "Sign up"}}}},
    {"id": "signup-link", "component": {"Button": {"child": "signup-link-text", "variant": "borderless", "action": {"name": "signup", "context": []}}}}
  ]}},
  {"dataModelUpdate": {"surfaceId": "login", "contents": [
    {"key": "email", "valueString": ""},
    {"key": "password", "valueString": ""}
  ]}},
  {"beginRendering": {"surfaceId": "login", "root": "root"}}
]
```

## Profile Settings (v0.10)

Shows TextField, ChoicePicker, CheckBox, Avatar, and Button together.

```json
[
  {"createSurface": {"surfaceId": "profile-settings", "rootComponentId": "root"}},
  {"updateComponents": {"surfaceId": "profile-settings", "components": [
    {"id": "root", "component": "Card", "child": "col"},
    {"id": "col", "component": "Column", "children": ["av-row", "name-field", "bio-field", "role-picker", "notif-check", "save-row"]},
    {"id": "av-row", "component": "Row", "children": ["avatar", "change-text"], "align": "center"},
    {"id": "avatar", "component": "Avatar", "name": {"literalString": "Alex Morgan"}, "src": {"literalString": "https://randomuser.me/api/portraits/women/68.jpg"}, "size": "lg", "status": "online"},
    {"id": "change-text", "component": "Text", "text": {"literalString": "Change photo"}, "variant": "caption"},
    {"id": "name-field", "component": "TextField", "label": {"literalString": "Full Name"}, "value": {"path": "/name"}, "variant": "shortText"},
    {"id": "bio-field", "component": "TextField", "label": {"literalString": "Bio"}, "value": {"path": "/bio"}, "variant": "longText"},
    {"id": "role-picker", "component": "ChoicePicker", "label": {"literalString": "Role"}, "options": [
      {"label": {"literalString": "Designer"}, "value": "designer"},
      {"label": {"literalString": "Developer"}, "value": "developer"},
      {"label": {"literalString": "Manager"}, "value": "manager"}
    ], "value": {"path": "/role"}, "variant": "mutuallyExclusive", "displayStyle": "chips"},
    {"id": "notif-check", "component": "CheckBox", "label": {"literalString": "Email notifications"}, "value": {"path": "/notifications"}},
    {"id": "save-row", "component": "Row", "children": ["save-btn", "cancel-btn"]},
    {"id": "save-text", "component": "Text", "text": {"literalString": "Save Changes"}},
    {"id": "save-btn", "component": "Button", "child": "save-text", "variant": "primary", "action": {"event": {"name": "save"}}},
    {"id": "cancel-text", "component": "Text", "text": {"literalString": "Cancel"}},
    {"id": "cancel-btn", "component": "Button", "child": "cancel-text", "variant": "default", "action": {"event": {"name": "cancel"}}}
  ]}},
  {"updateDataModel": {"surfaceId": "profile-settings", "data": {
    "name": "Alex Morgan",
    "bio": "Product designer focused on human-centred experiences.",
    "role": ["designer"],
    "notifications": true
  }}}
]
```

## HIL Input (v0.10)

Simple human-in-the-loop question widget.

```json
[
  {"version": "v0.10", "createSurface": {"surfaceId": "city-question", "catalogId": "a2ui-vue", "rootComponentId": "root"}},
  {"version": "v0.10", "updateComponents": {"surfaceId": "city-question", "components": [
    {"id": "root", "component": "Card", "child": "col"},
    {"id": "col", "component": "Column", "children": ["title", "field", "submit"], "align": "stretch"},
    {"id": "title", "component": "Text", "text": "Which city should I use?", "variant": "h3"},
    {"id": "field", "component": "TextField", "label": "City", "value": {"path": "/userInput"}, "variant": "shortText"},
    {"id": "submitText", "component": "Text", "text": "Submit"},
    {"id": "submit", "component": "Button", "child": "submitText", "action": {"event": {"name": "submit"}}, "variant": "primary"}
  ]}},
  {"version": "v0.10", "updateDataModel": {"surfaceId": "city-question", "path": "/", "value": {"userInput": ""}}}
]
```
