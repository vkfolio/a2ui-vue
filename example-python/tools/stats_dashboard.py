import json
import uuid
from langchain_core.tools import tool


@tool
def show_stats_card(title: str, stats: list[dict]) -> str:
    """Show a stats dashboard card with labeled values and icons.
    stats is a list of dicts with keys: 'label' (str), 'value' (str), 'icon' (str, material icon name).
    Example: stats=[{"label": "Revenue", "value": "$12,400", "icon": "payment"}]
    """
    surface_id = f"stats-{uuid.uuid4().hex[:8]}"

    stat_col_ids = []
    components = [
        {"id": "root", "component": {"Card": {"child": "main-column"}}},
        {
            "id": "title-text",
            "component": {
                "Text": {"text": {"path": "/title"}, "usageHint": "h2"},
            },
        },
        {"id": "divider", "component": {"Divider": {}}},
    ]

    for i, stat in enumerate(stats):
        col_id = f"stat-{i}"
        icon_id = f"stat-{i}-icon"
        value_id = f"stat-{i}-value"
        label_id = f"stat-{i}-label"
        stat_col_ids.append(col_id)

        components.extend([
            {
                "id": col_id,
                "component": {
                    "Column": {
                        "children": {
                            "explicitList": [icon_id, value_id, label_id]
                        },
                        "alignment": "center",
                    },
                },
            },
            {
                "id": icon_id,
                "component": {
                    "Icon": {"name": {"path": f"/stats/{i}/icon"}},
                },
            },
            {
                "id": value_id,
                "component": {
                    "Text": {
                        "text": {"path": f"/stats/{i}/value"},
                        "usageHint": "h1",
                    },
                },
            },
            {
                "id": label_id,
                "component": {
                    "Text": {
                        "text": {"path": f"/stats/{i}/label"},
                        "usageHint": "caption",
                    },
                },
            },
        ])

    components.append({
        "id": "stats-row",
        "component": {
            "Row": {
                "children": {"explicitList": stat_col_ids},
                "distribution": "spaceAround",
            },
        },
    })

    components.insert(1, {
        "id": "main-column",
        "component": {
            "Column": {
                "children": {
                    "explicitList": ["title-text", "divider", "stats-row"]
                },
            },
        },
    })

    contents = [
        {"key": "title", "valueString": title},
        {"key": "stats", "valueString": json.dumps(stats)},
    ]

    messages = [
        {"surfaceUpdate": {"surfaceId": surface_id, "components": components}},
        {"dataModelUpdate": {"surfaceId": surface_id, "contents": contents}},
        {"beginRendering": {"surfaceId": surface_id, "root": "root"}},
    ]

    return json.dumps(messages)
