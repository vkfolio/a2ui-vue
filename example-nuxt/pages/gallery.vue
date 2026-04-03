<template>
  <div class="p-8 max-w-9xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2" style="color: var(--a2ui-text)">Gallery</h1>
      <p class="text-sm" style="color: var(--a2ui-muted)">
        Pre-built A2UI widgets rendered with <code class="px-1.5 py-0.5 rounded text-xs font-mono"
          style="background: var(--a2ui-primary-light); color: var(--a2ui-primary)">A2StaticRenderer</code>.
        Each card is live A2UI JSON rendered in real-time.
      </p>
    </div>

    <!-- Widget grid — Pinterest/masonry style -->
    <div class="gallery-grid">
      <div v-for="widget in widgets" :key="widget.name" class="gallery-item group">
        <!-- Card with title inside -->
        <div class="gallery-card">
          <!-- Title bar -->
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-medium" style="color: var(--a2ui-muted)">{{ widget.name }}</span>
            <button @click="copyJson(widget)"
              class="opacity-0 group-hover:opacity-100 flex items-center gap-1 px-2 py-0.5 rounded text-[10px] border-0 cursor-pointer transition-all duration-150"
              style="background: var(--a2ui-input-bg); color: var(--a2ui-muted)">
              <span class="material-icons text-[11px]">content_copy</span>
              JSON
            </button>
          </div>
          <!-- Widget preview -->
          <A2StaticRenderer :messages="widget.messages" />
        </div>
      </div>
    </div>

    <!-- Copied toast -->
    <Transition name="fade">
      <div v-if="showCopied"
        class="fixed bottom-6 right-6 px-4 py-2.5 rounded-lg text-sm font-medium text-white shadow-lg"
        style="background: var(--a2ui-primary)">
        JSON copied to clipboard
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { A2StaticRenderer } from 'a2ui-vue'

const showCopied = ref(false)

function copyJson(widget: any) {
  navigator.clipboard.writeText(JSON.stringify(widget.messages, null, 2))
  showCopied.value = true
  setTimeout(() => { showCopied.value = false }, 2000)
}

