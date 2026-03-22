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
    description: 'Displays an image from a URL. Supports multiple fit modes and usage hints for sizing context.',
    preview: [
      { surfaceUpdate: { surfaceId: 'prev-img', components: [
        { id: 'root', component: { Card: { child: 'img' } } },
        { id: 'img', component: { Image: { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop', fit: 'cover' } } },
      ] } },
      { beginRendering: { surfaceId: 'prev-img', root: 'root' } },
    ],
    usage: `{ "id": "my-image", "component": { "Image": {
  "url": { "path": "/imageUrl" },
  "fit": "cover",
  "usageHint": "mediumFeature"
}}}`,
    props: [
      { name: 'url', description: 'DynamicString: image URL or data binding', default: 'required' },
      { name: 'fit', description: 'Object fit: contain, cover, fill, none, scaleDown', default: '"contain"' },
      { name: 'usageHint', description: 'Size hint: icon, avatar, smallFeature, mediumFeature, largeFeature, header', default: '-' },
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
    description: 'Embeds a video player with the given URL.',
    preview: [
      { surfaceUpdate: { surfaceId: 'prev-vid', components: [
        { id: 'root', component: { Card: { child: 'txt' } } },
        { id: 'txt', component: { Text: { text: 'Video component renders a <video> element from a URL.', usageHint: 'body' } } },
      ] } },
      { beginRendering: { surfaceId: 'prev-vid', root: 'root' } },
    ],
    usage: `{ "id": "my-video", "component": { "Video": {
  "url": { "path": "/videoUrl" }
}}}`,
    props: [
      { name: 'url', description: 'DynamicString: video source URL', default: 'required' },
    ],
  },
  AudioPlayer: {
    name: 'AudioPlayer',
    description: 'Renders an audio player with playback controls and an optional description.',
    preview: [
      { surfaceUpdate: { surfaceId: 'prev-audio', components: [
        { id: 'root', component: { Card: { child: 'txt' } } },
        { id: 'txt', component: { Text: { text: 'AudioPlayer renders an <audio> element with controls.', usageHint: 'body' } } },
      ] } },
      { beginRendering: { surfaceId: 'prev-audio', root: 'root' } },
    ],
    usage: `{ "id": "my-audio", "component": { "AudioPlayer": {
  "url": { "path": "/audioUrl" },
  "description": "Episode 1 - Introduction"
}}}`,
    props: [
      { name: 'url', description: 'DynamicString: audio source URL', default: 'required' },
      { name: 'description', description: 'DynamicString: optional description text', default: '-' },
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
}

const categories = [
  { name: 'Layout', items: [componentDefs.Row, componentDefs.Column, componentDefs.List, componentDefs.Card] },
  { name: 'Content', items: [componentDefs.Text, componentDefs.Image, componentDefs.Icon, componentDefs.Video, componentDefs.AudioPlayer] },
  { name: 'Input', items: [componentDefs.TextField, componentDefs.CheckBox, componentDefs.Slider, componentDefs.DateTimeInput, componentDefs.MultipleChoice] },
  { name: 'Navigation', items: [componentDefs.Button, componentDefs.Tabs, componentDefs.Modal] },
  { name: 'Decoration', items: [componentDefs.Divider] },
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
