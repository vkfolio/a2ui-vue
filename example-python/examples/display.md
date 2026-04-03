# Display Widgets

Read-only data display: weather, flight status, stats dashboards, step counters.

Tags: weather, flight, stats, dashboard, data, info, status, counter, metric, kpi

## Weather (v0.8)

```json
[
  {"surfaceUpdate": {"surfaceId": "weather", "components": [
    {"id": "root", "component": {"Card": {"child": "main-column"}}},
    {"id": "main-column", "component": {"Column": {"children": {"explicitList": ["temp-row", "location", "description"]}, "alignment": "center"}}},
    {"id": "temp-row", "component": {"Row": {"children": {"explicitList": ["temp-high", "temp-low"]}, "alignment": "start"}}},
    {"id": "temp-high", "component": {"Text": {"text": {"path": "/tempHigh"}, "usageHint": "h1"}}},
    {"id": "temp-low", "component": {"Text": {"text": {"path": "/tempLow"}, "usageHint": "h2"}}},
    {"id": "location", "component": {"Text": {"text": {"path": "/location"}, "usageHint": "h3"}}},
    {"id": "description", "component": {"Text": {"text": {"path": "/description"}, "usageHint": "caption"}}}
  ]}},
  {"dataModelUpdate": {"surfaceId": "weather", "contents": [
    {"key": "tempHigh", "valueString": "72\u00b0"},
    {"key": "tempLow", "valueString": "58\u00b0"},
    {"key": "location", "valueString": "Austin, TX"},
    {"key": "description", "valueString": "Clear skies with light breeze"}
  ]}},
  {"beginRendering": {"surfaceId": "weather", "root": "root"}}
]
```

## Flight Status (v0.8)

```json
[
  {"surfaceUpdate": {"surfaceId": "flight", "components": [
    {"id": "root", "component": {"Card": {"child": "main-column"}}},
    {"id": "main-column", "component": {"Column": {"children": {"explicitList": ["header-row", "route-row", "divider", "times-row"]}, "alignment": "stretch"}}},
    {"id": "header-row", "component": {"Row": {"children": {"explicitList": ["header-left", "date"]}, "distribution": "spaceBetween", "alignment": "center"}}},
    {"id": "header-left", "component": {"Row": {"children": {"explicitList": ["flight-indicator", "flight-number"]}, "alignment": "center"}}},
    {"id": "flight-indicator", "component": {"Icon": {"name": {"literalString": "send"}}}},
    {"id": "flight-number", "component": {"Text": {"text": {"path": "/flightNumber"}, "usageHint": "h3"}}},
    {"id": "date", "component": {"Text": {"text": {"path": "/date"}, "usageHint": "caption"}}},
    {"id": "route-row", "component": {"Row": {"children": {"explicitList": ["origin", "arrow", "destination"]}, "alignment": "center"}}},
    {"id": "origin", "component": {"Text": {"text": {"path": "/origin"}, "usageHint": "h2"}}},
    {"id": "arrow", "component": {"Text": {"text": {"literalString": "\u2192"}, "usageHint": "h2"}}},
    {"id": "destination", "component": {"Text": {"text": {"path": "/destination"}, "usageHint": "h2"}}},
    {"id": "divider", "component": {"Divider": {}}},
    {"id": "times-row", "component": {"Row": {"children": {"explicitList": ["departure-col", "status-col", "arrival-col"]}, "distribution": "spaceBetween"}}},
    {"id": "departure-col", "component": {"Column": {"children": {"explicitList": ["departure-label", "departure-time"]}, "alignment": "start"}}},
    {"id": "departure-label", "component": {"Text": {"text": {"literalString": "Departs"}, "usageHint": "caption"}}},
    {"id": "departure-time", "component": {"Text": {"text": {"path": "/departureTime"}, "usageHint": "h3"}}},
    {"id": "status-col", "component": {"Column": {"children": {"explicitList": ["status-label", "status-value"]}, "alignment": "center"}}},
    {"id": "status-label", "component": {"Text": {"text": {"literalString": "Status"}, "usageHint": "caption"}}},
    {"id": "status-value", "component": {"Text": {"text": {"path": "/status"}, "usageHint": "body"}}},
    {"id": "arrival-col", "component": {"Column": {"children": {"explicitList": ["arrival-label", "arrival-time"]}, "alignment": "end"}}},
    {"id": "arrival-label", "component": {"Text": {"text": {"literalString": "Arrives"}, "usageHint": "caption"}}},
    {"id": "arrival-time", "component": {"Text": {"text": {"path": "/arrivalTime"}, "usageHint": "h3"}}}
  ]}},
  {"dataModelUpdate": {"surfaceId": "flight", "contents": [
    {"key": "flightNumber", "valueString": "OS 87"},
    {"key": "date", "valueString": "Mon, Dec 15"},
    {"key": "origin", "valueString": "Vienna"},
    {"key": "destination", "valueString": "New York"},
    {"key": "departureTime", "valueString": "10:15 AM"},
    {"key": "status", "valueString": "On Time"},
    {"key": "arrivalTime", "valueString": "2:30 PM"}
  ]}},
  {"beginRendering": {"surfaceId": "flight", "root": "root"}}
]
```

