# Commerce Widgets

E-commerce, finance, payment, and pricing widgets.

Tags: product, cart, payment, pricing, balance, wallet, account, crypto, shop, price, buy, order

## Product Card (v0.10)

```json
[
  {"createSurface": {"surfaceId": "product", "rootComponentId": "root"}},
  {"updateComponents": {"surfaceId": "product", "components": [
    {"id": "root", "component": "Card", "child": "col"},
    {"id": "col", "component": "Column", "children": ["product-img", "info", "rating-comp", "price-row", "add-btn"]},
    {"id": "product-img", "component": "Image", "url": {"path": "/img"}, "variant": "mediumFeature", "fit": "cover"},
    {"id": "info", "component": "Column", "children": ["name", "brand"]},
    {"id": "name", "component": "Text", "text": {"path": "/name"}, "variant": "h3"},
    {"id": "brand", "component": "Text", "text": {"path": "/brand"}, "variant": "caption"},
    {"id": "rating-comp", "component": "Rating", "value": {"path": "/rating"}, "label": {"path": "/ratingCount"}, "interactive": false},
    {"id": "price-row", "component": "Row", "children": ["price", "original"], "align": "center"},
    {"id": "price", "component": "Text", "text": {"path": "/price"}, "variant": "h3"},
    {"id": "original", "component": "Text", "text": {"path": "/originalPrice"}, "variant": "caption"},
    {"id": "btn-text", "component": "Text", "text": {"literalString": "Add to Cart"}},
    {"id": "add-btn", "component": "Button", "child": "btn-text", "variant": "primary", "action": {"event": {"name": "add_to_cart"}}}
  ]}},
  {"updateDataModel": {"surfaceId": "product", "data": {
    "img": "https://picsum.photos/seed/watch/300/200",
    "name": "Minimalist Watch",
    "brand": "FORMA Studio",
    "rating": 4.7,
    "ratingCount": "(312 reviews)",
    "price": "$249",
    "originalPrice": "$389"
  }}}
]
```

## Account Balance (v0.8)

```json
[
  {"surfaceUpdate": {"surfaceId": "balance", "components": [
    {"id": "root", "component": {"Card": {"child": "main-column"}}},
    {"id": "main-column", "component": {"Column": {"children": {"explicitList": ["header", "balance", "updated", "divider", "actions"]}}}},
    {"id": "header", "component": {"Row": {"children": {"explicitList": ["account-icon", "account-name"]}, "alignment": "center"}}},
    {"id": "account-icon", "component": {"Icon": {"name": {"literalString": "payment"}}}},
    {"id": "account-name", "component": {"Text": {"text": {"path": "/accountName"}, "usageHint": "h4"}}},
    {"id": "balance", "component": {"Text": {"text": {"path": "/balance"}, "usageHint": "h1"}}},
    {"id": "updated", "component": {"Text": {"text": {"path": "/lastUpdated"}, "usageHint": "caption"}}},
    {"id": "divider", "component": {"Divider": {}}},
    {"id": "actions", "component": {"Row": {"children": {"explicitList": ["transfer-btn", "pay-btn"]}}}},
    {"id": "transfer-btn-text", "component": {"Text": {"text": {"literalString": "Transfer"}}}},
    {"id": "transfer-btn", "component": {"Button": {"child": "transfer-btn-text", "variant": "primary", "action": {"name": "transfer", "context": []}}}},
    {"id": "pay-btn-text", "component": {"Text": {"text": {"literalString": "Pay Bill"}}}},
    {"id": "pay-btn", "component": {"Button": {"child": "pay-btn-text", "variant": "primary", "action": {"name": "pay_bill", "context": []}}}}
  ]}},
  {"dataModelUpdate": {"surfaceId": "balance", "contents": [
    {"key": "accountName", "valueString": "Primary Checking"},
    {"key": "balance", "valueString": "$12,458.32"},
    {"key": "lastUpdated", "valueString": "Updated just now"}
  ]}},
  {"beginRendering": {"surfaceId": "balance", "root": "root"}}
]
```

## App Store Card (v0.10)

```json
[
  {"createSurface": {"surfaceId": "app-card", "rootComponentId": "root"}},
  {"updateComponents": {"surfaceId": "app-card", "components": [
    {"id": "root", "component": "Card", "child": "col"},
    {"id": "col", "component": "Column", "children": ["header-row", "desc", "rating-row", "divider", "btn-row"]},
    {"id": "header-row", "component": "Row", "children": ["app-icon", "app-info"], "align": "center"},
    {"id": "app-icon", "component": "Avatar", "name": {"path": "/appName"}, "src": {"path": "/icon"}, "size": "lg"},
    {"id": "app-info", "component": "Column", "children": ["app-name", "category", "size-badge"]},
    {"id": "app-name", "component": "Text", "text": {"path": "/appName"}, "variant": "h4"},
    {"id": "category", "component": "Text", "text": {"path": "/category"}, "variant": "caption"},
    {"id": "size-badge", "component": "Badge", "label": {"path": "/size"}, "variant": "neutral"},
    {"id": "desc", "component": "Text", "text": {"path": "/desc"}, "variant": "body"},
    {"id": "rating-row", "component": "Row", "children": ["stars", "downloads"], "align": "center", "justify": "spaceBetween"},
    {"id": "stars", "component": "Rating", "value": {"path": "/rating"}, "interactive": false},
    {"id": "downloads", "component": "Text", "text": {"path": "/downloads"}, "variant": "caption"},
    {"id": "divider", "component": "Divider"},
    {"id": "btn-row", "component": "Row", "children": ["get-btn", "wishlist-btn"]},
    {"id": "get-text", "component": "Text", "text": {"literalString": "Get"}},
    {"id": "get-btn", "component": "Button", "child": "get-text", "variant": "primary", "action": {"event": {"name": "install"}}},
    {"id": "wish-text", "component": "Text", "text": {"literalString": "Wishlist"}},
    {"id": "wishlist-btn", "component": "Button", "child": "wish-text", "variant": "default", "action": {"event": {"name": "wishlist"}}}
  ]}},
  {"updateDataModel": {"surfaceId": "app-card", "data": {
    "icon": "https://picsum.photos/seed/devflow/80/80",
    "appName": "DevFlow",
    "category": "Developer Tools",
    "size": "12.4 MB",
    "desc": "The fastest way to ship code reviews.",
    "rating": 4.8,
    "downloads": "1.2M downloads"
  }}}
]
```
