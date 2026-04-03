# Productivity Widgets

Task management, email, events, calendar, and workflow widgets.

Tags: task, todo, email, event, calendar, list, checklist, workout, recipe, compose, schedule, invite

## Task Manager (v0.10)

```json
[
  {"createSurface": {"surfaceId": "tasks", "rootComponentId": "root"}},
  {"updateComponents": {"surfaceId": "tasks", "components": [
    {"id": "root", "component": "Card", "child": "col"},
    {"id": "col", "component": "Column", "children": ["header", "prog-section", "tasks-list", "add-btn-row"]},
    {"id": "header", "component": "Row", "children": ["title", "done-badge"], "justify": "spaceBetween", "align": "center"},
    {"id": "title", "component": "Text", "text": {"literalString": "Sprint Tasks"}, "variant": "h4"},
    {"id": "done-badge", "component": "Badge", "label": {"literalString": "3 / 5 done"}, "variant": "success"},
    {"id": "prog-section", "component": "Progress", "value": {"literalString": "60"}, "label": {"literalString": "Sprint Progress"}, "variant": "linear"},
    {"id": "tasks-list", "component": "Column", "children": ["t1", "t2", "t3", "t4", "t5"]},
    {"id": "t1", "component": "CheckBox", "label": {"literalString": "Design system tokens"}, "value": {"path": "/t1"}},
    {"id": "t2", "component": "CheckBox", "label": {"literalString": "API auth middleware"}, "value": {"path": "/t2"}},
    {"id": "t3", "component": "CheckBox", "label": {"literalString": "Dashboard data layer"}, "value": {"path": "/t3"}},
    {"id": "t4", "component": "CheckBox", "label": {"literalString": "Write unit tests"}, "value": {"path": "/t4"}},
    {"id": "t5", "component": "CheckBox", "label": {"literalString": "Deploy to staging"}, "value": {"path": "/t5"}},
    {"id": "add-btn-row", "component": "Row", "children": ["add-btn"], "justify": "end"},
    {"id": "add-text", "component": "Text", "text": {"literalString": "Add Task"}},
    {"id": "add-btn", "component": "Button", "child": "add-text", "variant": "borderless", "action": {"event": {"name": "add_task"}}}
  ]}},
  {"updateDataModel": {"surfaceId": "tasks", "data": {"t1": true, "t2": true, "t3": true, "t4": false, "t5": false}}}
]
```

## Email Compose (v0.8)

```json
[
  {"surfaceUpdate": {"surfaceId": "email", "components": [
    {"id": "root", "component": {"Card": {"child": "main-column"}}},
    {"id": "main-column", "component": {"Column": {"children": {"explicitList": ["from-row", "to-row", "subject-row", "divider", "message", "actions"]}}}},
    {"id": "from-row", "component": {"Row": {"children": {"explicitList": ["from-label", "from-value"]}, "alignment": "center"}}},
    {"id": "from-label", "component": {"Text": {"text": {"literalString": "FROM"}, "usageHint": "caption"}}},
    {"id": "from-value", "component": {"Text": {"text": {"path": "/from"}, "usageHint": "body"}}},
    {"id": "to-row", "component": {"Row": {"children": {"explicitList": ["to-label", "to-value"]}, "alignment": "center"}}},
    {"id": "to-label", "component": {"Text": {"text": {"literalString": "TO"}, "usageHint": "caption"}}},
    {"id": "to-value", "component": {"Text": {"text": {"path": "/to"}, "usageHint": "body"}}},
    {"id": "subject-row", "component": {"Row": {"children": {"explicitList": ["subject-label", "subject-value"]}, "alignment": "center"}}},
    {"id": "subject-label", "component": {"Text": {"text": {"literalString": "SUBJECT"}, "usageHint": "caption"}}},
    {"id": "subject-value", "component": {"Text": {"text": {"path": "/subject"}, "usageHint": "body"}}},
    {"id": "divider", "component": {"Divider": {}}},
    {"id": "message", "component": {"Column": {"children": {"explicitList": ["greeting", "body-text", "closing"]}}}},
    {"id": "greeting", "component": {"Text": {"text": {"path": "/greeting"}, "usageHint": "body"}}},
    {"id": "body-text", "component": {"Text": {"text": {"path": "/body"}, "usageHint": "body"}}},
    {"id": "closing", "component": {"Text": {"text": {"path": "/closing"}, "usageHint": "body"}}},
    {"id": "actions", "component": {"Row": {"children": {"explicitList": ["send-btn", "discard-btn"]}}}},
    {"id": "send-btn-text", "component": {"Text": {"text": {"literalString": "Send email"}}}},
    {"id": "send-btn", "component": {"Button": {"child": "send-btn-text", "variant": "primary", "action": {"name": "send", "context": []}}}},
    {"id": "discard-btn-text", "component": {"Text": {"text": {"literalString": "Discard"}}}},
    {"id": "discard-btn", "component": {"Button": {"child": "discard-btn-text", "action": {"name": "discard", "context": []}}}}
  ]}},
  {"dataModelUpdate": {"surfaceId": "email", "contents": [
    {"key": "from", "valueString": "alex@acme.com"},
    {"key": "to", "valueString": "jordan@acme.com"},
    {"key": "subject", "valueString": "Q4 Revenue Forecast"},
    {"key": "greeting", "valueString": "Hi Jordan,"},
    {"key": "body", "valueString": "Please review the attached Q4 forecast before the board meeting."},
    {"key": "closing", "valueString": "Best, Alex"}
  ]}},
  {"beginRendering": {"surfaceId": "email", "root": "root"}}
]
```

