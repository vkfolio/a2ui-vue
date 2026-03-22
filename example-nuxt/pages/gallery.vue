<template>
  <div class="p-8 max-w-7xl mx-auto">
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
    messages: [{ "surfaceUpdate": { "surfaceId": "gallery-user-profile", "components": [{ "id": "root", "component": { "Card": { "child": "main-column" } } }, { "id": "main-column", "component": { "Column": { "children": { "explicitList": ["header", "info", "bio", "stats-row", "follow-btn"] }, "alignment": "center" } } }, { "id": "header", "component": { "Image": { "url": { "path": "/avatar" }, "fit": "cover", "usageHint": "avatar" } } }, { "id": "info", "component": { "Column": { "children": { "explicitList": ["name", "username"] }, "alignment": "center" } } }, { "id": "name", "component": { "Text": { "text": { "path": "/name" }, "usageHint": "h2" } } }, { "id": "username", "component": { "Text": { "text": { "path": "/username" }, "usageHint": "caption" } } }, { "id": "bio", "component": { "Text": { "text": { "path": "/bio" }, "usageHint": "body" } } }, { "id": "stats-row", "component": { "Row": { "children": { "explicitList": ["followers-col", "following-col", "posts-col"] }, "distribution": "spaceAround" } } }, { "id": "followers-col", "component": { "Column": { "children": { "explicitList": ["followers-count", "followers-label"] }, "alignment": "center" } } }, { "id": "followers-count", "component": { "Text": { "text": { "path": "/followers" }, "usageHint": "h3" } } }, { "id": "followers-label", "component": { "Text": { "text": { "literalString": "Followers" }, "usageHint": "caption" } } }, { "id": "following-col", "component": { "Column": { "children": { "explicitList": ["following-count", "following-label"] }, "alignment": "center" } } }, { "id": "following-count", "component": { "Text": { "text": { "path": "/following" }, "usageHint": "h3" } } }, { "id": "following-label", "component": { "Text": { "text": { "literalString": "Following" }, "usageHint": "caption" } } }, { "id": "posts-col", "component": { "Column": { "children": { "explicitList": ["posts-count", "posts-label"] }, "alignment": "center" } } }, { "id": "posts-count", "component": { "Text": { "text": { "path": "/posts" }, "usageHint": "h3" } } }, { "id": "posts-label", "component": { "Text": { "text": { "literalString": "Posts" }, "usageHint": "caption" } } }, { "id": "follow-btn-text", "component": { "Text": { "text": { "path": "/followText" } } } }, { "id": "follow-btn", "component": { "Button": { "child": "follow-btn-text", "variant": "primary", "action": { "name": "follow", "context": [] } } } }] } }, { "dataModelUpdate": { "surfaceId": "gallery-user-profile", "contents": [{ "key": "avatar", "valueString": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop" }, { "key": "name", "valueString": "Sarah Chen" }, { "key": "username", "valueString": "@sarahchen" }, { "key": "bio", "valueString": "Product Designer at Tech Co. Creating delightful experiences." }, { "key": "followers", "valueString": "12.4K" }, { "key": "following", "valueString": "892" }, { "key": "posts", "valueString": "347" }, { "key": "followText", "valueString": "Follow" }] } }, { "beginRendering": { "surfaceId": "gallery-user-profile", "root": "root" } }],
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
    messages: [{ "surfaceUpdate": { "surfaceId": "gallery-recipe-card", "components": [{ "id": "root", "component": { "Card": { "child": "main-column" } } }, { "id": "main-column", "component": { "Column": { "children": { "explicitList": ["recipe-image", "content"] } } } }, { "id": "recipe-image", "component": { "Image": { "url": { "path": "/image" }, "fit": "cover" } } }, { "id": "content", "component": { "Column": { "children": { "explicitList": ["title", "rating-row", "times-row", "servings"] } } } }, { "id": "title", "component": { "Text": { "text": { "path": "/title" }, "usageHint": "h3" } } }, { "id": "rating-row", "component": { "Row": { "children": { "explicitList": ["star-icon", "rating", "review-count"] }, "alignment": "center" } } }, { "id": "star-icon", "component": { "Icon": { "name": { "literalString": "star" } } } }, { "id": "rating", "component": { "Text": { "text": { "path": "/rating" }, "usageHint": "body" } } }, { "id": "review-count", "component": { "Text": { "text": { "path": "/reviewCount" }, "usageHint": "caption" } } }, { "id": "times-row", "component": { "Row": { "children": { "explicitList": ["prep-time", "cook-time"] } } } }, { "id": "prep-time", "component": { "Row": { "children": { "explicitList": ["prep-icon", "prep-text"] }, "alignment": "center" } } }, { "id": "prep-icon", "component": { "Icon": { "name": { "literalString": "calendarToday" } } } }, { "id": "prep-text", "component": { "Text": { "text": { "path": "/prepTime" }, "usageHint": "caption" } } }, { "id": "cook-time", "component": { "Row": { "children": { "explicitList": ["cook-icon", "cook-text"] }, "alignment": "center" } } }, { "id": "cook-icon", "component": { "Icon": { "name": { "literalString": "warning" } } } }, { "id": "cook-text", "component": { "Text": { "text": { "path": "/cookTime" }, "usageHint": "caption" } } }, { "id": "servings", "component": { "Text": { "text": { "path": "/servings" }, "usageHint": "caption" } } }] } }, { "dataModelUpdate": { "surfaceId": "gallery-recipe-card", "contents": [{ "key": "image", "valueString": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=180&fit=crop" }, { "key": "title", "valueString": "Mediterranean Quinoa Bowl" }, { "key": "rating", "valueString": "4.9" }, { "key": "reviewCount", "valueString": "(1,247 reviews)" }, { "key": "prepTime", "valueString": "15 min prep" }, { "key": "cookTime", "valueString": "20 min cook" }, { "key": "servings", "valueString": "Serves 4" }] } }, { "beginRendering": { "surfaceId": "gallery-recipe-card", "root": "root" } }],
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
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.gallery-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

/* Remove inner A2UI Card styling when inside gallery (avoid double card) */
.gallery-card :deep(.a2-card) {
  background: transparent;
  box-shadow: none;
  padding: 0;
  border: none;
  border-radius: 0;
}

@media (max-width: 1536px) {
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
