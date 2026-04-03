# Media Widgets

Image galleries, video players, audio players, and media content.

Tags: image, video, audio, photo, gallery, player, music, podcast, media, thumbnail

## Photo Gallery (v0.8)

```json
[
  {"surfaceUpdate": {"surfaceId": "photos", "components": [
    {"id": "root", "component": {"Card": {"child": "col"}}},
    {"id": "col", "component": {"Column": {"children": {"explicitList": ["header-row", "hero-img", "thumb-row", "meta-row"]}}}},
    {"id": "header-row", "component": {"Row": {"children": {"explicitList": ["title", "badge"]}, "distribution": "spaceBetween", "alignment": "center"}}},
    {"id": "title", "component": {"Text": {"text": {"literalString": "Iceland Trip"}, "usageHint": "h4"}}},
    {"id": "badge", "component": {"Badge": {"label": {"literalString": "24 photos"}, "variant": "info"}}},
    {"id": "hero-img", "component": {"Image": {"url": {"literalString": "https://picsum.photos/seed/iceland-hero/600/338"}, "fit": "cover", "usageHint": "mediumFeature"}}},
    {"id": "thumb-row", "component": {"Row": {"children": {"explicitList": ["t1", "t2", "t3"]}}}},
    {"id": "t1", "component": {"Image": {"url": {"literalString": "https://picsum.photos/seed/iceland1/120/90"}, "fit": "cover", "usageHint": "smallFeature"}}},
    {"id": "t2", "component": {"Image": {"url": {"literalString": "https://picsum.photos/seed/iceland2/120/90"}, "fit": "cover", "usageHint": "smallFeature"}}},
    {"id": "t3", "component": {"Image": {"url": {"literalString": "https://picsum.photos/seed/iceland3/120/90"}, "fit": "cover", "usageHint": "smallFeature"}}},
    {"id": "meta-row", "component": {"Row": {"children": {"explicitList": ["loc-icon", "loc-text", "views-text"]}, "alignment": "center", "distribution": "spaceBetween"}}},
    {"id": "loc-icon", "component": {"Icon": {"name": {"literalString": "locationOn"}}}},
    {"id": "loc-text", "component": {"Text": {"text": {"literalString": "Reykjavik, Iceland"}, "usageHint": "caption"}}},
    {"id": "views-text", "component": {"Text": {"text": {"literalString": "2.1K views"}, "usageHint": "caption"}}}
  ]}},
  {"beginRendering": {"surfaceId": "photos", "root": "root"}}
]
```

## Music Player (v0.10)

```json
[
  {"createSurface": {"surfaceId": "music", "rootComponentId": "root"}},
  {"updateComponents": {"surfaceId": "music", "components": [
    {"id": "root", "component": "Card", "child": "col"},
    {"id": "col", "component": "Column", "children": ["art-row", "track-info", "prog", "controls"]},
    {"id": "art-row", "component": "Row", "children": ["art", "track-meta"], "align": "center"},
    {"id": "art", "component": "Image", "url": {"path": "/art"}, "variant": "smallFeature", "fit": "cover"},
    {"id": "track-meta", "component": "Column", "children": ["track-name", "artist", "badge-row"]},
    {"id": "track-name", "component": "Text", "text": {"path": "/track"}, "variant": "h4"},
    {"id": "artist", "component": "Text", "text": {"path": "/artist"}, "variant": "caption"},
    {"id": "badge-row", "component": "Row", "children": ["genre-badge"]},
    {"id": "genre-badge", "component": "Badge", "label": {"path": "/genre"}, "variant": "info"},
    {"id": "prog", "component": "Slider", "label": {"literalString": "Progress"}, "value": {"path": "/progress"}, "min": 0, "max": 100},
    {"id": "controls", "component": "Row", "children": ["prev-btn", "play-btn", "next-btn"], "justify": "center", "align": "center"},
    {"id": "prev-text", "component": "Text", "text": {"literalString": "Previous"}},
    {"id": "prev-btn", "component": "Button", "child": "prev-text", "variant": "borderless"},
    {"id": "play-text", "component": "Text", "text": {"path": "/playLabel"}},
    {"id": "play-btn", "component": "Button", "child": "play-text", "variant": "primary", "action": {"event": {"name": "play_pause"}}},
    {"id": "next-text", "component": "Text", "text": {"literalString": "Next"}},
    {"id": "next-btn", "component": "Button", "child": "next-text", "variant": "borderless"}
  ]}},
  {"updateDataModel": {"surfaceId": "music", "data": {
    "art": "https://picsum.photos/seed/album/120/120",
    "track": "Midnight Wandering",
    "artist": "Luna & The Echoes",
    "genre": "Indie Pop",
    "progress": 42,
    "playLabel": "Pause"
  }}}
]
```

