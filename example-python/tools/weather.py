import json
import uuid
from langchain_core.tools import tool


@tool
def show_weather(city: str, temperature: str, condition: str, forecast: list[dict] | None = None) -> str:
    """Show a weather card UI widget. Use when user asks about weather.
    The forecast parameter is optional: a list of dicts with keys 'icon' (emoji) and 'temp' (string like '74\u00b0').
    """
    surface_id = f"weather-{uuid.uuid4().hex[:8]}"

    # Build component tree
    children_list = ["city-text", "temp-text", "condition-text"]
    components = [
        {"id": "root", "component": {"Card": {"child": "main-column"}}},
        {
            "id": "main-column",
            "component": {
                "Column": {
                    "children": {"explicitList": children_list},
                    "alignment": "center",
                },
            },
        },
        {
            "id": "city-text",
            "component": {
                "Text": {"text": {"path": "/city"}, "usageHint": "h2"},
            },
        },
        {
            "id": "temp-text",
            "component": {
                "Text": {"text": {"path": "/temperature"}, "usageHint": "h1"},
            },
        },
        {
            "id": "condition-text",
            "component": {
                "Text": {"text": {"path": "/condition"}, "usageHint": "caption"},
            },
        },
    ]

    # Data model contents
    contents = [
        {"key": "city", "valueString": city},
        {"key": "temperature", "valueString": temperature},
        {"key": "condition", "valueString": condition},
    ]

    # Optional forecast row
    if forecast:
        children_list.append("forecast-row")
        forecast_children = []
        for i, day in enumerate(forecast):
            day_id = f"day{i}"
            icon_id = f"day{i}-icon"
            temp_id = f"day{i}-temp"
            forecast_children.append(day_id)
            components.extend([
                {
                    "id": day_id,
                    "component": {
                        "Column": {
                            "children": {"explicitList": [icon_id, temp_id]},
                            "alignment": "center",
                        },
                    },
                },
                {
                    "id": icon_id,
                    "component": {
                        "Text": {
                            "text": {"path": f"/forecast/{i}/icon"},
                            "usageHint": "h3",
                        },
                    },
                },
                {
                    "id": temp_id,
                    "component": {
                        "Text": {
                            "text": {"path": f"/forecast/{i}/temp"},
                            "usageHint": "caption",
                        },
                    },
                },
            ])

        components.append({
            "id": "forecast-row",
            "component": {
                "Row": {
                    "children": {"explicitList": forecast_children},
                    "distribution": "spaceAround",
                },
            },
        })
        contents.append({
            "key": "forecast",
            "valueString": json.dumps(forecast),
        })

    messages = [
        {"surfaceUpdate": {"surfaceId": surface_id, "components": components}},
        {"dataModelUpdate": {"surfaceId": surface_id, "contents": contents}},
        {"beginRendering": {"surfaceId": surface_id, "root": "root"}},
    ]

    return json.dumps(messages)
