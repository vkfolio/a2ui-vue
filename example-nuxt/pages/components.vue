<template>
  <div class="flex h-full">
    <!-- Left nav -->
    <div
      class="w-56 shrink-0 border-r overflow-y-auto py-6 px-3"
      style="background: var(--a2ui-sidebar-bg); border-color: var(--a2ui-sidebar-border)"
    >
      <div v-for="category in categories" :key="category.name" class="mb-5">
        <p class="text-[10px] font-semibold uppercase tracking-wider px-3 mb-1.5" style="color: var(--a2ui-muted)">
          {{ category.name }}
        </p>
        <button
          v-for="comp in category.items"
          :key="comp.name"
          @click="selected = comp.name"
          class="w-full text-left px-3 py-2 rounded-lg text-sm border-0 cursor-pointer transition-all duration-150 block"
          :class="selected === comp.name ? 'font-semibold' : ''"
          :style="{
            background: selected === comp.name ? 'var(--a2ui-primary-light)' : 'transparent',
            color: selected === comp.name ? 'var(--a2ui-primary)' : 'var(--a2ui-muted)',
          }"
        >
          {{ comp.name }}
        </button>
      </div>
    </div>

    <!-- Right content -->
    <div class="flex-1 overflow-y-auto p-8">
      <div class="max-w-3xl" v-if="currentComponent">
        <!-- Component name -->
        <h1 class="text-3xl font-bold mb-2" style="color: var(--a2ui-text)">{{ currentComponent.name }}</h1>
        <p class="text-sm mb-8" style="color: var(--a2ui-muted)">{{ currentComponent.description }}</p>

        <!-- Preview -->
        <div class="mb-8">
          <h2 class="text-sm font-semibold uppercase tracking-wider mb-3" style="color: var(--a2ui-muted)">Preview</h2>
          <div
            class="p-6 rounded-xl border"
            style="background: var(--a2ui-card-bg); border-color: var(--a2ui-card-border)"
          >
            <A2StaticRenderer :messages="currentComponent.preview" />
          </div>
        </div>

        <!-- Usage -->
        <div class="mb-8">
          <h2 class="text-sm font-semibold uppercase tracking-wider mb-3" style="color: var(--a2ui-muted)">Usage (JSON)</h2>
          <div class="relative group">
            <pre
              class="p-4 rounded-xl text-sm overflow-x-auto leading-relaxed"
              style="background: var(--a2ui-code-bg); color: #a6e3a1"
            ><code>{{ currentComponent.usage }}</code></pre>
            <button
              @click="copyUsage"
              class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 px-2.5 py-1.5 rounded-lg text-xs border-0 cursor-pointer transition-all duration-150 text-white"
              style="background: rgba(255,255,255,0.15)"
            >
              Copy
            </button>
          </div>
        </div>

        <!-- Props -->
        <div>
          <h2 class="text-sm font-semibold uppercase tracking-wider mb-3" style="color: var(--a2ui-muted)">Props</h2>
          <div class="rounded-xl border overflow-hidden" style="border-color: var(--a2ui-card-border)">
            <table class="w-full text-sm">
              <thead>
                <tr style="background: var(--a2ui-input-bg)">
                  <th class="text-left px-4 py-3 font-semibold" style="color: var(--a2ui-text)">Name</th>
                  <th class="text-left px-4 py-3 font-semibold" style="color: var(--a2ui-text)">Description</th>
                  <th class="text-left px-4 py-3 font-semibold" style="color: var(--a2ui-text)">Default</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(prop, i) in currentComponent.props"
                  :key="prop.name"
                  class="border-t"
                  :style="{ borderColor: 'var(--a2ui-card-border)', background: i % 2 === 0 ? 'var(--a2ui-card-bg)' : 'var(--a2ui-input-bg)' }"
                >
                  <td class="px-4 py-3 font-mono text-xs" style="color: var(--a2ui-primary)">{{ prop.name }}</td>
                  <td class="px-4 py-3" style="color: var(--a2ui-muted)">{{ prop.description }}</td>
                  <td class="px-4 py-3 font-mono text-xs" style="color: var(--a2ui-muted)">{{ prop.default }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { A2StaticRenderer } from 'a2ui-vue'

const selected = ref('Row')

function copyUsage() {
  if (currentComponent.value) {
    navigator.clipboard.writeText(currentComponent.value.usage)
  }
}

const componentDefs = {
  Row: {
    name: 'Row',
    description: 'Horizontal flex container that arranges children in a row. Supports alignment and distribution options for flexible layouts.',
    preview: [
      { surfaceUpdate: { surfaceId: 'prev-row', components: [
        { id: 'root', component: { Card: { child: 'row' } } },
        { id: 'row', component: { Row: { children: { explicitList: ['a', 'b', 'c'] }, alignment: 'center', distribution: 'spaceAround' } } },
        { id: 'a', component: { Text: { text: 'Item A', usageHint: 'body' } } },
        { id: 'b', component: { Text: { text: 'Item B', usageHint: 'body' } } },
        { id: 'c', component: { Text: { text: 'Item C', usageHint: 'body' } } },
      ] } },
      { beginRendering: { surfaceId: 'prev-row', root: 'root' } },
    ],
    usage: `{ "id": "my-row", "component": { "Row": {
  "children": { "explicitList": ["child-1", "child-2"] },
  "alignment": "center",
  "distribution": "spaceBetween"
}}}`,
    props: [
      { name: 'children', description: 'ChildList of component IDs to render', default: 'required' },
      { name: 'alignment', description: 'Cross-axis alignment: start, center, end, stretch', default: '"start"' },
      { name: 'distribution', description: 'Main-axis distribution: start, center, end, spaceBetween, spaceAround, spaceEvenly', default: '"start"' },
    ],
  },
  Column: {
    name: 'Column',
    description: 'Vertical flex container that stacks children vertically. The primary layout building block for most A2UI interfaces.',
    preview: [
      { surfaceUpdate: { surfaceId: 'prev-col', components: [
        { id: 'root', component: { Card: { child: 'col' } } },
        { id: 'col', component: { Column: { children: { explicitList: ['a', 'b', 'c'] }, alignment: 'center' } } },
        { id: 'a', component: { Text: { text: 'First', usageHint: 'h3' } } },
        { id: 'b', component: { Text: { text: 'Second', usageHint: 'body' } } },
        { id: 'c', component: { Text: { text: 'Third', usageHint: 'caption' } } },
      ] } },
      { beginRendering: { surfaceId: 'prev-col', root: 'root' } },
    ],
    usage: `{ "id": "my-col", "component": { "Column": {
  "children": { "explicitList": ["child-1", "child-2"] },
  "alignment": "center"
}}}`,
    props: [
      { name: 'children', description: 'ChildList of component IDs', default: 'required' },
      { name: 'alignment', description: 'Cross-axis alignment: start, center, end, stretch', default: '"start"' },
      { name: 'distribution', description: 'Main-axis distribution', default: '"start"' },
    ],
  },
  List: {
    name: 'List',
    description: 'Scrollable list container. Can be vertical or horizontal. Ideal for rendering dynamic collections of items.',
    preview: [
      { surfaceUpdate: { surfaceId: 'prev-list', components: [
        { id: 'root', component: { Card: { child: 'list' } } },
        { id: 'list', component: { List: { children: { explicitList: ['i1', 'i2', 'i3'] }, direction: 'vertical' } } },
        { id: 'i1', component: { Text: { text: 'List item 1', usageHint: 'body' } } },
        { id: 'i2', component: { Text: { text: 'List item 2', usageHint: 'body' } } },
        { id: 'i3', component: { Text: { text: 'List item 3', usageHint: 'body' } } },
      ] } },
      { beginRendering: { surfaceId: 'prev-list', root: 'root' } },
    ],
    usage: `{ "id": "my-list", "component": { "List": {
  "children": { "explicitList": ["item-1", "item-2"] },
  "direction": "vertical"
}}}`,
    props: [
      { name: 'children', description: 'ChildList of component IDs', default: 'required' },
      { name: 'direction', description: 'Scroll direction: vertical or horizontal', default: '"vertical"' },
      { name: 'alignment', description: 'Cross-axis alignment', default: '"start"' },
    ],
  },
  Card: {
    name: 'Card',
    description: 'A bordered container with rounded corners and subtle shadow. Typically used as the outermost wrapper for widgets.',
    preview: [
      { surfaceUpdate: { surfaceId: 'prev-card', components: [
        { id: 'root', component: { Card: { child: 'content' } } },
        { id: 'content', component: { Column: { children: { explicitList: ['t', 'b'] }, alignment: 'center' } } },
        { id: 't', component: { Text: { text: 'Card Title', usageHint: 'h3' } } },
        { id: 'b', component: { Text: { text: 'This content is inside a Card component.', usageHint: 'body' } } },
      ] } },
      { beginRendering: { surfaceId: 'prev-card', root: 'root' } },
    ],
    usage: `{ "id": "root", "component": { "Card": {
  "child": "content-component-id"
}}}`,
    props: [
      { name: 'child', description: 'Single child component ID to render inside the card', default: 'required' },
    ],
  },
  Text: {
    name: 'Text',
    description: 'Renders text with configurable typography. Supports heading levels (h1-h5), body text, and captions.',
    preview: [
      { surfaceUpdate: { surfaceId: 'prev-text', components: [
        { id: 'root', component: { Card: { child: 'col' } } },
        { id: 'col', component: { Column: { children: { explicitList: ['h1', 'h2', 'h3', 'body', 'cap'] } } } },
        { id: 'h1', component: { Text: { text: 'Heading 1', usageHint: 'h1' } } },
        { id: 'h2', component: { Text: { text: 'Heading 2', usageHint: 'h2' } } },
        { id: 'h3', component: { Text: { text: 'Heading 3', usageHint: 'h3' } } },
        { id: 'body', component: { Text: { text: 'Body text for paragraphs and content.', usageHint: 'body' } } },
        { id: 'cap', component: { Text: { text: 'Caption text for metadata', usageHint: 'caption' } } },
      ] } },
      { beginRendering: { surfaceId: 'prev-text', root: 'root' } },
    ],
    usage: `{ "id": "my-text", "component": { "Text": {
  "text": "Hello World",
  "usageHint": "h2"
}}}`,
    props: [
      { name: 'text', description: 'DynamicString: literal string or { path: "/key" } data binding', default: 'required' },
      { name: 'usageHint', description: 'Typography variant: h1, h2, h3, h4, h5, caption, body', default: '"body"' },
    ],
  },
  Image: {
    name: 'Image',
    description: 'Displays an image with aspect-ratio sizing variants, shimmer skeleton while loading, and graceful error state.',
    preview: [
      { surfaceUpdate: { surfaceId: 'prev-img', components: [
        { id: 'root', component: { Card: { child: 'col' } } },
        { id: 'col', component: { Column: { children: { explicitList: ['lbl-row', 'img-med', 'lbl-sm', 'sm-row'] } } } },
        { id: 'lbl-row', component: { Text: { text: { literalString: 'mediumFeature (16:9)' }, usageHint: 'caption' } } },
        { id: 'img-med', component: { Image: { url: { literalString: 'https://picsum.photos/seed/mountains/600/338' }, fit: 'cover', usageHint: 'mediumFeature' } } },
        { id: 'lbl-sm', component: { Text: { text: { literalString: 'smallFeature thumbnails' }, usageHint: 'caption' } } },
        { id: 'sm-row', component: { Row: { children: { explicitList: ['img-s1','img-s2','img-s3'] } } } },
        { id: 'img-s1', component: { Image: { url: { literalString: 'https://picsum.photos/seed/city1/120/120' }, fit: 'cover', usageHint: 'smallFeature' } } },
        { id: 'img-s2', component: { Image: { url: { literalString: 'https://picsum.photos/seed/city2/120/120' }, fit: 'cover', usageHint: 'smallFeature' } } },
        { id: 'img-s3', component: { Image: { url: { literalString: 'https://picsum.photos/seed/city3/120/120' }, fit: 'cover', usageHint: 'smallFeature' } } },
      ] } },
      { beginRendering: { surfaceId: 'prev-img', root: 'root' } },
    ],
    usage: `{ "id": "hero", "component": { "Image": {
  "url": { "path": "/imageUrl" },
  "fit": "cover",
  "usageHint": "mediumFeature"
}}}`,
    props: [
      { name: 'url / src', description: 'DynamicString — image URL or data binding', default: 'required' },
      { name: 'fit', description: 'Object-fit mode: cover · contain · fill · none · scaleDown', default: '"cover"' },
      { name: 'usageHint / variant', description: 'icon · avatar · smallFeature · mediumFeature · largeFeature · header · cover · banner', default: '"mediumFeature"' },
      { name: 'alt', description: 'DynamicString — accessibility label', default: '-' },
      { name: 'borderRadius', description: 'CSS border-radius override (e.g. "50%" or "8px")', default: 'auto' },
    ],
  },
  Icon: {
    name: 'Icon',
    description: 'Renders a Material Icon by name. See the Icons page for the full list of available icon names.',
    preview: [
      { surfaceUpdate: { surfaceId: 'prev-icon', components: [
        { id: 'root', component: { Card: { child: 'row' } } },
        { id: 'row', component: { Row: { children: { explicitList: ['i1', 'i2', 'i3', 'i4', 'i5'] }, distribution: 'spaceAround' } } },
        { id: 'i1', component: { Icon: { name: { literalString: 'home' } } } },
        { id: 'i2', component: { Icon: { name: { literalString: 'favorite' } } } },
        { id: 'i3', component: { Icon: { name: { literalString: 'settings' } } } },
        { id: 'i4', component: { Icon: { name: { literalString: 'star' } } } },
        { id: 'i5', component: { Icon: { name: { literalString: 'search' } } } },
      ] } },
      { beginRendering: { surfaceId: 'prev-icon', root: 'root' } },
    ],
    usage: `{ "id": "my-icon", "component": { "Icon": {
  "name": { "literalString": "favorite" }
}}}`,
    props: [
      { name: 'name', description: 'DynamicString: Material Icon name (camelCase)', default: 'required' },
    ],
  },
  Video: {
    name: 'Video',
    description: 'Full custom video player — 16:9 aspect ratio, gradient seek bar with buffered progress, auto-hiding controls, volume slider, fullscreen, and loading spinner.',
    preview: [
      { surfaceUpdate: { surfaceId: 'prev-vid', components: [
        { id: 'root', component: { Card: { child: 'vid' } } },
        { id: 'vid', component: { Video: {
          url: { literalString: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' },
          poster: { literalString: 'https://picsum.photos/seed/video-poster/600/338' },
          title: { literalString: 'Big Buck Bunny — Sample Video' },
        } } },
      ] } },
      { beginRendering: { surfaceId: 'prev-vid', root: 'root' } },
    ],
    usage: `{ "id": "hero-video", "component": { "Video": {
  "url": { "path": "/videoUrl" },
  "poster": { "path": "/posterUrl" },
  "title": { "literalString": "My Video" }
}}}`,
    props: [
      { name: 'url / src', description: 'DynamicString — video source URL', default: 'required' },
      { name: 'poster / thumbnail', description: 'DynamicString — poster image shown before play', default: '-' },
      { name: 'title / description', description: 'DynamicString — label shown above the player', default: '-' },
    ],
  },
  AudioPlayer: {
    name: 'AudioPlayer',
    description: 'Custom audio player with spinning cover art disc, track title + artist, ±10s skip, gradient seek bar, volume popup, and loading spinner.',
    preview: [
      { surfaceUpdate: { surfaceId: 'prev-audio', components: [
        { id: 'root', component: { Card: { child: 'audio' } } },
        { id: 'audio', component: { AudioPlayer: {
          url: { literalString: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
          title: { literalString: 'Midnight Wandering' },
          artist: { literalString: 'Luna & The Echoes' },
          cover: { literalString: 'https://picsum.photos/seed/midnight-album/120/120' },
        } } },
      ] } },
      { beginRendering: { surfaceId: 'prev-audio', root: 'root' } },
    ],
    usage: `{ "id": "player", "component": { "AudioPlayer": {
  "url": { "path": "/audioUrl" },
  "title": { "path": "/trackName" },
  "artist": { "path": "/artistName" },
  "cover": { "path": "/coverUrl" }
}}}`,
    props: [
      { name: 'url / src', description: 'DynamicString — audio source URL', default: 'required' },
      { name: 'title / description / label', description: 'DynamicString — track name', default: '-' },
      { name: 'artist / subtitle', description: 'DynamicString — artist or subtitle', default: '-' },
      { name: 'cover / image / thumbnail', description: 'DynamicString — album art URL', default: '-' },
    ],
  },
  TextField: {
    name: 'TextField',
    description: 'Text input field with label and optional variant. Supports short text, long text, number, and obscured (password) modes.',
    preview: [
      { surfaceUpdate: { surfaceId: 'prev-tf', components: [
        { id: 'root', component: { Card: { child: 'col' } } },
        { id: 'col', component: { Column: { children: { explicitList: ['f1', 'f2'] } } } },
        { id: 'f1', component: { TextField: { label: { literalString: 'Username' }, text: { path: '/user' } } } },
        { id: 'f2', component: { TextField: { label: { literalString: 'Password' }, text: { path: '/pass' }, textFieldType: 'obscured' } } },
      ] } },
      { dataModelUpdate: { surfaceId: 'prev-tf', contents: [{ key: 'user', valueString: 'john_doe' }, { key: 'pass', valueString: '' }] } },
      { beginRendering: { surfaceId: 'prev-tf', root: 'root' } },
    ],
    usage: `{ "id": "my-field", "component": { "TextField": {
  "label": { "literalString": "Email" },
  "text": { "path": "/email" },
  "textFieldType": "shortText"
}}}`,
    props: [
      { name: 'label', description: 'DynamicString: input label', default: '-' },
      { name: 'text', description: 'DynamicString: bound value (use path for data binding)', default: 'required' },
      { name: 'textFieldType', description: 'Variant: shortText, longText, number, obscured', default: '"shortText"' },
    ],
  },
  CheckBox: {
    name: 'CheckBox',
    description: 'Boolean toggle checkbox with a label.',
    preview: [
      { surfaceUpdate: { surfaceId: 'prev-cb', components: [
        { id: 'root', component: { Card: { child: 'col' } } },
        { id: 'col', component: { Column: { children: { explicitList: ['c1', 'c2'] } } } },
        { id: 'c1', component: { CheckBox: { label: { literalString: 'Accept terms' }, value: { path: '/accept' } } } },
        { id: 'c2', component: { CheckBox: { label: { literalString: 'Subscribe to newsletter' }, value: { path: '/sub' } } } },
      ] } },
      { dataModelUpdate: { surfaceId: 'prev-cb', contents: [{ key: 'accept', valueString: 'true' }, { key: 'sub', valueString: 'false' }] } },
      { beginRendering: { surfaceId: 'prev-cb', root: 'root' } },
    ],
    usage: `{ "id": "my-check", "component": { "CheckBox": {
  "label": { "literalString": "I agree" },
  "value": { "path": "/agreed" }
}}}`,
    props: [
      { name: 'label', description: 'DynamicString: checkbox label', default: '-' },
      { name: 'value', description: 'DynamicBoolean: bound boolean value', default: 'required' },
    ],
  },
  Slider: {
    name: 'Slider',
    description: 'Numeric range slider with min, max, and current value.',
    preview: [
      { surfaceUpdate: { surfaceId: 'prev-slider', components: [
        { id: 'root', component: { Card: { child: 'slider' } } },
        { id: 'slider', component: { Slider: { label: { literalString: 'Volume' }, min: 0, max: 100, value: { path: '/vol' } } } },
      ] } },
      { dataModelUpdate: { surfaceId: 'prev-slider', contents: [{ key: 'vol', valueString: '65' }] } },
      { beginRendering: { surfaceId: 'prev-slider', root: 'root' } },
    ],
    usage: `{ "id": "my-slider", "component": { "Slider": {
  "label": { "literalString": "Brightness" },
  "min": 0, "max": 100,
  "value": { "path": "/brightness" }
}}}`,
    props: [
      { name: 'label', description: 'DynamicString: slider label', default: '-' },
      { name: 'min', description: 'Minimum value', default: '0' },
      { name: 'max', description: 'Maximum value', default: '100' },
      { name: 'value', description: 'DynamicNumber: current value', default: 'required' },
    ],
  },
  DateTimeInput: {
    name: 'DateTimeInput',
    description: 'Date and/or time picker input. Can enable date, time, or both.',
    preview: [
      { surfaceUpdate: { surfaceId: 'prev-dt', components: [
        { id: 'root', component: { Card: { child: 'dt' } } },
        { id: 'dt', component: { DateTimeInput: { label: { literalString: 'Event Date' }, value: { path: '/date' }, enableDate: true, enableTime: true } } },
      ] } },
      { dataModelUpdate: { surfaceId: 'prev-dt', contents: [{ key: 'date', valueString: '2025-03-15T14:00' }] } },
      { beginRendering: { surfaceId: 'prev-dt', root: 'root' } },
    ],
    usage: `{ "id": "my-date", "component": { "DateTimeInput": {
  "label": { "literalString": "Start Date" },
  "value": { "path": "/startDate" },
  "enableDate": true, "enableTime": true
}}}`,
    props: [
      { name: 'value', description: 'DynamicString: ISO date/time string', default: 'required' },
      { name: 'label', description: 'DynamicString: input label', default: '-' },
      { name: 'enableDate', description: 'Show date picker', default: 'true' },
      { name: 'enableTime', description: 'Show time picker', default: 'false' },
    ],
  },
  MultipleChoice: {
    name: 'MultipleChoice',
    description: 'Selection picker supporting single (mutuallyExclusive) or multi-select modes. Displays as chips or checkboxes.',
    preview: [
      { surfaceUpdate: { surfaceId: 'prev-mc', components: [
        { id: 'root', component: { Card: { child: 'mc' } } },
        { id: 'mc', component: { ChoicePicker: { label: { literalString: 'Favorite Color' }, options: [{ label: 'Red', value: 'red' }, { label: 'Blue', value: 'blue' }, { label: 'Green', value: 'green' }], value: { path: '/color' }, variant: 'mutuallyExclusive', displayStyle: 'chips' } } },
      ] } },
      { dataModelUpdate: { surfaceId: 'prev-mc', contents: [{ key: 'color', valueString: '["blue"]' }] } },
      { beginRendering: { surfaceId: 'prev-mc', root: 'root' } },
    ],
    usage: `{ "id": "my-picker", "component": { "ChoicePicker": {
  "label": { "literalString": "Size" },
  "options": [{ "label": "S", "value": "s" }, { "label": "M", "value": "m" }],
  "value": { "path": "/size" },
  "variant": "mutuallyExclusive",
  "displayStyle": "chips"
}}}`,
    props: [
      { name: 'label', description: 'DynamicString: picker label', default: '-' },
      { name: 'options', description: 'Array of { label, value } objects', default: 'required' },
      { name: 'value', description: 'DynamicStringList: selected value(s)', default: 'required' },
      { name: 'variant', description: 'mutuallyExclusive or multipleSelection', default: '"mutuallyExclusive"' },
      { name: 'displayStyle', description: 'checkbox or chips', default: '"chips"' },
    ],
  },
  Button: {
    name: 'Button',
    description: 'Clickable button that triggers an action. Contains a single child component (usually Text). Supports default, primary, and borderless variants.',
    preview: [
      { surfaceUpdate: { surfaceId: 'prev-btn', components: [
        { id: 'root', component: { Card: { child: 'row' } } },
        { id: 'row', component: { Row: { children: { explicitList: ['b1', 'b2', 'b3'] } } } },
        { id: 't1', component: { Text: { text: 'Default' } } },
        { id: 'b1', component: { Button: { child: 't1', action: { name: 'click', context: [] } } } },
        { id: 't2', component: { Text: { text: 'Primary' } } },
        { id: 'b2', component: { Button: { child: 't2', action: { name: 'click', context: [] }, variant: 'primary' } } },
        { id: 't3', component: { Text: { text: 'Borderless' } } },
        { id: 'b3', component: { Button: { child: 't3', action: { name: 'click', context: [] }, variant: 'borderless' } } },
      ] } },
      { beginRendering: { surfaceId: 'prev-btn', root: 'root' } },
    ],
    usage: `{ "id": "my-btn", "component": { "Button": {
  "child": "btn-text-id",
  "action": { "name": "submit", "context": [] },
  "variant": "primary"
}}}`,
    props: [
      { name: 'child', description: 'Component ID for button label (usually a Text)', default: 'required' },
      { name: 'action', description: 'Action to emit: { name, context }', default: 'required' },
      { name: 'variant', description: 'Style variant: default, primary, borderless', default: '"default"' },
    ],
  },
  Tabs: {
    name: 'Tabs',
    description: 'Tabbed container that shows one panel at a time. Each tab has a title and a child component.',
    preview: [
      { surfaceUpdate: { surfaceId: 'prev-tabs', components: [
        { id: 'root', component: { Card: { child: 'tabs' } } },
        { id: 'tabs', component: { Tabs: { tabs: [{ title: 'Tab 1', child: 'p1' }, { title: 'Tab 2', child: 'p2' }] } } },
        { id: 'p1', component: { Text: { text: 'Content for tab 1', usageHint: 'body' } } },
        { id: 'p2', component: { Text: { text: 'Content for tab 2', usageHint: 'body' } } },
      ] } },
      { beginRendering: { surfaceId: 'prev-tabs', root: 'root' } },
    ],
    usage: `{ "id": "my-tabs", "component": { "Tabs": {
  "tabs": [
    { "title": "Overview", "child": "overview-content" },
    { "title": "Details", "child": "details-content" }
  ]
}}}`,
    props: [
      { name: 'tabs', description: 'Array of { title: DynamicString, child: componentId }', default: 'required' },
    ],
  },
  Modal: {
    name: 'Modal',
    description: 'Overlay dialog that appears on top of current content. Has a trigger component and content component.',
    preview: [
      { surfaceUpdate: { surfaceId: 'prev-modal', components: [
        { id: 'root', component: { Card: { child: 'txt' } } },
        { id: 'txt', component: { Text: { text: 'Modal has a trigger (Button) and content (any component). Click the trigger to open the overlay.', usageHint: 'body' } } },
      ] } },
      { beginRendering: { surfaceId: 'prev-modal', root: 'root' } },
    ],
    usage: `{ "id": "my-modal", "component": { "Modal": {
  "trigger": "open-btn-id",
  "content": "modal-content-id"
}}}`,
    props: [
      { name: 'trigger', description: 'Component ID for the trigger element', default: 'required' },
      { name: 'content', description: 'Component ID for modal body', default: 'required' },
    ],
  },
  Divider: {
    name: 'Divider',
    description: 'A horizontal or vertical separator line used to visually divide sections of content.',
    preview: [
      { surfaceUpdate: { surfaceId: 'prev-div', components: [
        { id: 'root', component: { Card: { child: 'col' } } },
        { id: 'col', component: { Column: { children: { explicitList: ['a', 'd', 'b'] } } } },
        { id: 'a', component: { Text: { text: 'Section A', usageHint: 'body' } } },
        { id: 'd', component: { Divider: {} } },
        { id: 'b', component: { Text: { text: 'Section B', usageHint: 'body' } } },
      ] } },
      { beginRendering: { surfaceId: 'prev-div', root: 'root' } },
    ],
    usage: `{ "id": "my-divider", "component": { "Divider": {
  "axis": "horizontal"
}}}`,
    props: [
      { name: 'axis', description: 'Orientation: horizontal or vertical', default: '"horizontal"' },
    ],
  },

  // ── New extended components ───────────────────────────────────────────
  Badge: {
    name: 'Badge',
    description: 'A compact pill-shaped label for status, categories, or counts. Supports success, warning, error, info, neutral, and primary variants.',
    preview: [
      { createSurface: { surfaceId: 'prev-badge', rootComponentId: 'root' } },
      { updateComponents: { surfaceId: 'prev-badge', components: [
        { id: 'root', component: 'Card', child: 'col' },
        { id: 'col', component: 'Column', children: ['row1', 'row2'] },
        { id: 'row1', component: 'Row', children: ['b1', 'b2', 'b3'], justify: 'start', align: 'center' },
        { id: 'b1', component: 'Badge', label: { literalString: 'Success' }, variant: 'success' },
        { id: 'b2', component: 'Badge', label: { literalString: 'Warning' }, variant: 'warning' },
        { id: 'b3', component: 'Badge', label: { literalString: 'Error' }, variant: 'error' },
        { id: 'row2', component: 'Row', children: ['b4', 'b5', 'b6'], justify: 'start', align: 'center' },
        { id: 'b4', component: 'Badge', label: { literalString: 'Info' }, variant: 'info' },
        { id: 'b5', component: 'Badge', label: { literalString: 'Neutral' }, variant: 'neutral' },
        { id: 'b6', component: 'Badge', label: { literalString: 'Primary' }, variant: 'primary' },
      ] } },
    ],
    usage: `{ "id": "my-badge", "component": "Badge",
  "label": { "literalString": "Active" },
  "variant": "success"
}`,
    props: [
      { name: 'label', description: 'DynamicString: badge text', default: 'required' },
      { name: 'variant', description: 'Color variant: success, warning, error, info, neutral, primary', default: '"neutral"' },
    ],
  },

  Progress: {
    name: 'Progress',
    description: 'Animated progress bar. Supports linear (default) and circular variants. Value is 0–100.',
    preview: [
      { createSurface: { surfaceId: 'prev-prog', rootComponentId: 'root' } },
      { updateComponents: { surfaceId: 'prev-prog', components: [
        { id: 'root', component: 'Card', child: 'col' },
        { id: 'col', component: 'Column', children: ['p1', 'p2', 'row'] },
        { id: 'p1', component: 'Progress', value: { literalString: '72' }, label: { literalString: 'Project Completion' }, variant: 'linear' },
        { id: 'p2', component: 'Progress', value: { literalString: '45' }, label: { literalString: 'Storage Used' }, variant: 'linear' },
        { id: 'row', component: 'Row', children: ['circ'], justify: 'center' },
        { id: 'circ', component: 'Progress', value: { literalString: '84' }, label: { literalString: 'Uptime' }, variant: 'circular' },
      ] } },
    ],
    usage: `{ "id": "my-progress", "component": "Progress",
  "value": { "path": "/percent" },
  "label": { "literalString": "Loading..." },
  "variant": "linear"
}`,
    props: [
      { name: 'value', description: 'DynamicNumber: 0–100', default: 'required' },
      { name: 'label', description: 'DynamicString: optional label text', default: '-' },
      { name: 'variant', description: 'Display style: linear or circular', default: '"linear"' },
    ],
  },

  Rating: {
    name: 'Rating',
    description: 'Star rating display (0–5). Supports half-stars. Can be interactive (clickable) to emit a rating action.',
    preview: [
      { createSurface: { surfaceId: 'prev-rating', rootComponentId: 'root' } },
      { updateComponents: { surfaceId: 'prev-rating', components: [
        { id: 'root', component: 'Card', child: 'col' },
        { id: 'col', component: 'Column', children: ['r1', 'r2', 'r3'] },
        { id: 'r1', component: 'Rating', value: { literalString: '5' }, label: { literalString: 'Excellent' } },
        { id: 'r2', component: 'Rating', value: { literalString: '3.5' }, label: { literalString: 'Good' } },
        { id: 'r3', component: 'Rating', value: { literalString: '2' }, label: { literalString: 'Fair' } },
      ] } },
    ],
    usage: `{ "id": "my-rating", "component": "Rating",
  "value": { "path": "/stars" },
  "label": { "literalString": "(1,240 reviews)" },
  "interactive": false
}`,
    props: [
      { name: 'value', description: 'DynamicNumber: rating value 0–5 (supports decimals)', default: 'required' },
      { name: 'maxStars', description: 'Total star count', default: '5' },
      { name: 'label', description: 'DynamicString: label shown beside stars', default: '-' },
      { name: 'interactive', description: 'Allow user to click stars and emit action', default: 'false' },
    ],
  },

  Avatar: {
    name: 'Avatar',
    description: 'User avatar with image or auto-generated initials fallback. Shows an optional online/offline/away status dot.',
    preview: [
      { createSurface: { surfaceId: 'prev-avatar', rootComponentId: 'root' } },
      { updateComponents: { surfaceId: 'prev-avatar', components: [
        { id: 'root', component: 'Card', child: 'col' },
        { id: 'col', component: 'Column', children: ['row1', 'row2'] },
        { id: 'row1', component: 'Row', children: ['a1', 'a2', 'a3', 'a4'], align: 'center', justify: 'start' },
        { id: 'a1', component: 'Avatar', name: { literalString: 'Sarah Chen' }, src: { literalString: 'https://randomuser.me/api/portraits/women/44.jpg' }, size: 'xl', status: 'online' },
        { id: 'a2', component: 'Avatar', name: { literalString: 'Marcus Lee' }, size: 'lg', status: 'away' },
        { id: 'a3', component: 'Avatar', name: { literalString: 'Jordan Park' }, size: 'md', status: 'offline' },
        { id: 'a4', component: 'Avatar', name: { literalString: 'Alex Kim' }, size: 'sm', status: 'busy' },
        { id: 'row2', component: 'Row', children: ['label1'], align: 'center' },
        { id: 'label1', component: 'Text', text: { literalString: 'xl (with photo) · lg · md · sm — all with initials fallback' }, usageHint: 'caption' },
      ] } },
    ],
    usage: `{ "id": "my-avatar", "component": "Avatar",
  "name": { "path": "/userName" },
  "src": { "path": "/userPhoto" },
  "size": "md",
  "status": "online"
}`,
    props: [
      { name: 'name', description: 'DynamicString: full name (used for initials fallback)', default: 'required' },
      { name: 'src', description: 'DynamicString: image URL (optional)', default: '-' },
      { name: 'size', description: 'Size: xs, sm, md, lg, xl', default: '"md"' },
      { name: 'status', description: 'Status dot: online, offline, away, busy', default: '-' },
    ],
  },

  Alert: {
    name: 'Alert',
    description: 'Inline notification banner with a severity level. Supports dismissible mode. Great for feedback, warnings, and errors.',
    preview: [
      { createSurface: { surfaceId: 'prev-alert', rootComponentId: 'root' } },
      { updateComponents: { surfaceId: 'prev-alert', components: [
        { id: 'root', component: 'Card', child: 'col' },
        { id: 'col', component: 'Column', children: ['a1', 'a2', 'a3', 'a4'] },
        { id: 'a1', component: 'Alert', title: { literalString: 'Info' }, message: { literalString: 'Your session will expire in 10 minutes.' }, severity: 'info' },
        { id: 'a2', component: 'Alert', title: { literalString: 'Success' }, message: { literalString: 'Changes saved successfully.' }, severity: 'success' },
        { id: 'a3', component: 'Alert', title: { literalString: 'Warning' }, message: { literalString: 'Storage is at 85% capacity.' }, severity: 'warning' },
        { id: 'a4', component: 'Alert', message: { literalString: 'Authentication failed. Please try again.' }, severity: 'error', dismissible: true },
      ] } },
    ],
    usage: `{ "id": "my-alert", "component": "Alert",
  "title": { "literalString": "Action needed" },
  "message": { "path": "/alertMessage" },
  "severity": "warning",
  "dismissible": true
}`,
    props: [
      { name: 'message', description: 'DynamicString: main alert text', default: 'required' },
      { name: 'title', description: 'DynamicString: optional bold title', default: '-' },
      { name: 'severity', description: 'Color style: info, success, warning, error', default: '"info"' },
      { name: 'dismissible', description: 'Show a close button to hide the alert', default: 'false' },
    ],
  },

  Stat: {
    name: 'Stat',
    description: 'Large metric display for dashboards. Shows a primary value, a label, and an optional trend indicator (up/down/neutral).',
    preview: [
      { createSurface: { surfaceId: 'prev-stat', rootComponentId: 'root' } },
      { updateComponents: { surfaceId: 'prev-stat', components: [
        { id: 'root', component: 'Card', child: 'row' },
        { id: 'row', component: 'Row', children: ['s1', 's2', 's3'], justify: 'spaceBetween' },
        { id: 's1', component: 'Stat', value: { literalString: '$48.2K' }, label: { literalString: 'Revenue' }, trend: { literalString: '+14%' }, trendDirection: 'up', icon: { literalString: 'payments' } },
        { id: 's2', component: 'Stat', value: { literalString: '3,841' }, label: { literalString: 'Orders' }, trend: { literalString: '+7%' }, trendDirection: 'up', icon: { literalString: 'shopping_cart' } },
        { id: 's3', component: 'Stat', value: { literalString: '1.8%' }, label: { literalString: 'Churn' }, trend: { literalString: '-0.3%' }, trendDirection: 'down', icon: { literalString: 'trending_down' } },
      ] } },
    ],
    usage: `{ "id": "my-stat", "component": "Stat",
  "value": { "path": "/revenue" },
  "label": { "literalString": "Monthly Revenue" },
  "trend": { "literalString": "+12%" },
  "trendDirection": "up",
  "icon": { "literalString": "payments" }
}`,
    props: [
      { name: 'value', description: 'DynamicString: the primary metric value', default: 'required' },
      { name: 'label', description: 'DynamicString: description below the value', default: '-' },
      { name: 'trend', description: 'DynamicString: trend text e.g. "+12%"', default: '-' },
      { name: 'trendDirection', description: 'up, down, or neutral', default: '"neutral"' },
      { name: 'icon', description: 'DynamicString: Material Icon name for the icon chip', default: '-' },
    ],
  },
}

const categories = [
  { name: 'Layout', items: [componentDefs.Row, componentDefs.Column, componentDefs.List, componentDefs.Card] },
  { name: 'Content', items: [componentDefs.Text, componentDefs.Image, componentDefs.Icon, componentDefs.Video, componentDefs.AudioPlayer] },
  { name: 'Input', items: [componentDefs.TextField, componentDefs.CheckBox, componentDefs.Slider, componentDefs.DateTimeInput, componentDefs.MultipleChoice] },
  { name: 'Navigation', items: [componentDefs.Button, componentDefs.Tabs, componentDefs.Modal] },
  { name: 'Decoration', items: [componentDefs.Divider] },
  { name: 'Extended', items: [componentDefs.Badge, componentDefs.Progress, componentDefs.Rating, componentDefs.Avatar, componentDefs.Alert, componentDefs.Stat] },
]

const currentComponent = computed(() => {
  for (const cat of categories) {
    for (const comp of cat.items) {
      if (comp.name === selected.value) return comp
    }
  }
  return componentDefs.Row
})
</script>