const widgets = [
  {
    name: 'Flight Status',
    icon: 'flight',
    messages: [{ "surfaceUpdate": { "surfaceId": "gallery-flight-status", "components": [{ "id": "root", "component": { "Card": { "child": "main-column" } } }, { "id": "main-column", "component": { "Column": { "children": { "explicitList": ["header-row", "route-row", "divider", "times-row"] }, "alignment": "stretch" } } }, { "id": "header-row", "component": { "Row": { "children": { "explicitList": ["header-left", "date"] }, "distribution": "spaceBetween", "alignment": "center" } } }, { "id": "header-left", "component": { "Row": { "children": { "explicitList": ["flight-indicator", "flight-number"] }, "alignment": "center" } } }, { "id": "flight-indicator", "component": { "Icon": { "name": { "literalString": "send" } } } }, { "id": "flight-number", "component": { "Text": { "text": { "path": "/flightNumber" }, "usageHint": "h3" } } }, { "id": "date", "component": { "Text": { "text": { "path": "/date" }, "usageHint": "caption" } } }, { "id": "route-row", "component": { "Row": { "children": { "explicitList": ["origin", "arrow", "destination"] }, "alignment": "center" } } }, { "id": "origin", "component": { "Text": { "text": { "path": "/origin" }, "usageHint": "h2" } } }, { "id": "arrow", "component": { "Text": { "text": { "literalString": "\u2192" }, "usageHint": "h2" } } }, { "id": "destination", "component": { "Text": { "text": { "path": "/destination" }, "usageHint": "h2" } } }, { "id": "divider", "component": { "Divider": {} } }, { "id": "times-row", "component": { "Row": { "children": { "explicitList": ["departure-col", "status-col", "arrival-col"] }, "distribution": "spaceBetween" } } }, { "id": "departure-col", "component": { "Column": { "children": { "explicitList": ["departure-label", "departure-time"] }, "alignment": "start" } } }, { "id": "departure-label", "component": { "Text": { "text": { "literalString": "Departs" }, "usageHint": "caption" } } }, { "id": "departure-time", "component": { "Text": { "text": { "path": "/departureTime" }, "usageHint": "h3" } } }, { "id": "status-col", "component": { "Column": { "children": { "explicitList": ["status-label", "status-value"] }, "alignment": "center" } } }, { "id": "status-label", "component": { "Text": { "text": { "literalString": "Status" }, "usageHint": "caption" } } }, { "id": "status-value", "component": { "Text": { "text": { "path": "/status" }, "usageHint": "body" } } }, { "id": "arrival-col", "component": { "Column": { "children": { "explicitList": ["arrival-label", "arrival-time"] }, "alignment": "end" } } }, { "id": "arrival-label", "component": { "Text": { "text": { "literalString": "Arrives" }, "usageHint": "caption" } } }, { "id": "arrival-time", "component": { "Text": { "text": { "path": "/arrivalTime" }, "usageHint": "h3" } } }] } }, { "dataModelUpdate": { "surfaceId": "gallery-flight-status", "contents": [{ "key": "flightNumber", "valueString": "OS 87" }, { "key": "date", "valueString": "Mon, Dec 15" }, { "key": "origin", "valueString": "Vienna" }, { "key": "destination", "valueString": "New York" }, { "key": "departureTime", "valueString": "10:15 AM" }, { "key": "status", "valueString": "On Time" }, { "key": "arrivalTime", "valueString": "2:30 PM" }] } }, { "beginRendering": { "surfaceId": "gallery-flight-status", "root": "root" } }],
  },
  {
    name: 'Weather',
    icon: 'wb_sunny',
    messages: [{ "surfaceUpdate": { "surfaceId": "gallery-weather-current", "components": [{ "id": "root", "component": { "Card": { "child": "main-column" } } }, { "id": "main-column", "component": { "Column": { "children": { "explicitList": ["temp-row", "location", "description"] }, "alignment": "center" } } }, { "id": "temp-row", "component": { "Row": { "children": { "explicitList": ["temp-high", "temp-low"] }, "alignment": "start" } } }, { "id": "temp-high", "component": { "Text": { "text": { "path": "/tempHigh" }, "usageHint": "h1" } } }, { "id": "temp-low", "component": { "Text": { "text": { "path": "/tempLow" }, "usageHint": "h2" } } }, { "id": "location", "component": { "Text": { "text": { "path": "/location" }, "usageHint": "h3" } } }, { "id": "description", "component": { "Text": { "text": { "path": "/description" }, "usageHint": "caption" } } }] } }, { "dataModelUpdate": { "surfaceId": "gallery-weather-current", "contents": [{ "key": "tempHigh", "valueString": "72\u00b0" }, { "key": "tempLow", "valueString": "58\u00b0" }, { "key": "location", "valueString": "Austin, TX" }, { "key": "description", "valueString": "Clear skies with light breeze" }] } }, { "beginRendering": { "surfaceId": "gallery-weather-current", "root": "root" } }],
  },
  {
    name: 'User Profile',
    icon: 'person',
    messages: [{ "surfaceUpdate": { "surfaceId": "gallery-user-profile", "components": [{ "id": "root", "component": { "Card": { "child": "main-column" } } }, { "id": "main-column", "component": { "Column": { "children": { "explicitList": ["header", "info", "bio", "stats-row", "follow-btn"] }, "alignment": "center" } } }, { "id": "header", "component": { "Image": { "url": { "path": "/avatar" }, "fit": "cover", "usageHint": "avatar" } } }, { "id": "info", "component": { "Column": { "children": { "explicitList": ["name", "username"] }, "alignment": "center" } } }, { "id": "name", "component": { "Text": { "text": { "path": "/name" }, "usageHint": "h2" } } }, { "id": "username", "component": { "Text": { "text": { "path": "/username" }, "usageHint": "caption" } } }, { "id": "bio", "component": { "Text": { "text": { "path": "/bio" }, "usageHint": "body" } } }, { "id": "stats-row", "component": { "Row": { "children": { "explicitList": ["followers-col", "following-col", "posts-col"] }, "distribution": "spaceAround" } } }, { "id": "followers-col", "component": { "Column": { "children": { "explicitList": ["followers-count", "followers-label"] }, "alignment": "center" } } }, { "id": "followers-count", "component": { "Text": { "text": { "path": "/followers" }, "usageHint": "h3" } } }, { "id": "followers-label", "component": { "Text": { "text": { "literalString": "Followers" }, "usageHint": "caption" } } }, { "id": "following-col", "component": { "Column": { "children": { "explicitList": ["following-count", "following-label"] }, "alignment": "center" } } }, { "id": "following-count", "component": { "Text": { "text": { "path": "/following" }, "usageHint": "h3" } } }, { "id": "following-label", "component": { "Text": { "text": { "literalString": "Following" }, "usageHint": "caption" } } }, { "id": "posts-col", "component": { "Column": { "children": { "explicitList": ["posts-count", "posts-label"] }, "alignment": "center" } } }, { "id": "posts-count", "component": { "Text": { "text": { "path": "/posts" }, "usageHint": "h3" } } }, { "id": "posts-label", "component": { "Text": { "text": { "literalString": "Posts" }, "usageHint": "caption" } } }, { "id": "follow-btn-text", "component": { "Text": { "text": { "path": "/followText" } } } }, { "id": "follow-btn", "component": { "Button": { "child": "follow-btn-text", "variant": "primary", "action": { "name": "follow", "context": [] } } } }] } }, { "dataModelUpdate": { "surfaceId": "gallery-user-profile", "contents": [{ "key": "avatar", "valueString": "https://randomuser.me/api/portraits/women/44.jpg" }, { "key": "name", "valueString": "Sarah Chen" }, { "key": "username", "valueString": "@sarahchen" }, { "key": "bio", "valueString": "Product Designer at Tech Co. Creating delightful experiences." }, { "key": "followers", "valueString": "12.4K" }, { "key": "following", "valueString": "892" }, { "key": "posts", "valueString": "347" }, { "key": "followText", "valueString": "Follow" }] } }, { "beginRendering": { "surfaceId": "gallery-user-profile", "root": "root" } }],
  },
  {
    name: 'Account Balance',
    icon: 'account_balance_wallet',
    messages: [{ "surfaceUpdate": { "surfaceId": "gallery-account-balance", "components": [{ "id": "root", "component": { "Card": { "child": "main-column" } } }, { "id": "main-column", "component": { "Column": { "children": { "explicitList": ["header", "balance", "updated", "divider", "actions"] } } } }, { "id": "header", "component": { "Row": { "children": { "explicitList": ["account-icon", "account-name"] }, "alignment": "center" } } }, { "id": "account-icon", "component": { "Icon": { "name": { "literalString": "payment" } } } }, { "id": "account-name", "component": { "Text": { "text": { "path": "/accountName" }, "usageHint": "h4" } } }, { "id": "balance", "component": { "Text": { "text": { "path": "/balance" }, "usageHint": "h1" } } }, { "id": "updated", "component": { "Text": { "text": { "path": "/lastUpdated" }, "usageHint": "caption" } } }, { "id": "divider", "component": { "Divider": {} } }, { "id": "actions", "component": { "Row": { "children": { "explicitList": ["transfer-btn", "pay-btn"] } } } }, { "id": "transfer-btn-text", "component": { "Text": { "text": { "literalString": "Transfer" } } } }, { "id": "transfer-btn", "component": { "Button": { "child": "transfer-btn-text", "variant": "primary", "action": { "name": "transfer", "context": [] } } } }, { "id": "pay-btn-text", "component": { "Text": { "text": { "literalString": "Pay Bill" } } } }, { "id": "pay-btn", "component": { "Button": { "child": "pay-btn-text", "variant": "primary", "action": { "name": "pay_bill", "context": [] } } } }] } }, { "dataModelUpdate": { "surfaceId": "gallery-account-balance", "contents": [{ "key": "accountName", "valueString": "Primary Checking" }, { "key": "balance", "valueString": "$12,458.32" }, { "key": "lastUpdated", "valueString": "Updated just now" }] } }, { "beginRendering": { "surfaceId": "gallery-account-balance", "root": "root" } }],
  },
  {
    name: 'Step Counter',
    icon: 'directions_walk',
    messages: [{ "surfaceUpdate": { "surfaceId": "gallery-step-counter", "components": [{ "id": "root", "component": { "Card": { "child": "main-column" } } }, { "id": "main-column", "component": { "Column": { "children": { "explicitList": ["header", "steps-display", "goal-text", "divider", "stats-row"] }, "alignment": "center" } } }, { "id": "header", "component": { "Row": { "children": { "explicitList": ["steps-icon", "title"] }, "alignment": "center" } } }, { "id": "steps-icon", "component": { "Icon": { "name": { "literalString": "person" } } } }, { "id": "title", "component": { "Text": { "text": { "literalString": "Today's Steps" }, "usageHint": "h4" } } }, { "id": "steps-display", "component": { "Text": { "text": { "path": "/steps" }, "usageHint": "h1" } } }, { "id": "goal-text", "component": { "Text": { "text": { "path": "/goalProgress" }, "usageHint": "body" } } }, { "id": "divider", "component": { "Divider": {} } }, { "id": "stats-row", "component": { "Row": { "children": { "explicitList": ["distance-col", "calories-col"] }, "distribution": "spaceAround" } } }, { "id": "distance-col", "component": { "Column": { "children": { "explicitList": ["distance-value", "distance-label"] }, "alignment": "center" } } }, { "id": "distance-value", "component": { "Text": { "text": { "path": "/distance" }, "usageHint": "h3" } } }, { "id": "distance-label", "component": { "Text": { "text": { "literalString": "Distance" }, "usageHint": "caption" } } }, { "id": "calories-col", "component": { "Column": { "children": { "explicitList": ["calories-value", "calories-label"] }, "alignment": "center" } } }, { "id": "calories-value", "component": { "Text": { "text": { "path": "/calories" }, "usageHint": "h3" } } }, { "id": "calories-label", "component": { "Text": { "text": { "literalString": "Calories" }, "usageHint": "caption" } } }] } }, { "dataModelUpdate": { "surfaceId": "gallery-step-counter", "contents": [{ "key": "steps", "valueString": "8,432" }, { "key": "goalProgress", "valueString": "84% of 10,000 goal" }, { "key": "distance", "valueString": "3.8 mi" }, { "key": "calories", "valueString": "312" }] } }, { "beginRendering": { "surfaceId": "gallery-step-counter", "root": "root" } }],
  },
  {
    name: 'Email Compose',
    icon: 'mail',
    messages: [{ "surfaceUpdate": { "surfaceId": "gallery-email-compose", "components": [{ "id": "root", "component": { "Card": { "child": "main-column" } } }, { "id": "main-column", "component": { "Column": { "children": { "explicitList": ["from-row", "to-row", "subject-row", "divider", "message", "actions"] } } } }, { "id": "from-row", "component": { "Row": { "children": { "explicitList": ["from-label", "from-value"] }, "alignment": "center" } } }, { "id": "from-label", "component": { "Text": { "text": { "literalString": "FROM" }, "usageHint": "caption" } } }, { "id": "from-value", "component": { "Text": { "text": { "path": "/from" }, "usageHint": "body" } } }, { "id": "to-row", "component": { "Row": { "children": { "explicitList": ["to-label", "to-value"] }, "alignment": "center" } } }, { "id": "to-label", "component": { "Text": { "text": { "literalString": "TO" }, "usageHint": "caption" } } }, { "id": "to-value", "component": { "Text": { "text": { "path": "/to" }, "usageHint": "body" } } }, { "id": "subject-row", "component": { "Row": { "children": { "explicitList": ["subject-label", "subject-value"] }, "alignment": "center" } } }, { "id": "subject-label", "component": { "Text": { "text": { "literalString": "SUBJECT" }, "usageHint": "caption" } } }, { "id": "subject-value", "component": { "Text": { "text": { "path": "/subject" }, "usageHint": "body" } } }, { "id": "divider", "component": { "Divider": {} } }, { "id": "message", "component": { "Column": { "children": { "explicitList": ["greeting", "body-text", "closing", "signature"] } } } }, { "id": "greeting", "component": { "Text": { "text": { "path": "/greeting" }, "usageHint": "body" } } }, { "id": "body-text", "component": { "Text": { "text": { "path": "/body" }, "usageHint": "body" } } }, { "id": "closing", "component": { "Text": { "text": { "path": "/closing" }, "usageHint": "body" } } }, { "id": "signature", "component": { "Text": { "text": { "path": "/signature" }, "usageHint": "body" } } }, { "id": "actions", "component": { "Row": { "children": { "explicitList": ["send-btn", "discard-btn"] } } } }, { "id": "send-btn-text", "component": { "Text": { "text": { "literalString": "Send email" } } } }, { "id": "send-btn", "component": { "Button": { "child": "send-btn-text", "variant": "primary", "action": { "name": "send", "context": [] } } } }, { "id": "discard-btn-text", "component": { "Text": { "text": { "literalString": "Discard" } } } }, { "id": "discard-btn", "component": { "Button": { "child": "discard-btn-text", "action": { "name": "discard", "context": [] } } } }] } }, { "dataModelUpdate": { "surfaceId": "gallery-email-compose", "contents": [{ "key": "from", "valueString": "alex@acme.com" }, { "key": "to", "valueString": "jordan@acme.com" }, { "key": "subject", "valueString": "Q4 Revenue Forecast" }, { "key": "greeting", "valueString": "Hi Jordan," }, { "key": "body", "valueString": "Following up on our call. Please review the attached Q4 forecast and let me know if you have questions before the board meeting." }, { "key": "closing", "valueString": "Best," }, { "key": "signature", "valueString": "Alex" }] } }, { "beginRendering": { "surfaceId": "gallery-email-compose", "root": "root" } }],
  },
  {
    name: 'Login Form',
    icon: 'lock',
    messages: [{ "surfaceUpdate": { "surfaceId": "gallery-login-form", "components": [{ "id": "root", "component": { "Card": { "child": "main-column" } } }, { "id": "main-column", "component": { "Column": { "children": { "explicitList": ["header", "email-field", "password-field", "login-btn", "divider", "signup-text"] } } } }, { "id": "header", "component": { "Column": { "children": { "explicitList": ["title", "subtitle"] }, "alignment": "center" } } }, { "id": "title", "component": { "Text": { "text": { "literalString": "Welcome back" }, "usageHint": "h2" } } }, { "id": "subtitle", "component": { "Text": { "text": { "literalString": "Sign in to your account" }, "usageHint": "caption" } } }, { "id": "email-field", "component": { "TextField": { "label": { "literalString": "Email" }, "text": { "path": "/email" } } } }, { "id": "password-field", "component": { "TextField": { "label": { "literalString": "Password" }, "text": { "path": "/password" }, "textFieldType": "obscured" } } }, { "id": "login-btn-text", "component": { "Text": { "text": { "literalString": "Sign in" } } } }, { "id": "login-btn", "component": { "Button": { "child": "login-btn-text", "variant": "primary", "action": { "name": "login", "context": [] } } } }, { "id": "divider", "component": { "Divider": {} } }, { "id": "signup-text", "component": { "Row": { "children": { "explicitList": ["no-account", "signup-link"] }, "distribution": "center" } } }, { "id": "no-account", "component": { "Text": { "text": { "literalString": "Don't have an account?" }, "usageHint": "caption" } } }, { "id": "signup-link-text", "component": { "Text": { "text": { "literalString": "Sign up" } } } }, { "id": "signup-link", "component": { "Button": { "child": "signup-link-text", "variant": "borderless", "action": { "name": "signup", "context": [] } } } }] } }, { "dataModelUpdate": { "surfaceId": "gallery-login-form", "contents": [{ "key": "email", "valueString": "" }, { "key": "password", "valueString": "" }] } }, { "beginRendering": { "surfaceId": "gallery-login-form", "root": "root" } }],
  },
  {
    name: 'Workout Summary',
    icon: 'fitness_center',
    messages: [{ "surfaceUpdate": { "surfaceId": "gallery-workout-summary", "components": [{ "id": "root", "component": { "Card": { "child": "main-column" } } }, { "id": "main-column", "component": { "Column": { "children": { "explicitList": ["header", "divider", "metrics-row", "date"] } } } }, { "id": "header", "component": { "Row": { "children": { "explicitList": ["workout-icon", "title"] }, "alignment": "center" } } }, { "id": "workout-icon", "component": { "Icon": { "name": { "path": "/icon" } } } }, { "id": "title", "component": { "Text": { "text": { "literalString": "Workout Complete" }, "usageHint": "h3" } } }, { "id": "divider", "component": { "Divider": {} } }, { "id": "metrics-row", "component": { "Row": { "children": { "explicitList": ["duration-col", "calories-col", "distance-col"] }, "distribution": "spaceAround" } } }, { "id": "duration-col", "component": { "Column": { "children": { "explicitList": ["duration-value", "duration-label"] }, "alignment": "center" } } }, { "id": "duration-value", "component": { "Text": { "text": { "path": "/duration" }, "usageHint": "h3" } } }, { "id": "duration-label", "component": { "Text": { "text": { "literalString": "Duration" }, "usageHint": "caption" } } }, { "id": "calories-col", "component": { "Column": { "children": { "explicitList": ["calories-value", "calories-label"] }, "alignment": "center" } } }, { "id": "calories-value", "component": { "Text": { "text": { "path": "/calories" }, "usageHint": "h3" } } }, { "id": "calories-label", "component": { "Text": { "text": { "literalString": "Calories" }, "usageHint": "caption" } } }, { "id": "distance-col", "component": { "Column": { "children": { "explicitList": ["distance-value", "distance-label"] }, "alignment": "center" } } }, { "id": "distance-value", "component": { "Text": { "text": { "path": "/distance" }, "usageHint": "h3" } } }, { "id": "distance-label", "component": { "Text": { "text": { "literalString": "Distance" }, "usageHint": "caption" } } }, { "id": "date", "component": { "Text": { "text": { "path": "/date" }, "usageHint": "caption" } } }] } }, { "dataModelUpdate": { "surfaceId": "gallery-workout-summary", "contents": [{ "key": "icon", "valueString": "directions_run" }, { "key": "workoutType", "valueString": "Morning Run" }, { "key": "duration", "valueString": "32:15" }, { "key": "calories", "valueString": "385" }, { "key": "distance", "valueString": "5.2 km" }, { "key": "date", "valueString": "Today at 7:30 AM" }] } }, { "beginRendering": { "surfaceId": "gallery-workout-summary", "root": "root" } }],
  },
  {
    name: 'Event Detail',
    icon: 'event',
    messages: [{ "surfaceUpdate": { "surfaceId": "gallery-event-detail", "components": [{ "id": "root", "component": { "Card": { "child": "main-column" } } }, { "id": "main-column", "component": { "Column": { "children": { "explicitList": ["title", "time-row", "location-row", "description", "divider", "actions"] } } } }, { "id": "title", "component": { "Text": { "text": { "path": "/title" }, "usageHint": "h2" } } }, { "id": "time-row", "component": { "Row": { "children": { "explicitList": ["time-icon", "time-text"] }, "alignment": "center" } } }, { "id": "time-icon", "component": { "Icon": { "name": { "literalString": "calendarToday" } } } }, { "id": "time-text", "component": { "Text": { "text": { "path": "/dateTime" }, "usageHint": "body" } } }, { "id": "location-row", "component": { "Row": { "children": { "explicitList": ["location-icon", "location-text"] }, "alignment": "center" } } }, { "id": "location-icon", "component": { "Icon": { "name": { "literalString": "locationOn" } } } }, { "id": "location-text", "component": { "Text": { "text": { "path": "/location" }, "usageHint": "body" } } }, { "id": "description", "component": { "Text": { "text": { "path": "/description" }, "usageHint": "body" } } }, { "id": "divider", "component": { "Divider": {} } }, { "id": "actions", "component": { "Row": { "children": { "explicitList": ["accept-btn", "decline-btn"] } } } }, { "id": "accept-btn-text", "component": { "Text": { "text": { "literalString": "Accept" } } } }, { "id": "accept-btn", "component": { "Button": { "child": "accept-btn-text", "action": { "name": "accept", "context": [] } } } }, { "id": "decline-btn-text", "component": { "Text": { "text": { "literalString": "Decline" } } } }, { "id": "decline-btn", "component": { "Button": { "child": "decline-btn-text", "action": { "name": "decline", "context": [] } } } }] } }, { "dataModelUpdate": { "surfaceId": "gallery-event-detail", "contents": [{ "key": "title", "valueString": "Product Launch Meeting" }, { "key": "dateTime", "valueString": "Thu, Dec 19 \u2022 2:00 PM - 3:30 PM" }, { "key": "location", "valueString": "Conference Room A, Building 2" }, { "key": "description", "valueString": "Review final product specs and marketing materials before the Q1 launch." }] } }, { "beginRendering": { "surfaceId": "gallery-event-detail", "root": "root" } }],
  },
  {
    name: 'Recipe Card',
    icon: 'restaurant',
    messages: [{ "surfaceUpdate": { "surfaceId": "gallery-recipe-card", "components": [{ "id": "root", "component": { "Card": { "child": "main-column" } } }, { "id": "main-column", "component": { "Column": { "children": { "explicitList": ["recipe-image", "content"] } } } }, { "id": "recipe-image", "component": { "Image": { "url": { "path": "/image" }, "fit": "cover" } } }, { "id": "content", "component": { "Column": { "children": { "explicitList": ["title", "rating-row", "times-row", "servings"] } } } }, { "id": "title", "component": { "Text": { "text": { "path": "/title" }, "usageHint": "h3" } } }, { "id": "rating-row", "component": { "Row": { "children": { "explicitList": ["star-icon", "rating", "review-count"] }, "alignment": "center" } } }, { "id": "star-icon", "component": { "Icon": { "name": { "literalString": "star" } } } }, { "id": "rating", "component": { "Text": { "text": { "path": "/rating" }, "usageHint": "body" } } }, { "id": "review-count", "component": { "Text": { "text": { "path": "/reviewCount" }, "usageHint": "caption" } } }, { "id": "times-row", "component": { "Row": { "children": { "explicitList": ["prep-time", "cook-time"] } } } }, { "id": "prep-time", "component": { "Row": { "children": { "explicitList": ["prep-icon", "prep-text"] }, "alignment": "center" } } }, { "id": "prep-icon", "component": { "Icon": { "name": { "literalString": "calendarToday" } } } }, { "id": "prep-text", "component": { "Text": { "text": { "path": "/prepTime" }, "usageHint": "caption" } } }, { "id": "cook-time", "component": { "Row": { "children": { "explicitList": ["cook-icon", "cook-text"] }, "alignment": "center" } } }, { "id": "cook-icon", "component": { "Icon": { "name": { "literalString": "warning" } } } }, { "id": "cook-text", "component": { "Text": { "text": { "path": "/cookTime" }, "usageHint": "caption" } } }, { "id": "servings", "component": { "Text": { "text": { "path": "/servings" }, "usageHint": "caption" } } }] } }, { "dataModelUpdate": { "surfaceId": "gallery-recipe-card", "contents": [{ "key": "image", "valueString": "https://picsum.photos/seed/quinoa-bowl/300/180" }, { "key": "title", "valueString": "Mediterranean Quinoa Bowl" }, { "key": "rating", "valueString": "4.9" }, { "key": "reviewCount", "valueString": "(1,247 reviews)" }, { "key": "prepTime", "valueString": "15 min prep" }, { "key": "cookTime", "valueString": "20 min cook" }, { "key": "servings", "valueString": "Serves 4" }] } }, { "beginRendering": { "surfaceId": "gallery-recipe-card", "root": "root" } }],
  },
  // ── New widgets using extended components ──────────────────────────────
  {
    name: 'Music Player',
    icon: 'music_note',
    messages: [{ "createSurface": { "surfaceId": "gallery-music-player", "rootComponentId": "root" } }, { "updateComponents": { "surfaceId": "gallery-music-player", "components": [{ "id": "root", "component": "Card", "child": "col" }, { "id": "col", "component": "Column", "children": ["art-row", "track-info", "prog", "controls"] }, { "id": "art-row", "component": "Row", "children": ["art", "track-meta"], "align": "center" }, { "id": "art", "component": "Image", "url": { "path": "/art" }, "variant": "smallFeature", "fit": "cover" }, { "id": "track-meta", "component": "Column", "children": ["track-name", "artist", "badge-row"] }, { "id": "track-name", "component": "Text", "text": { "path": "/track" }, "variant": "h4" }, { "id": "artist", "component": "Text", "text": { "path": "/artist" }, "variant": "caption" }, { "id": "badge-row", "component": "Row", "children": ["genre-badge"] }, { "id": "genre-badge", "component": "Badge", "label": { "path": "/genre" }, "variant": "info" }, { "id": "prog", "component": "Slider", "label": { "literalString": "Progress" }, "value": { "path": "/progress" }, "min": 0, "max": 100 }, { "id": "controls", "component": "Row", "children": ["prev-btn", "play-btn", "next-btn"], "justify": "center", "align": "center" }, { "id": "prev-text", "component": "Text", "text": { "literalString": "skip_previous" } }, { "id": "prev-btn", "component": "Button", "child": "prev-text", "variant": "borderless" }, { "id": "play-text", "component": "Text", "text": { "path": "/playLabel" } }, { "id": "play-btn", "component": "Button", "child": "play-text", "variant": "primary", "action": { "event": { "name": "play_pause" } } }, { "id": "next-text", "component": "Text", "text": { "literalString": "skip_next" } }, { "id": "next-btn", "component": "Button", "child": "next-text", "variant": "borderless" }] } }, { "updateDataModel": { "surfaceId": "gallery-music-player", "data": { "art": "https://picsum.photos/seed/midnight-album/120/120", "track": "Midnight Wandering", "artist": "Luna & The Echoes", "genre": "Indie Pop", "progress": 42, "playLabel": "pause" } } }],
  },
  {
    name: 'Crypto Portfolio',
    icon: 'currency_bitcoin',
    messages: [{ "createSurface": { "surfaceId": "gallery-crypto", "rootComponentId": "root" } }, { "updateComponents": { "surfaceId": "gallery-crypto", "components": [{ "id": "root", "component": "Card", "child": "col" }, { "id": "col", "component": "Column", "children": ["header-row", "total-stat", "divider", "coins-col"] }, { "id": "header-row", "component": "Row", "children": ["title", "period-badge"], "justify": "spaceBetween", "align": "center" }, { "id": "title", "component": "Text", "text": { "literalString": "Portfolio" }, "variant": "h4" }, { "id": "period-badge", "component": "Badge", "label": { "literalString": "24h" }, "variant": "neutral" }, { "id": "total-stat", "component": "Stat", "value": { "path": "/total" }, "label": { "literalString": "Total Value" }, "trend": { "path": "/totalTrend" }, "trendDirection": "up", "icon": { "literalString": "account_balance_wallet" } }, { "id": "divider", "component": "Divider" }, { "id": "coins-col", "component": "Column", "children": ["btc-row", "eth-row", "sol-row"] }, { "id": "btc-row", "component": "Row", "children": ["btc-name", "btc-right"], "justify": "spaceBetween", "align": "center" }, { "id": "btc-name", "component": "Text", "text": { "literalString": "Bitcoin" }, "variant": "body" }, { "id": "btc-right", "component": "Column", "children": ["btc-val", "btc-trend"], "align": "end" }, { "id": "btc-val", "component": "Text", "text": { "path": "/btcVal" }, "variant": "h5" }, { "id": "btc-trend", "component": "Badge", "label": { "path": "/btcTrend" }, "variant": "success" }, { "id": "eth-row", "component": "Row", "children": ["eth-name", "eth-right"], "justify": "spaceBetween", "align": "center" }, { "id": "eth-name", "component": "Text", "text": { "literalString": "Ethereum" }, "variant": "body" }, { "id": "eth-right", "component": "Column", "children": ["eth-val", "eth-trend"], "align": "end" }, { "id": "eth-val", "component": "Text", "text": { "path": "/ethVal" }, "variant": "h5" }, { "id": "eth-trend", "component": "Badge", "label": { "path": "/ethTrend" }, "variant": "error" }, { "id": "sol-row", "component": "Row", "children": ["sol-name", "sol-right"], "justify": "spaceBetween", "align": "center" }, { "id": "sol-name", "component": "Text", "text": { "literalString": "Solana" }, "variant": "body" }, { "id": "sol-right", "component": "Column", "children": ["sol-val", "sol-trend"], "align": "end" }, { "id": "sol-val", "component": "Text", "text": { "path": "/solVal" }, "variant": "h5" }, { "id": "sol-trend", "component": "Badge", "label": { "path": "/solTrend" }, "variant": "success" }] } }, { "updateDataModel": { "surfaceId": "gallery-crypto", "data": { "total": "$48,291.40", "totalTrend": "+$1,240 (2.6%)", "btcVal": "$28,120", "btcTrend": "+3.1%", "ethVal": "$14,830", "ethTrend": "-0.8%", "solVal": "$5,341", "solTrend": "+5.4%" } } }],
  },
  {
    name: 'Product Card',
    icon: 'shopping_bag',
    messages: [{ "createSurface": { "surfaceId": "gallery-product", "rootComponentId": "root" } }, { "updateComponents": { "surfaceId": "gallery-product", "components": [{ "id": "root", "component": "Card", "child": "col" }, { "id": "col", "component": "Column", "children": ["product-img", "info", "rating-comp", "price-row", "add-btn"] }, { "id": "product-img", "component": "Image", "url": { "path": "/img" }, "variant": "mediumFeature", "fit": "cover" }, { "id": "info", "component": "Column", "children": ["name", "brand"] }, { "id": "name", "component": "Text", "text": { "path": "/name" }, "variant": "h3" }, { "id": "brand", "component": "Text", "text": { "path": "/brand" }, "variant": "caption" }, { "id": "rating-comp", "component": "Rating", "value": { "path": "/rating" }, "label": { "path": "/ratingCount" }, "interactive": false }, { "id": "price-row", "component": "Row", "children": ["price", "original"], "align": "center" }, { "id": "price", "component": "Text", "text": { "path": "/price" }, "variant": "h3" }, { "id": "original", "component": "Text", "text": { "path": "/originalPrice" }, "variant": "caption" }, { "id": "btn-text", "component": "Text", "text": { "literalString": "Add to Cart" } }, { "id": "add-btn", "component": "Button", "child": "btn-text", "variant": "primary", "action": { "event": { "name": "add_to_cart" } } }] } }, { "updateDataModel": { "surfaceId": "gallery-product", "data": { "img": "https://picsum.photos/seed/luxury-watch/300/200", "name": "Minimalist Watch", "brand": "FORMA Studio", "rating": 4.7, "ratingCount": "(312 reviews)", "price": "$249", "originalPrice": "$389" } } }],
  },
  {
    name: 'Notification Center',
    icon: 'notifications',
    messages: [{ "createSurface": { "surfaceId": "gallery-notifications", "rootComponentId": "root" } }, { "updateComponents": { "surfaceId": "gallery-notifications", "components": [{ "id": "root", "component": "Card", "child": "col" }, { "id": "col", "component": "Column", "children": ["header", "notif-1", "notif-2", "notif-3"] }, { "id": "header", "component": "Row", "children": ["title", "clear-text"], "justify": "spaceBetween", "align": "center" }, { "id": "title", "component": "Text", "text": { "literalString": "Notifications" }, "variant": "h4" }, { "id": "clear-text", "component": "Text", "text": { "literalString": "Mark all read" }, "variant": "caption" }, { "id": "notif-1", "component": "Row", "children": ["av1", "n1-body"], "align": "start" }, { "id": "av1", "component": "Avatar", "name": { "literalString": "Sarah Chen" }, "src": { "literalString": "https://randomuser.me/api/portraits/women/44.jpg" }, "size": "sm", "status": "online" }, { "id": "n1-body", "component": "Column", "children": ["n1-msg", "n1-time"] }, { "id": "n1-msg", "component": "Text", "text": { "literalString": "**Sarah Chen** liked your post" }, "variant": "body" }, { "id": "n1-time", "component": "Text", "text": { "literalString": "2m ago" }, "variant": "caption" }, { "id": "notif-2", "component": "Row", "children": ["av2", "n2-body"], "align": "start" }, { "id": "av2", "component": "Avatar", "name": { "literalString": "Marcus Lee" }, "size": "sm", "status": "away" }, { "id": "n2-body", "component": "Column", "children": ["n2-msg", "n2-time"] }, { "id": "n2-msg", "component": "Text", "text": { "literalString": "**Marcus Lee** commented on your design" }, "variant": "body" }, { "id": "n2-time", "component": "Text", "text": { "literalString": "15m ago" }, "variant": "caption" }, { "id": "notif-3", "component": "Alert", "message": { "literalString": "Your subscription renews in 3 days" }, "severity": "warning", "title": { "literalString": "Billing reminder" }, "dismissible": true }] } }],
  },
  {
    name: 'Stats Dashboard',
    icon: 'bar_chart',
    messages: [{ "createSurface": { "surfaceId": "gallery-stats-dash", "rootComponentId": "root" } }, { "updateComponents": { "surfaceId": "gallery-stats-dash", "components": [{ "id": "root", "component": "Card", "child": "col" }, { "id": "col", "component": "Column", "children": ["header", "stats-grid", "divider", "alert-msg"] }, { "id": "header", "component": "Text", "text": { "literalString": "This Month" }, "variant": "h4" }, { "id": "stats-grid", "component": "Row", "children": ["s1", "s2", "s3"], "justify": "spaceBetween" }, { "id": "s1", "component": "Stat", "value": { "literalString": "$84.2K" }, "label": { "literalString": "Revenue" }, "trend": { "literalString": "+14%" }, "trendDirection": "up", "icon": { "literalString": "payments" } }, { "id": "s2", "component": "Stat", "value": { "literalString": "3,841" }, "label": { "literalString": "Orders" }, "trend": { "literalString": "+7%" }, "trendDirection": "up", "icon": { "literalString": "shopping_cart" } }, { "id": "s3", "component": "Stat", "value": { "literalString": "98.4%" }, "label": { "literalString": "Uptime" }, "trend": { "literalString": "-0.1%" }, "trendDirection": "down", "icon": { "literalString": "speed" } }, { "id": "divider", "component": "Divider" }, { "id": "alert-msg", "component": "Alert", "title": { "literalString": "New milestone" }, "message": { "literalString": "Revenue up 14% — best month of 2025!" }, "severity": "success" }] } }],
  },
  {
    name: 'Testimonial',
    icon: 'format_quote',
    messages: [{ "createSurface": { "surfaceId": "gallery-testimonial", "rootComponentId": "root" } }, { "updateComponents": { "surfaceId": "gallery-testimonial", "components": [{ "id": "root", "component": "Card", "child": "col" }, { "id": "col", "component": "Column", "children": ["quote-icon", "quote", "author-row", "rating-comp"] }, { "id": "quote-icon", "component": "Icon", "name": { "literalString": "format_quote" }, "size": "xl" }, { "id": "quote", "component": "Text", "text": { "path": "/quote" }, "variant": "h4" }, { "id": "author-row", "component": "Row", "children": ["av", "author-info"], "align": "center" }, { "id": "av", "component": "Avatar", "name": { "path": "/author" }, "src": { "path": "/avatar" }, "size": "md", "status": "online" }, { "id": "author-info", "component": "Column", "children": ["author-name", "author-role"] }, { "id": "author-name", "component": "Text", "text": { "path": "/author" }, "variant": "h5" }, { "id": "author-role", "component": "Text", "text": { "path": "/role" }, "variant": "caption" }, { "id": "rating-comp", "component": "Rating", "value": { "path": "/stars" }, "interactive": false }] } }, { "updateDataModel": { "surfaceId": "gallery-testimonial", "data": { "quote": "This tool completely transformed how our team ships features. The velocity increase was immediate.", "avatar": "https://randomuser.me/api/portraits/men/67.jpg", "author": "James Waller", "role": "CTO at StreamCo", "stars": 5 } } }],
  },
  {
    name: 'App Store Card',
    icon: 'apps',
    messages: [{ "createSurface": { "surfaceId": "gallery-app-card", "rootComponentId": "root" } }, { "updateComponents": { "surfaceId": "gallery-app-card", "components": [{ "id": "root", "component": "Card", "child": "col" }, { "id": "col", "component": "Column", "children": ["header-row", "desc", "rating-row", "divider", "btn-row"] }, { "id": "header-row", "component": "Row", "children": ["app-icon", "app-info"], "align": "center" }, { "id": "app-icon", "component": "Avatar", "name": { "path": "/appName" }, "src": { "path": "/icon" }, "size": "lg" }, { "id": "app-info", "component": "Column", "children": ["app-name", "category", "size-badge"] }, { "id": "app-name", "component": "Text", "text": { "path": "/appName" }, "variant": "h4" }, { "id": "category", "component": "Text", "text": { "path": "/category" }, "variant": "caption" }, { "id": "size-badge", "component": "Badge", "label": { "path": "/size" }, "variant": "neutral" }, { "id": "desc", "component": "Text", "text": { "path": "/desc" }, "variant": "body" }, { "id": "rating-row", "component": "Row", "children": ["stars", "downloads"], "align": "center", "justify": "spaceBetween" }, { "id": "stars", "component": "Rating", "value": { "path": "/rating" }, "interactive": false }, { "id": "downloads", "component": "Text", "text": { "path": "/downloads" }, "variant": "caption" }, { "id": "divider", "component": "Divider" }, { "id": "btn-row", "component": "Row", "children": ["get-btn", "wishlist-btn"] }, { "id": "get-text", "component": "Text", "text": { "literalString": "Get" } }, { "id": "get-btn", "component": "Button", "child": "get-text", "variant": "primary", "action": { "event": { "name": "install" } } }, { "id": "wish-text", "component": "Text", "text": { "literalString": "Wishlist" } }, { "id": "wishlist-btn", "component": "Button", "child": "wish-text", "variant": "default", "action": { "event": { "name": "wishlist" } } }] } }, { "updateDataModel": { "surfaceId": "gallery-app-card", "data": { "icon": "https://picsum.photos/seed/devflow-icon/80/80", "appName": "DevFlow", "category": "Developer Tools", "size": "12.4 MB", "desc": "The fastest way to ship code reviews. Integrates with GitHub, GitLab and Bitbucket.", "rating": 4.8, "downloads": "1.2M downloads" } } }],
  },
  {
    name: 'Task Manager',
    icon: 'task_alt',
    messages: [{ "createSurface": { "surfaceId": "gallery-tasks", "rootComponentId": "root" } }, { "updateComponents": { "surfaceId": "gallery-tasks", "components": [{ "id": "root", "component": "Card", "child": "col" }, { "id": "col", "component": "Column", "children": ["header", "prog-section", "tasks-list", "add-btn-row"] }, { "id": "header", "component": "Row", "children": ["title", "done-badge"], "justify": "spaceBetween", "align": "center" }, { "id": "title", "component": "Text", "text": { "literalString": "Sprint Tasks" }, "variant": "h4" }, { "id": "done-badge", "component": "Badge", "label": { "literalString": "3 / 5 done" }, "variant": "success" }, { "id": "prog-section", "component": "Progress", "value": { "literalString": "60" }, "label": { "literalString": "Sprint Progress" }, "variant": "linear" }, { "id": "tasks-list", "component": "Column", "children": ["t1", "t2", "t3", "t4", "t5"] }, { "id": "t1", "component": "Row", "children": ["cb1", "t1-text"], "align": "center" }, { "id": "cb1", "component": "CheckBox", "label": { "literalString": "Design system tokens" }, "value": { "path": "/t1" } }, { "id": "t1-text", "component": "Text", "text": { "literalString": "" }, "variant": "caption" }, { "id": "t2", "component": "CheckBox", "label": { "literalString": "API auth middleware" }, "value": { "path": "/t2" } }, { "id": "t3", "component": "CheckBox", "label": { "literalString": "Dashboard data layer" }, "value": { "path": "/t3" } }, { "id": "t4", "component": "CheckBox", "label": { "literalString": "Write unit tests" }, "value": { "path": "/t4" } }, { "id": "t5", "component": "CheckBox", "label": { "literalString": "Deploy to staging" }, "value": { "path": "/t5" } }, { "id": "add-btn-row", "component": "Row", "children": ["add-btn"], "justify": "end" }, { "id": "add-text", "component": "Text", "text": { "literalString": "Add Task" } }, { "id": "add-btn", "component": "Button", "child": "add-text", "variant": "borderless", "action": { "event": { "name": "add_task" } } }] } }, { "updateDataModel": { "surfaceId": "gallery-tasks", "data": { "t1": true, "t2": true, "t3": true, "t4": false, "t5": false } } }],
  },
  {
    name: 'Mini Dashboard',
    icon: 'dashboard',
    messages: [{ "createSurface": { "surfaceId": "gallery-mini-dash", "rootComponentId": "root" } }, { "updateComponents": { "surfaceId": "gallery-mini-dash", "components": [{ "id": "root", "component": "Card", "child": "col" }, { "id": "col", "component": "Column", "children": ["header", "tabs-section"] }, { "id": "header", "component": "Text", "text": { "literalString": "Analytics" }, "variant": "h4" }, { "id": "tabs-section", "component": "Tabs", "tabs": [{ "title": { "literalString": "Week" }, "child": "week-col" }, { "title": { "literalString": "Month" }, "child": "month-col" }, { "title": { "literalString": "Year" }, "child": "year-col" }] }, { "id": "week-col", "component": "Column", "children": ["w-s1", "w-s2", "w-s3"] }, { "id": "w-s1", "component": "Stat", "value": { "literalString": "12,840" }, "label": { "literalString": "Visitors" }, "trend": { "literalString": "+8%" }, "trendDirection": "up" }, { "id": "w-s2", "component": "Stat", "value": { "literalString": "4.2%" }, "label": { "literalString": "Conversion" }, "trend": { "literalString": "+0.3%" }, "trendDirection": "up" }, { "id": "w-s3", "component": "Stat", "value": { "literalString": "$9,240" }, "label": { "literalString": "Revenue" }, "trend": { "literalString": "+12%" }, "trendDirection": "up" }, { "id": "month-col", "component": "Column", "children": ["m-s1", "m-s2", "m-s3"] }, { "id": "m-s1", "component": "Stat", "value": { "literalString": "51,200" }, "label": { "literalString": "Visitors" }, "trend": { "literalString": "+22%" }, "trendDirection": "up" }, { "id": "m-s2", "component": "Stat", "value": { "literalString": "3.8%" }, "label": { "literalString": "Conversion" }, "trend": { "literalString": "-0.4%" }, "trendDirection": "down" }, { "id": "m-s3", "component": "Stat", "value": { "literalString": "$38,400" }, "label": { "literalString": "Revenue" }, "trend": { "literalString": "+18%" }, "trendDirection": "up" }, { "id": "year-col", "component": "Column", "children": ["y-s1", "y-s2", "y-s3"] }, { "id": "y-s1", "component": "Stat", "value": { "literalString": "640K" }, "label": { "literalString": "Visitors" }, "trend": { "literalString": "+41%" }, "trendDirection": "up" }, { "id": "y-s2", "component": "Stat", "value": { "literalString": "4.1%" }, "label": { "literalString": "Conversion" }, "trend": { "literalString": "+0.6%" }, "trendDirection": "up" }, { "id": "y-s3", "component": "Stat", "value": { "literalString": "$482K" }, "label": { "literalString": "Revenue" }, "trend": { "literalString": "+35%" }, "trendDirection": "up" }] } }],
  },
  {
    name: 'Photo Gallery',
    icon: 'photo_library',
    messages: [{
      "surfaceUpdate": {
        "surfaceId": "gallery-photos", "components": [
          { "id": "root", "component": { "Card": { "child": "col" } } },
          { "id": "col", "component": { "Column": { "children": { "explicitList": ["header-row", "hero-img", "thumb-row", "meta-row"] } } } },
          { "id": "header-row", "component": { "Row": { "children": { "explicitList": ["title", "badge"] }, "distribution": "spaceBetween", "alignment": "center" } } },
          { "id": "title", "component": { "Text": { "text": { "literalString": "Iceland Trip" }, "usageHint": "h4" } } },
          { "id": "badge", "component": { "Badge": { "label": { "literalString": "24 photos" }, "variant": "info" } } },
          { "id": "hero-img", "component": { "Image": { "url": { "literalString": "https://picsum.photos/seed/iceland-hero/600/338" }, "fit": "cover", "usageHint": "mediumFeature" } } },
          { "id": "thumb-row", "component": { "Row": { "children": { "explicitList": ["t1", "t2", "t3", "t4"] } } } },
          { "id": "t1", "component": { "Image": { "url": { "literalString": "https://picsum.photos/seed/iceland1/120/90" }, "fit": "cover", "usageHint": "smallFeature" } } },
          { "id": "t2", "component": { "Image": { "url": { "literalString": "https://picsum.photos/seed/iceland2/120/90" }, "fit": "cover", "usageHint": "smallFeature" } } },
          { "id": "t3", "component": { "Image": { "url": { "literalString": "https://picsum.photos/seed/iceland3/120/90" }, "fit": "cover", "usageHint": "smallFeature" } } },
          { "id": "t4", "component": { "Image": { "url": { "literalString": "https://picsum.photos/seed/iceland4/120/90" }, "fit": "cover", "usageHint": "smallFeature" } } },
          { "id": "meta-row", "component": { "Row": { "children": { "explicitList": ["loc-icon", "loc-text", "views-text"] }, "alignment": "center", "distribution": "spaceBetween" } } },
          { "id": "loc-icon", "component": { "Icon": { "name": { "literalString": "locationOn" } } } },
          { "id": "loc-text", "component": { "Text": { "text": { "literalString": "Reykjavik, Iceland" }, "usageHint": "caption" } } },
          { "id": "views-text", "component": { "Text": { "text": { "literalString": "2.1K views" }, "usageHint": "caption" } } },
        ]
      }
    }, { "beginRendering": { "surfaceId": "gallery-photos", "root": "root" } }],
  },
  {
    name: 'Video Player',
    icon: 'play_circle',
    messages: [{
      "surfaceUpdate": {
        "surfaceId": "gallery-video", "components": [
          { "id": "root", "component": { "Card": { "child": "col" } } },
          { "id": "col", "component": { "Column": { "children": { "explicitList": ["vid", "info-row", "desc", "tag-row"] } } } },
          {
            "id": "vid", "component": {
              "Video": {
                "url": { "literalString": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4" },
                "poster": { "literalString": "https://picsum.photos/seed/video-thumb/600/338" }
              }
            }
          },
          { "id": "info-row", "component": { "Row": { "children": { "explicitList": ["vtitle", "dur-badge"] }, "distribution": "spaceBetween", "alignment": "center" } } },
          { "id": "vtitle", "component": { "Text": { "text": { "literalString": "Big Buck Bunny" }, "usageHint": "h4" } } },
          { "id": "dur-badge", "component": { "Badge": { "label": { "literalString": "9:56" }, "variant": "neutral" } } },
          { "id": "desc", "component": { "Text": { "text": { "literalString": "A large and lovably naive bunny discovers the joys of friendship and the dangers of the forest." }, "usageHint": "caption" } } },
          { "id": "tag-row", "component": { "Row": { "children": { "explicitList": ["t-anim", "t-short", "t-open"] } } } },
          { "id": "t-anim", "component": { "Badge": { "label": { "literalString": "Animation" }, "variant": "primary" } } },
          { "id": "t-short", "component": { "Badge": { "label": { "literalString": "Short Film" }, "variant": "info" } } },
          { "id": "t-open", "component": { "Badge": { "label": { "literalString": "Open Source" }, "variant": "success" } } },
        ]
      }
    }, { "beginRendering": { "surfaceId": "gallery-video", "root": "root" } }],
  },
  {
    name: 'Podcast Player',
    icon: 'headphones',
    messages: [{
      "surfaceUpdate": {
        "surfaceId": "gallery-podcast", "components": [
          { "id": "root", "component": { "Card": { "child": "col" } } },
          { "id": "col", "component": { "Column": { "children": { "explicitList": ["show-row", "player", "divider", "ep-list"] } } } },
          { "id": "show-row", "component": { "Row": { "children": { "explicitList": ["show-art", "show-meta"] }, "alignment": "center" } } },
          { "id": "show-art", "component": { "Image": { "url": { "literalString": "https://picsum.photos/seed/podcast-show/80/80" }, "fit": "cover", "usageHint": "smallFeature" } } },
          { "id": "show-meta", "component": { "Column": { "children": { "explicitList": ["show-name", "ep-count"] } } } },
          { "id": "show-name", "component": { "Text": { "text": { "literalString": "Design Dialogues" }, "usageHint": "h4" } } },
          { "id": "ep-count", "component": { "Text": { "text": { "literalString": "Episode 42 · 58 min" }, "usageHint": "caption" } } },
          {
            "id": "player", "component": {
              "AudioPlayer": {
                "url": { "literalString": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
                "title": { "literalString": "The Future of AI Design Tools" },
                "artist": { "literalString": "Design Dialogues" },
                "cover": { "literalString": "https://picsum.photos/seed/podcast-cover/120/120" }
              }
            }
          },
          { "id": "divider", "component": { "Divider": {} } },
          { "id": "ep-list", "component": { "Column": { "children": { "explicitList": ["ep-lbl", "ep1-row", "ep2-row"] } } } },
          { "id": "ep-lbl", "component": { "Text": { "text": { "literalString": "More Episodes" }, "usageHint": "h5" } } },
          { "id": "ep1-row", "component": { "Row": { "children": { "explicitList": ["ep1-info", "ep1-dur"] }, "distribution": "spaceBetween", "alignment": "center" } } },
          { "id": "ep1-info", "component": { "Text": { "text": { "literalString": "Ep 41 — Motion Design Trends 2025" }, "usageHint": "body" } } },
          { "id": "ep1-dur", "component": { "Text": { "text": { "literalString": "44 min" }, "usageHint": "caption" } } },
          { "id": "ep2-row", "component": { "Row": { "children": { "explicitList": ["ep2-info", "ep2-dur"] }, "distribution": "spaceBetween", "alignment": "center" } } },
          { "id": "ep2-info", "component": { "Text": { "text": { "literalString": "Ep 40 — Color Theory Deep Dive" }, "usageHint": "body" } } },
          { "id": "ep2-dur", "component": { "Text": { "text": { "literalString": "51 min" }, "usageHint": "caption" } } },
        ]
      }
    }, { "beginRendering": { "surfaceId": "gallery-podcast", "root": "root" } }],
  },
  {
    name: 'Profile Settings',
    icon: 'manage_accounts',
    messages: [{ "createSurface": { "surfaceId": "gallery-profile-settings", "rootComponentId": "root" } }, { "updateComponents": { "surfaceId": "gallery-profile-settings", "components": [{ "id": "root", "component": "Card", "child": "col" }, { "id": "col", "component": "Column", "children": ["av-row", "name-field", "bio-field", "role-picker", "notif-check", "save-row"] }, { "id": "av-row", "component": "Row", "children": ["avatar", "change-text"], "align": "center" }, { "id": "avatar", "component": "Avatar", "name": { "literalString": "Alex Morgan" }, "src": { "literalString": "https://randomuser.me/api/portraits/women/68.jpg" }, "size": "lg", "status": "online" }, { "id": "change-text", "component": "Text", "text": { "literalString": "Change photo" }, "variant": "caption" }, { "id": "name-field", "component": "TextField", "label": { "literalString": "Full Name" }, "value": { "path": "/name" }, "variant": "shortText" }, { "id": "bio-field", "component": "TextField", "label": { "literalString": "Bio" }, "value": { "path": "/bio" }, "variant": "longText" }, { "id": "role-picker", "component": "ChoicePicker", "label": { "literalString": "Role" }, "options": [{ "label": { "literalString": "Designer" }, "value": "designer" }, { "label": { "literalString": "Developer" }, "value": "developer" }, { "label": { "literalString": "Manager" }, "value": "manager" }, { "label": { "literalString": "Marketing" }, "value": "marketing" }], "value": { "path": "/role" }, "variant": "mutuallyExclusive", "displayStyle": "chips" }, { "id": "notif-check", "component": "CheckBox", "label": { "literalString": "Email notifications" }, "value": { "path": "/notifications" } }, { "id": "save-row", "component": "Row", "children": ["save-btn", "cancel-btn"] }, { "id": "save-text", "component": "Text", "text": { "literalString": "Save Changes" } }, { "id": "save-btn", "component": "Button", "child": "save-text", "variant": "primary", "action": { "event": { "name": "save" } } }, { "id": "cancel-text", "component": "Text", "text": { "literalString": "Cancel" } }, { "id": "cancel-btn", "component": "Button", "child": "cancel-text", "variant": "default", "action": { "event": { "name": "cancel" } } }] } }, { "updateDataModel": { "surfaceId": "gallery-profile-settings", "data": { "name": "Alex Morgan", "bio": "Product designer focused on human-centred experiences.", "role": ["designer"], "notifications": true } } }],
  },
]
</script>

<style scoped>
.gallery-grid {
  columns: 4;
  column-gap: 1rem;
}

.gallery-item {
  break-inside: avoid;
  margin-bottom: 1rem;
}

.gallery-card {
  background: var(--a2ui-card-bg);
  border: 1px solid var(--a2ui-card-border);
  border-radius: 16px;
  padding: 1.1rem;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.gallery-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.1);
}

/* Remove inner A2UI Card styling when inside gallery (avoid double card) */
.gallery-card :deep(.a2-card) {
  background: transparent;
  box-shadow: none;
  padding: 0;
  border: none;
  border-radius: 0;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  transform: none !important;
}

@media (min-width: 1536px) {
  .gallery-grid {
    columns: 4;
  }
}

@media (max-width: 1280px) {
  .gallery-grid {
    columns: 3;
  }
}

@media (max-width: 1024px) {
  .gallery-grid {
    columns: 2;
  }
}

@media (max-width: 640px) {
  .gallery-grid {
    columns: 1;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>