## Video Player (v0.8)

```json
[
  {"surfaceUpdate": {"surfaceId": "video", "components": [
    {"id": "root", "component": {"Card": {"child": "col"}}},
    {"id": "col", "component": {"Column": {"children": {"explicitList": ["vid", "info-row", "desc", "tag-row"]}}}},
    {"id": "vid", "component": {"Video": {"url": {"literalString": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"}}}},
    {"id": "info-row", "component": {"Row": {"children": {"explicitList": ["vtitle", "dur-badge"]}, "distribution": "spaceBetween", "alignment": "center"}}},
    {"id": "vtitle", "component": {"Text": {"text": {"literalString": "Big Buck Bunny"}, "usageHint": "h4"}}},
    {"id": "dur-badge", "component": {"Badge": {"label": {"literalString": "9:56"}, "variant": "neutral"}}},
    {"id": "desc", "component": {"Text": {"text": {"literalString": "A lovably naive bunny discovers the joys of friendship."}, "usageHint": "caption"}}},
    {"id": "tag-row", "component": {"Row": {"children": {"explicitList": ["t-anim", "t-short"]}}}},
    {"id": "t-anim", "component": {"Badge": {"label": {"literalString": "Animation"}, "variant": "primary"}}},
    {"id": "t-short", "component": {"Badge": {"label": {"literalString": "Short Film"}, "variant": "info"}}}
  ]}},
  {"beginRendering": {"surfaceId": "video", "root": "root"}}
]
```

## Podcast Player (v0.8)

```json
[
  {"surfaceUpdate": {"surfaceId": "podcast", "components": [
    {"id": "root", "component": {"Card": {"child": "col"}}},
    {"id": "col", "component": {"Column": {"children": {"explicitList": ["show-row", "player", "divider", "ep-list"]}}}},
    {"id": "show-row", "component": {"Row": {"children": {"explicitList": ["show-art", "show-meta"]}, "alignment": "center"}}},
    {"id": "show-art", "component": {"Image": {"url": {"literalString": "https://picsum.photos/seed/podcast/80/80"}, "fit": "cover", "usageHint": "smallFeature"}}},
    {"id": "show-meta", "component": {"Column": {"children": {"explicitList": ["show-name", "ep-count"]}}}},
    {"id": "show-name", "component": {"Text": {"text": {"literalString": "Design Dialogues"}, "usageHint": "h4"}}},
    {"id": "ep-count", "component": {"Text": {"text": {"literalString": "Episode 42 \u00b7 58 min"}, "usageHint": "caption"}}},
    {"id": "player", "component": {"AudioPlayer": {"url": {"literalString": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"}}}},
    {"id": "divider", "component": {"Divider": {}}},
    {"id": "ep-list", "component": {"Column": {"children": {"explicitList": ["ep-lbl", "ep1-row"]}}}},
    {"id": "ep-lbl", "component": {"Text": {"text": {"literalString": "More Episodes"}, "usageHint": "h5"}}},
    {"id": "ep1-row", "component": {"Row": {"children": {"explicitList": ["ep1-info", "ep1-dur"]}, "distribution": "spaceBetween", "alignment": "center"}}},
    {"id": "ep1-info", "component": {"Text": {"text": {"literalString": "Ep 41 \u2014 Motion Design Trends"}, "usageHint": "body"}}},
    {"id": "ep1-dur", "component": {"Text": {"text": {"literalString": "44 min"}, "usageHint": "caption"}}}
  ]}},
  {"beginRendering": {"surfaceId": "podcast", "root": "root"}}
]
```
