import uuid

from langchain_core.tools import tool

from a2ui_utils import component, create_surface_payload, event_action


@tool
def show_task_list(tasks: list[dict]) -> str:
    """Show an interactive task list with checkbox items and action buttons."""
    surface_id = f"tasks-{uuid.uuid4().hex[:8]}"
    task_rows = []
    components = [
        component("root", "Card", child="main"),
        component("header", "Text", text={"path": "/header"}, variant="h2"),
    ]

    for index, _ in enumerate(tasks):
        row_id = f"task-{index}"
        task_rows.append(row_id)
        components.extend(
            [
                component(row_id, "Row", children={"explicitList": [f"{row_id}-check"]}, align="center"),
                component(f"{row_id}-check", "CheckBox", label={"path": f"/tasks/{index}/title"}, value={"path": f"/tasks/{index}/completed"}),
            ]
        )

    components.extend(
        [
            component("completeText", "Text", text="Complete All"),
            component("completeAll", "Button", child="completeText", action=event_action("complete_all"), variant="default"),
            component("clearText", "Text", text="Clear Done"),
            component("clearDone", "Button", child="clearText", action=event_action("clear_done"), variant="borderless"),
            component("actions", "Row", children={"explicitList": ["completeAll", "clearDone"]}, justify="spaceBetween", align="center"),
            component("main", "Column", children={"explicitList": ["header", *task_rows, "actions"]}, align="stretch"),
        ]
    )

    total = len(tasks)
    done = sum(1 for task in tasks if task.get("completed"))
    return create_surface_payload(surface_id, components, data={"header": f"Tasks ({done}/{total})", "tasks": tasks})
