import json
import uuid
from langchain_core.tools import tool


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
    """Show a user profile card widget with avatar, bio, and social stats."""
    surface_id = f"profile-{uuid.uuid4().hex[:8]}"

    components = [
        {"id": "root", "component": {"Card": {"child": "main-column"}}},
        {
            "id": "main-column",
            "component": {
                "Column": {
                    "children": {
                        "explicitList": [
                            "avatar",
                            "info",
                            "bio-text",
                            "stats-row",
                            "follow-btn",
                        ]
                    },
                    "alignment": "center",
                },
            },
        },
        {
            "id": "avatar",
            "component": {
                "Image": {
                    "url": {"path": "/avatar"},
                    "fit": "cover",
                    "usageHint": "avatar",
                },
            },
        },
        {
            "id": "info",
            "component": {
                "Column": {
                    "children": {"explicitList": ["name-text", "username-text"]},
                    "alignment": "center",
                },
            },
        },
        {
            "id": "name-text",
            "component": {
                "Text": {"text": {"path": "/name"}, "usageHint": "h2"},
            },
        },
        {
            "id": "username-text",
            "component": {
                "Text": {"text": {"path": "/username"}, "usageHint": "caption"},
            },
        },
        {
            "id": "bio-text",
            "component": {
                "Text": {"text": {"path": "/bio"}, "usageHint": "body"},
            },
        },
        {
            "id": "stats-row",
            "component": {
                "Row": {
                    "children": {
                        "explicitList": [
                            "followers-col",
                            "following-col",
                            "posts-col",
                        ]
                    },
                    "distribution": "spaceAround",
                },
            },
        },
        {
            "id": "followers-col",
            "component": {
                "Column": {
                    "children": {
                        "explicitList": ["followers-count", "followers-label"]
                    },
                    "alignment": "center",
                },
            },
        },
        {
            "id": "followers-count",
            "component": {
                "Text": {"text": {"path": "/followers"}, "usageHint": "h3"},
            },
        },
        {
            "id": "followers-label",
            "component": {
                "Text": {
                    "text": {"literalString": "Followers"},
                    "usageHint": "caption",
                },
            },
        },
        {
            "id": "following-col",
            "component": {
                "Column": {
                    "children": {
                        "explicitList": ["following-count", "following-label"]
                    },
                    "alignment": "center",
                },
            },
        },
        {
            "id": "following-count",
            "component": {
                "Text": {"text": {"path": "/following"}, "usageHint": "h3"},
            },
        },
        {
            "id": "following-label",
            "component": {
                "Text": {
                    "text": {"literalString": "Following"},
                    "usageHint": "caption",
                },
            },
        },
        {
            "id": "posts-col",
            "component": {
                "Column": {
                    "children": {
                        "explicitList": ["posts-count", "posts-label"]
                    },
                    "alignment": "center",
                },
            },
        },
        {
            "id": "posts-count",
            "component": {
                "Text": {"text": {"path": "/posts"}, "usageHint": "h3"},
            },
        },
        {
            "id": "posts-label",
            "component": {
                "Text": {
                    "text": {"literalString": "Posts"},
                    "usageHint": "caption",
                },
            },
        },
        {
            "id": "follow-btn-text",
            "component": {
                "Text": {"text": {"path": "/followText"}},
            },
        },
        {
            "id": "follow-btn",
            "component": {
                "Button": {
                    "child": "follow-btn-text",
                    "action": {"name": "follow", "context": []},
                },
            },
        },
    ]

    contents = [
        {"key": "avatar", "valueString": avatar_url},
        {"key": "name", "valueString": name},
        {"key": "username", "valueString": username},
        {"key": "bio", "valueString": bio},
        {"key": "followers", "valueString": followers},
        {"key": "following", "valueString": following},
        {"key": "posts", "valueString": posts},
        {"key": "followText", "valueString": "Follow"},
    ]

    messages = [
        {"surfaceUpdate": {"surfaceId": surface_id, "components": components}},
        {"dataModelUpdate": {"surfaceId": surface_id, "contents": contents}},
        {"beginRendering": {"surfaceId": surface_id, "root": "root"}},
    ]

    return json.dumps(messages)