## Event Detail (v0.8)

```json
[
  {"surfaceUpdate": {"surfaceId": "event", "components": [
    {"id": "root", "component": {"Card": {"child": "main-column"}}},
    {"id": "main-column", "component": {"Column": {"children": {"explicitList": ["title", "time-row", "location-row", "description", "divider", "actions"]}}}},
    {"id": "title", "component": {"Text": {"text": {"path": "/title"}, "usageHint": "h2"}}},
    {"id": "time-row", "component": {"Row": {"children": {"explicitList": ["time-icon", "time-text"]}, "alignment": "center"}}},
    {"id": "time-icon", "component": {"Icon": {"name": {"literalString": "calendarToday"}}}},
    {"id": "time-text", "component": {"Text": {"text": {"path": "/dateTime"}, "usageHint": "body"}}},
    {"id": "location-row", "component": {"Row": {"children": {"explicitList": ["location-icon", "location-text"]}, "alignment": "center"}}},
    {"id": "location-icon", "component": {"Icon": {"name": {"literalString": "locationOn"}}}},
    {"id": "location-text", "component": {"Text": {"text": {"path": "/location"}, "usageHint": "body"}}},
    {"id": "description", "component": {"Text": {"text": {"path": "/description"}, "usageHint": "body"}}},
    {"id": "divider", "component": {"Divider": {}}},
    {"id": "actions", "component": {"Row": {"children": {"explicitList": ["accept-btn", "decline-btn"]}}}},
    {"id": "accept-btn-text", "component": {"Text": {"text": {"literalString": "Accept"}}}},
    {"id": "accept-btn", "component": {"Button": {"child": "accept-btn-text", "action": {"name": "accept", "context": []}}}},
    {"id": "decline-btn-text", "component": {"Text": {"text": {"literalString": "Decline"}}}},
    {"id": "decline-btn", "component": {"Button": {"child": "decline-btn-text", "action": {"name": "decline", "context": []}}}}
  ]}},
  {"dataModelUpdate": {"surfaceId": "event", "contents": [
    {"key": "title", "valueString": "Product Launch Meeting"},
    {"key": "dateTime", "valueString": "Thu, Dec 19 \u2022 2:00 PM - 3:30 PM"},
    {"key": "location", "valueString": "Conference Room A, Building 2"},
    {"key": "description", "valueString": "Review final product specs before the Q1 launch."}
  ]}},
  {"beginRendering": {"surfaceId": "event", "root": "root"}}
]
```

## Workout Summary (v0.8)

