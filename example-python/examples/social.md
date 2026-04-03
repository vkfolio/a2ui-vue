# Social Widgets

User profiles, notifications, testimonials, and social interactions.

Tags: profile, user, notification, testimonial, review, avatar, follow, social, comment, feed

## User Profile (v0.8)

```json
[
  {"surfaceUpdate": {"surfaceId": "profile", "components": [
    {"id": "root", "component": {"Card": {"child": "main-column"}}},
    {"id": "main-column", "component": {"Column": {"children": {"explicitList": ["header", "info", "bio", "stats-row", "follow-btn"]}, "alignment": "center"}}},
    {"id": "header", "component": {"Image": {"url": {"path": "/avatar"}, "fit": "cover", "usageHint": "avatar"}}},
    {"id": "info", "component": {"Column": {"children": {"explicitList": ["name", "username"]}, "alignment": "center"}}},
    {"id": "name", "component": {"Text": {"text": {"path": "/name"}, "usageHint": "h2"}}},
    {"id": "username", "component": {"Text": {"text": {"path": "/username"}, "usageHint": "caption"}}},
    {"id": "bio", "component": {"Text": {"text": {"path": "/bio"}, "usageHint": "body"}}},
    {"id": "stats-row", "component": {"Row": {"children": {"explicitList": ["followers-col", "following-col", "posts-col"]}, "distribution": "spaceAround"}}},
    {"id": "followers-col", "component": {"Column": {"children": {"explicitList": ["followers-count", "followers-label"]}, "alignment": "center"}}},
    {"id": "followers-count", "component": {"Text": {"text": {"path": "/followers"}, "usageHint": "h3"}}},
    {"id": "followers-label", "component": {"Text": {"text": {"literalString": "Followers"}, "usageHint": "caption"}}},
    {"id": "following-col", "component": {"Column": {"children": {"explicitList": ["following-count", "following-label"]}, "alignment": "center"}}},
    {"id": "following-count", "component": {"Text": {"text": {"path": "/following"}, "usageHint": "h3"}}},
    {"id": "following-label", "component": {"Text": {"text": {"literalString": "Following"}, "usageHint": "caption"}}},
    {"id": "posts-col", "component": {"Column": {"children": {"explicitList": ["posts-count", "posts-label"]}, "alignment": "center"}}},
    {"id": "posts-count", "component": {"Text": {"text": {"path": "/posts"}, "usageHint": "h3"}}},
    {"id": "posts-label", "component": {"Text": {"text": {"literalString": "Posts"}, "usageHint": "caption"}}},
    {"id": "follow-btn-text", "component": {"Text": {"text": {"path": "/followText"}}}},
    {"id": "follow-btn", "component": {"Button": {"child": "follow-btn-text", "variant": "primary", "action": {"name": "follow", "context": []}}}}
  ]}},
  {"dataModelUpdate": {"surfaceId": "profile", "contents": [
    {"key": "avatar", "valueString": "https://randomuser.me/api/portraits/women/44.jpg"},
    {"key": "name", "valueString": "Sarah Chen"},
    {"key": "username", "valueString": "@sarahchen"},
    {"key": "bio", "valueString": "Product Designer at Tech Co. Creating delightful experiences."},
    {"key": "followers", "valueString": "12.4K"},
    {"key": "following", "valueString": "892"},
    {"key": "posts", "valueString": "347"},
    {"key": "followText", "valueString": "Follow"}
  ]}},
  {"beginRendering": {"surfaceId": "profile", "root": "root"}}
]
```

## Notification Center (v0.10)

```json
[
  {"createSurface": {"surfaceId": "notifications", "rootComponentId": "root"}},
  {"updateComponents": {"surfaceId": "notifications", "components": [
    {"id": "root", "component": "Card", "child": "col"},
    {"id": "col", "component": "Column", "children": ["header", "notif-1", "notif-2", "notif-3"]},
    {"id": "header", "component": "Row", "children": ["title", "clear-text"], "justify": "spaceBetween", "align": "center"},
    {"id": "title", "component": "Text", "text": {"literalString": "Notifications"}, "variant": "h4"},
    {"id": "clear-text", "component": "Text", "text": {"literalString": "Mark all read"}, "variant": "caption"},
    {"id": "notif-1", "component": "Row", "children": ["av1", "n1-body"], "align": "start"},
    {"id": "av1", "component": "Avatar", "name": {"literalString": "Sarah Chen"}, "src": {"literalString": "https://randomuser.me/api/portraits/women/44.jpg"}, "size": "sm", "status": "online"},
    {"id": "n1-body", "component": "Column", "children": ["n1-msg", "n1-time"]},
    {"id": "n1-msg", "component": "Text", "text": {"literalString": "**Sarah Chen** liked your post"}, "variant": "body"},
    {"id": "n1-time", "component": "Text", "text": {"literalString": "2m ago"}, "variant": "caption"},
    {"id": "notif-2", "component": "Row", "children": ["av2", "n2-body"], "align": "start"},
    {"id": "av2", "component": "Avatar", "name": {"literalString": "Marcus Lee"}, "size": "sm", "status": "away"},
    {"id": "n2-body", "component": "Column", "children": ["n2-msg", "n2-time"]},
    {"id": "n2-msg", "component": "Text", "text": {"literalString": "**Marcus Lee** commented on your design"}, "variant": "body"},
    {"id": "n2-time", "component": "Text", "text": {"literalString": "15m ago"}, "variant": "caption"},
    {"id": "notif-3", "component": "Alert", "message": {"literalString": "Your subscription renews in 3 days"}, "severity": "warning", "title": {"literalString": "Billing reminder"}, "dismissible": true}
  ]}}
]
```

## Testimonial (v0.10)

```json
[
  {"createSurface": {"surfaceId": "testimonial", "rootComponentId": "root"}},
  {"updateComponents": {"surfaceId": "testimonial", "components": [
    {"id": "root", "component": "Card", "child": "col"},
    {"id": "col", "component": "Column", "children": ["quote", "author-row", "rating-comp"]},
    {"id": "quote", "component": "Text", "text": {"path": "/quote"}, "variant": "h4"},
    {"id": "author-row", "component": "Row", "children": ["av", "author-info"], "align": "center"},
    {"id": "av", "component": "Avatar", "name": {"path": "/author"}, "src": {"path": "/avatar"}, "size": "md", "status": "online"},
    {"id": "author-info", "component": "Column", "children": ["author-name", "author-role"]},
    {"id": "author-name", "component": "Text", "text": {"path": "/author"}, "variant": "h5"},
    {"id": "author-role", "component": "Text", "text": {"path": "/role"}, "variant": "caption"},
    {"id": "rating-comp", "component": "Rating", "value": {"path": "/stars"}, "interactive": false}
  ]}},
  {"updateDataModel": {"surfaceId": "testimonial", "data": {
    "quote": "This tool completely transformed how our team ships features.",
    "avatar": "https://randomuser.me/api/portraits/men/67.jpg",
    "author": "James Waller",
    "role": "CTO at StreamCo",
    "stars": 5
  }}}
]
```