## Stats Dashboard (v0.10)

```json
[
  {"createSurface": {"surfaceId": "stats", "rootComponentId": "root"}},
  {"updateComponents": {"surfaceId": "stats", "components": [
    {"id": "root", "component": "Card", "child": "col"},
    {"id": "col", "component": "Column", "children": ["header", "stats-grid", "divider", "alert-msg"]},
    {"id": "header", "component": "Text", "text": {"literalString": "This Month"}, "variant": "h4"},
    {"id": "stats-grid", "component": "Row", "children": ["s1", "s2", "s3"], "justify": "spaceBetween"},
    {"id": "s1", "component": "Stat", "value": {"literalString": "$84.2K"}, "label": {"literalString": "Revenue"}, "trend": {"literalString": "+14%"}, "trendDirection": "up"},
    {"id": "s2", "component": "Stat", "value": {"literalString": "3,841"}, "label": {"literalString": "Orders"}, "trend": {"literalString": "+7%"}, "trendDirection": "up"},
    {"id": "s3", "component": "Stat", "value": {"literalString": "98.4%"}, "label": {"literalString": "Uptime"}, "trend": {"literalString": "-0.1%"}, "trendDirection": "down"},
    {"id": "divider", "component": "Divider"},
    {"id": "alert-msg", "component": "Alert", "title": {"literalString": "New milestone"}, "message": {"literalString": "Revenue up 14% \u2014 best month of 2025!"}, "severity": "success"}
  ]}}
]
```

## Step Counter (v0.8)

```json
[
  {"surfaceUpdate": {"surfaceId": "steps", "components": [
    {"id": "root", "component": {"Card": {"child": "main-column"}}},
    {"id": "main-column", "component": {"Column": {"children": {"explicitList": ["header", "steps-display", "goal-text", "divider", "stats-row"]}, "alignment": "center"}}},
    {"id": "header", "component": {"Row": {"children": {"explicitList": ["steps-icon", "title"]}, "alignment": "center"}}},
    {"id": "steps-icon", "component": {"Icon": {"name": {"literalString": "person"}}}},
    {"id": "title", "component": {"Text": {"text": {"literalString": "Today's Steps"}, "usageHint": "h4"}}},
    {"id": "steps-display", "component": {"Text": {"text": {"path": "/steps"}, "usageHint": "h1"}}},
    {"id": "goal-text", "component": {"Text": {"text": {"path": "/goalProgress"}, "usageHint": "body"}}},
    {"id": "divider", "component": {"Divider": {}}},
    {"id": "stats-row", "component": {"Row": {"children": {"explicitList": ["distance-col", "calories-col"]}, "distribution": "spaceAround"}}},
    {"id": "distance-col", "component": {"Column": {"children": {"explicitList": ["distance-value", "distance-label"]}, "alignment": "center"}}},
    {"id": "distance-value", "component": {"Text": {"text": {"path": "/distance"}, "usageHint": "h3"}}},
    {"id": "distance-label", "component": {"Text": {"text": {"literalString": "Distance"}, "usageHint": "caption"}}},
    {"id": "calories-col", "component": {"Column": {"children": {"explicitList": ["calories-value", "calories-label"]}, "alignment": "center"}}},
    {"id": "calories-value", "component": {"Text": {"text": {"path": "/calories"}, "usageHint": "h3"}}},
    {"id": "calories-label", "component": {"Text": {"text": {"literalString": "Calories"}, "usageHint": "caption"}}}
  ]}},
  {"dataModelUpdate": {"surfaceId": "steps", "contents": [
    {"key": "steps", "valueString": "8,432"},
    {"key": "goalProgress", "valueString": "84% of 10,000 goal"},
    {"key": "distance", "valueString": "3.8 mi"},
    {"key": "calories", "valueString": "312"}
  ]}},
  {"beginRendering": {"surfaceId": "steps", "root": "root"}}
]
```

