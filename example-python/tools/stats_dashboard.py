import uuid

from langchain_core.tools import tool

from a2ui_utils import component, create_surface_payload


@tool
def show_stats_card(title: str, stats: list[dict]) -> str:
    """Show a compact stats dashboard using the Stat component."""
    surface_id = f"stats-{uuid.uuid4().hex[:8]}"
    stat_children = []
    components = [
        component("root", "Card", child="main"),
        component("title", "Text", text={"path": "/title"}, variant="h2"),
    ]

    for index, _ in enumerate(stats):
        stat_id = f"stat-{index}"
        stat_children.append(stat_id)
        components.append(
            component(
                stat_id,
                "Stat",
                value={"path": f"/stats/{index}/value"},
                label={"path": f"/stats/{index}/label"},
                icon={"path": f"/stats/{index}/icon"},
            )
        )

    components.extend(
        [
            component("statsRow", "Row", children={"explicitList": stat_children}, justify="spaceAround", align="start"),
            component("main", "Column", children={"explicitList": ["title", "statsRow"]}, align="stretch"),
        ]
    )

    return create_surface_payload(surface_id, components, data={"title": title, "stats": stats})
