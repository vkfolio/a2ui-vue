/**
 * a2ui-vue — Vue 3 Renderer for Google A2UI Protocol
 *
 * @example
 * ```vue
 * <script setup>
 * import { A2Surface, A2StaticRenderer, useA2UI } from 'a2ui-vue'
 * </script>
 *
 * <template>
 *   <A2Surface agent-url="http://localhost:8006/agent" />
 * </template>
 * ```
 */

// Components
export { default as A2Surface } from './components/A2Surface.vue'
export { default as A2Renderer } from './components/A2Renderer.vue'
export { default as A2StaticRenderer } from './components/A2StaticRenderer.vue'

// Layout components
export { default as A2Row } from './components/layout/A2Row.vue'
export { default as A2Column } from './components/layout/A2Column.vue'
export { default as A2List } from './components/layout/A2List.vue'
export { default as A2Card } from './components/layout/A2Card.vue'
export { default as A2Tabs } from './components/layout/A2Tabs.vue'
export { default as A2Modal } from './components/layout/A2Modal.vue'
export { default as A2Divider } from './components/layout/A2Divider.vue'

// Content components
export { default as A2Text } from './components/content/A2Text.vue'
export { default as A2Image } from './components/content/A2Image.vue'
export { default as A2Icon } from './components/content/A2Icon.vue'
export { default as A2Video } from './components/content/A2Video.vue'
export { default as A2AudioPlayer } from './components/content/A2AudioPlayer.vue'

// Input components
export { default as A2TextField } from './components/input/A2TextField.vue'
export { default as A2CheckBox } from './components/input/A2CheckBox.vue'
export { default as A2ChoicePicker } from './components/input/A2ChoicePicker.vue'
export { default as A2Slider } from './components/input/A2Slider.vue'
export { default as A2DateTimeInput } from './components/input/A2DateTimeInput.vue'

// Navigation components
export { default as A2Button } from './components/navigation/A2Button.vue'

// Composables
export { useA2UI } from './composables/useA2UI'
export type { UseA2UIOptions } from './composables/useA2UI'
export { useDataModel } from './composables/useDataModel'
export { useSurface } from './composables/useSurface'

// Protocol
export { connectSSE, parseA2UIMessages } from './protocol/parser'
export { sendAction, sendFunctionResponse, createAction } from './protocol/emitter'

// Functions
export { evaluateFunction, builtinRegistry } from './functions/builtins'

// Theme
export { injectThemeStyles, useTheme, themeKey, defaultLightTheme, defaultDarkTheme } from './theme/tokens'

// Designer
export { A2UI_COMPONENT_CATALOG, ICON_NAMES } from './designer/catalog'

// Types
export type {
  // Core types
  IconName,
  ComponentName,
  DynamicString,
  DynamicNumber,
  DynamicBoolean,
  DynamicStringList,
  DynamicValue,
  ChildList,
  ChildListTemplate,
  ChildListExplicit,
  DataBinding,
  FunctionCall,
  Action,
  EventAction,
  FunctionCallAction,
  CheckRule,
  AccessibilityAttributes,
  ComponentDefinition,
  // Component types
  TextComponent,
  ImageComponent,
  IconComponent,
  VideoComponent,
  AudioPlayerComponent,
  RowComponent,
  ColumnComponent,
  ListComponent,
  CardComponent,
  TabsComponent,
  ModalComponent,
  DividerComponent,
  ButtonComponent,
  TextFieldComponent,
  CheckBoxComponent,
  ChoicePickerComponent,
  SliderComponent,
  DateTimeInputComponent,
  A2Component,
  // Messages
  CreateSurfaceMessage,
  UpdateComponentsMessage,
  UpdateDataModelMessage,
  DeleteSurfaceMessage,
  A2UIServerMessage,
  ActionMessage,
  FunctionResponseMessage,
  ErrorMessage,
  A2UIClientMessage,
  // AG-UI
  AGUIEvent,
  // Runtime
  Theme,
  SurfaceState,
  // v0.8 compat
  SurfaceUpdateMessage,
} from './types'

export { AGUIEventType, A2UI_VERSION } from './types'