## Mini Dashboard with Tabs (v0.10)

```json
[
  {"createSurface": {"surfaceId": "mini-dash", "rootComponentId": "root"}},
  {"updateComponents": {"surfaceId": "mini-dash", "components": [
    {"id": "root", "component": "Card", "child": "col"},
    {"id": "col", "component": "Column", "children": ["header", "tabs-section"]},
    {"id": "header", "component": "Text", "text": {"literalString": "Analytics"}, "variant": "h4"},
    {"id": "tabs-section", "component": "Tabs", "tabs": [
      {"title": {"literalString": "Week"}, "child": "week-col"},
      {"title": {"literalString": "Month"}, "child": "month-col"}
    ]},
    {"id": "week-col", "component": "Column", "children": ["w-s1", "w-s2"]},
    {"id": "w-s1", "component": "Stat", "value": {"literalString": "12,840"}, "label": {"literalString": "Visitors"}, "trend": {"literalString": "+8%"}, "trendDirection": "up"},
    {"id": "w-s2", "component": "Stat", "value": {"literalString": "$9,240"}, "label": {"literalString": "Revenue"}, "trend": {"literalString": "+12%"}, "trendDirection": "up"},
    {"id": "month-col", "component": "Column", "children": ["m-s1", "m-s2"]},
    {"id": "m-s1", "component": "Stat", "value": {"literalString": "51,200"}, "label": {"literalString": "Visitors"}, "trend": {"literalString": "+22%"}, "trendDirection": "up"},
    {"id": "m-s2", "component": "Stat", "value": {"literalString": "$38,400"}, "label": {"literalString": "Revenue"}, "trend": {"literalString": "+18%"}, "trendDirection": "up"}
  ]}}
]
```

## Crypto Portfolio (v0.10)

```json
[
  {"createSurface": {"surfaceId": "crypto", "rootComponentId": "root"}},
  {"updateComponents": {"surfaceId": "crypto", "components": [
    {"id": "root", "component": "Card", "child": "col"},
    {"id": "col", "component": "Column", "children": ["header-row", "total-stat", "divider", "coins-col"]},
    {"id": "header-row", "component": "Row", "children": ["title", "period-badge"], "justify": "spaceBetween", "align": "center"},
    {"id": "title", "component": "Text", "text": {"literalString": "Portfolio"}, "variant": "h4"},
    {"id": "period-badge", "component": "Badge", "label": {"literalString": "24h"}, "variant": "neutral"},
    {"id": "total-stat", "component": "Stat", "value": {"path": "/total"}, "label": {"literalString": "Total Value"}, "trend": {"path": "/totalTrend"}, "trendDirection": "up"},
    {"id": "divider", "component": "Divider"},
    {"id": "coins-col", "component": "Column", "children": ["btc-row", "eth-row"]},
    {"id": "btc-row", "component": "Row", "children": ["btc-name", "btc-right"], "justify": "spaceBetween", "align": "center"},
    {"id": "btc-name", "component": "Text", "text": {"literalString": "Bitcoin"}, "variant": "body"},
    {"id": "btc-right", "component": "Column", "children": ["btc-val", "btc-trend"], "align": "end"},
    {"id": "btc-val", "component": "Text", "text": {"path": "/btcVal"}, "variant": "h5"},
    {"id": "btc-trend", "component": "Badge", "label": {"path": "/btcTrend"}, "variant": "success"},
    {"id": "eth-row", "component": "Row", "children": ["eth-name", "eth-right"], "justify": "spaceBetween", "align": "center"},
    {"id": "eth-name", "component": "Text", "text": {"literalString": "Ethereum"}, "variant": "body"},
    {"id": "eth-right", "component": "Column", "children": ["eth-val", "eth-trend"], "align": "end"},
    {"id": "eth-val", "component": "Text", "text": {"path": "/ethVal"}, "variant": "h5"},
    {"id": "eth-trend", "component": "Badge", "label": {"path": "/ethTrend"}, "variant": "error"}
  ]}},
  {"updateDataModel": {"surfaceId": "crypto", "data": {
    "total": "$48,291.40", "totalTrend": "+$1,240 (2.6%)",
    "btcVal": "$28,120", "btcTrend": "+3.1%",
    "ethVal": "$14,830", "ethTrend": "-0.8%"
  }}}
]
```
