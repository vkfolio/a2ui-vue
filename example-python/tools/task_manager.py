import json
import uuid
from langchain_core.tools import tool


@tool
def show_task_list(tasks: list[dict]) -> str:
    """Show an interactive task list with checkboxes and action buttons.
    Each task should have 'title' (str) and 'completed' (bool).
    Example: tasks=[{"title": "Buy groceries", "completed": false}]
    """
    surface_id = f"tasks-{uuid.uuid4().hex[:8]}"

    task_ids = []
    components = [
        {"id": "root", "component": {"Card": {"child": "main-column"}}},
    ]

    # Header
    components.append({
        "id": "header-text",
        "component": {
            "Text": {"text": {"path": "/header"}, "usageHint": "h2"},
        },
    })

    # Build a row per task: checkbox + title
    for i, task in enumerate(tasks):
        row_id = f"task-{i}"
        cb_id = f"task-{i}-cb"
        task_ids.append(row_id)

        components.extend([
            {
                "id": row_id,
                "component": {
                    "Row": {
                        "children": {"explicitList": [cb_id]},
                        "alignment": "center",
                    },
                },
            },
            {
                "id": cb_id,
                "component": {
                    "CheckBox": {
                        "label": {"path": f"/tasks/{i}/title"},
                        "value": {"path": f"/tasks/{i}/completed"},
                    },
                },
            },
        ])

    # Add All-done / Clear buttons row
    components.extend([
        {
            "id": "actions-row",
            "component": {
                "Row": {
                    "children": {
                        "explicitList": ["complete-all-btn", "clear-done-btn"]
                    },
                },
            },
        },
        {
            "id": "complete-all-text",
            "component": {"Text": {"text": {"literalString": "Complete All"}}},
        },
        {
            "id": "complete-all-btn",
            "component": {
                "Button": {
                    "child": "complete-all-text",
                    "action": {"name": "complete_all", "context": []},
                },
            },
        },
        {
            "id": "clear-done-text",
            "component": {"Text": {"text": {"literalString": "Clear Done"}}},
        },
        {
            "id": "clear-done-btn",
            "component": {
                "Button": {
                    "child": "clear-done-text",
                    "action": {"name": "clear_done", "context": []},
                },
            },
        },
    ])

    # Main column children
    main_children = ["header-text"] + task_ids + ["actions-row"]
    components.insert(1, {
        "id": "main-column",
        "component": {
            "Column": {"children": {"explicitList": main_children}},
        },
    })

    # Data model
    total = len(tasks)
    done = sum(1 for t in tasks if t.get("completed"))
    contents = [
        {"key": "header", "valueString": f"Tasks ({done}/{total})"},
        {"key": "tasks", "valueString": json.dumps(tasks)},
    ]

    messages = [
        {"surfaceUpdate": {"surfaceId": surface_id, "components": components}},
        {"dataModelUpdate": {"surfaceId": surface_id, "contents": contents}},
        {"beginRendering": {"surfaceId": surface_id, "root": "root"}},
    ]

    return json.dumps(messages)
