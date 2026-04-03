import uuid

from langchain_core.tools import tool

from a2ui_utils import component, create_surface_payload


@tool
def show_weather(
    city: str,
    temperature: str,
    condition: str,
    forecast: list[dict] | None = None,
) -> str:
    """Show a weather card UI widget."""
    surface_id = f"weather-{uuid.uuid4().hex[:8]}"
    children = ["city", "temperature", "condition"]
    components = [
        component("root", "Card", child="main"),
        component("main", "Column", children={"explicitList": children}, align="center"),
        component("city", "Text", text={"path": "/city"}, variant="h2"),
        component("temperature", "Text", text={"path": "/temperature"}, variant="h1"),
        component("condition", "Badge", text={"path": "/condition"}, variant="info"),
    ]
    data = {"city": city, "temperature": temperature, "condition": condition}

    if forecast:
        forecast_children = []
        for index, _ in enumerate(forecast):
            item_id = f"forecast-{index}"
            forecast_children.append(item_id)
            components.extend(
                [
                    component(item_id, "Column", children={"explicitList": [f"{item_id}-icon", f"{item_id}-temp"]}, align="center"),
                    component(f"{item_id}-icon", "Text", text={"path": f"/forecast/{index}/icon"}, variant="h4"),
                    component(f"{item_id}-temp", "Text", text={"path": f"/forecast/{index}/temp"}, variant="caption"),
                ]
            )
        children.append("forecast")
        components.append(component("forecast", "Row", children={"explicitList": forecast_children}, justify="spaceAround", align="center"))
        data["forecast"] = forecast

    return create_surface_payload(surface_id, components, data=data)