```json
[
  {"surfaceUpdate": {"surfaceId": "workout", "components": [
    {"id": "root", "component": {"Card": {"child": "main-column"}}},
    {"id": "main-column", "component": {"Column": {"children": {"explicitList": ["header", "divider", "metrics-row", "date"]}}}},
    {"id": "header", "component": {"Row": {"children": {"explicitList": ["workout-icon", "title"]}, "alignment": "center"}}},
    {"id": "workout-icon", "component": {"Icon": {"name": {"path": "/icon"}}}},
    {"id": "title", "component": {"Text": {"text": {"literalString": "Workout Complete"}, "usageHint": "h3"}}},
    {"id": "divider", "component": {"Divider": {}}},
    {"id": "metrics-row", "component": {"Row": {"children": {"explicitList": ["duration-col", "calories-col", "distance-col"]}, "distribution": "spaceAround"}}},
    {"id": "duration-col", "component": {"Column": {"children": {"explicitList": ["duration-value", "duration-label"]}, "alignment": "center"}}},
    {"id": "duration-value", "component": {"Text": {"text": {"path": "/duration"}, "usageHint": "h3"}}},
    {"id": "duration-label", "component": {"Text": {"text": {"literalString": "Duration"}, "usageHint": "caption"}}},
    {"id": "calories-col", "component": {"Column": {"children": {"explicitList": ["calories-value", "calories-label"]}, "alignment": "center"}}},
    {"id": "calories-value", "component": {"Text": {"text": {"path": "/calories"}, "usageHint": "h3"}}},
    {"id": "calories-label", "component": {"Text": {"text": {"literalString": "Calories"}, "usageHint": "caption"}}},
    {"id": "distance-col", "component": {"Column": {"children": {"explicitList": ["distance-value", "distance-label"]}, "alignment": "center"}}},
    {"id": "distance-value", "component": {"Text": {"text": {"path": "/distance"}, "usageHint": "h3"}}},
    {"id": "distance-label", "component": {"Text": {"text": {"literalString": "Distance"}, "usageHint": "caption"}}},
    {"id": "date", "component": {"Text": {"text": {"path": "/date"}, "usageHint": "caption"}}}
  ]}},
  {"dataModelUpdate": {"surfaceId": "workout", "contents": [
    {"key": "icon", "valueString": "directions_run"},
    {"key": "duration", "valueString": "32:15"},
    {"key": "calories", "valueString": "385"},
    {"key": "distance", "valueString": "5.2 km"},
    {"key": "date", "valueString": "Today at 7:30 AM"}
  ]}},
  {"beginRendering": {"surfaceId": "workout", "root": "root"}}
]
```

## Recipe Card (v0.8)

```json
[
  {"surfaceUpdate": {"surfaceId": "recipe", "components": [
    {"id": "root", "component": {"Card": {"child": "main-column"}}},
    {"id": "main-column", "component": {"Column": {"children": {"explicitList": ["recipe-image", "content"]}}}},
    {"id": "recipe-image", "component": {"Image": {"url": {"path": "/image"}, "fit": "cover"}}},
    {"id": "content", "component": {"Column": {"children": {"explicitList": ["title", "rating-row", "servings"]}}}},
    {"id": "title", "component": {"Text": {"text": {"path": "/title"}, "usageHint": "h3"}}},
    {"id": "rating-row", "component": {"Row": {"children": {"explicitList": ["star-icon", "rating", "review-count"]}, "alignment": "center"}}},
    {"id": "star-icon", "component": {"Icon": {"name": {"literalString": "star"}}}},
    {"id": "rating", "component": {"Text": {"text": {"path": "/rating"}, "usageHint": "body"}}},
    {"id": "review-count", "component": {"Text": {"text": {"path": "/reviewCount"}, "usageHint": "caption"}}},
    {"id": "servings", "component": {"Text": {"text": {"path": "/servings"}, "usageHint": "caption"}}}
  ]}},
  {"dataModelUpdate": {"surfaceId": "recipe", "contents": [
    {"key": "image", "valueString": "https://picsum.photos/seed/quinoa/300/180"},
    {"key": "title", "valueString": "Mediterranean Quinoa Bowl"},
    {"key": "rating", "valueString": "4.9"},
    {"key": "reviewCount", "valueString": "(1,247 reviews)"},
    {"key": "servings", "valueString": "Serves 4"}
  ]}},
  {"beginRendering": {"surfaceId": "recipe", "root": "root"}}
]
```
