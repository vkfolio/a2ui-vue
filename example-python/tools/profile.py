import uuid

from langchain_core.tools import tool

from a2ui_utils import component, create_surface_payload, event_action


@tool
def show_profile(
    name: str,
    username: str,
    bio: str,
    avatar_url: str,
    followers: str,
    following: str,
    posts: str,
) -> str:
    """Show a user profile card widget."""
    surface_id = f"profile-{uuid.uuid4().hex[:8]}"
    components = [
        component("root", "Card", child="main"),
        component("main", "Column", children={"explicitList": ["avatar", "name", "username", "bio", "stats", "follow"]}, align="center"),
        component("avatar", "Avatar", src={"path": "/avatar"}, name={"path": "/name"}, size="xl", status="online"),
        component("name", "Text", text={"path": "/name"}, variant="h2"),
        component("username", "Text", text={"path": "/username"}, variant="caption"),
        component("bio", "Text", text={"path": "/bio"}, variant="body"),
        component("stats", "Row", children={"explicitList": ["followers", "following", "posts"]}, justify="spaceAround", align="center"),
        component("followers", "Stat", value={"path": "/followers"}, label="Followers"),
        component("following", "Stat", value={"path": "/following"}, label="Following"),
        component("posts", "Stat", value={"path": "/posts"}, label="Posts"),
        component("followText", "Text", text={"path": "/followText"}),
        component("follow", "Button", child="followText", action=event_action("follow"), variant="primary"),
    ]
    data = {
        "avatar": avatar_url,
        "name": name,
        "username": username,
        "bio": bio,
        "followers": followers,
        "following": following,
        "posts": posts,
        "followText": "Follow",
    }
    return create_surface_payload(surface_id, components, data=data)
