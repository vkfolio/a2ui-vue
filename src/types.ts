/**
 * A2UI Protocol TypeScript Types
 *
 * Comprehensive type definitions for the A2UI (Agent to UI) protocol v0.10,
 * derived from the official JSON Schema specification files:
 *   - common_types.json
 *   - basic_catalog.json
 *   - server_to_client.json
 *   - client_to_server.json
 *
 * Also includes v0.8 compatibility types and AG-UI event types.
 */

// =============================================================================
// Protocol Version
// =============================================================================

/** The current A2UI protocol version. */
export const A2UI_VERSION = 'v0.10' as const

/** Supported protocol version string. */
export type A2UIVersion = 'v0.10'

// =============================================================================
// Icon Names
// =============================================================================

/**
 * Union type of all valid icon names defined in the basic catalog.
 * These map to standard Material Design-style icon identifiers.
 */
export type IconName =
  | 'accountCircle'
  | 'add'
  | 'arrowBack'
  | 'arrowForward'
  | 'attachFile'
  | 'calendarToday'
  | 'call'
  | 'camera'
  | 'check'
  | 'close'
  | 'delete'
  | 'download'
  | 'edit'
  | 'event'
  | 'error'
  | 'fastForward'
  | 'favorite'
  | 'favoriteOff'
  | 'folder'
  | 'help'
  | 'home'
  | 'info'
  | 'locationOn'
  | 'lock'
  | 'lockOpen'
  | 'mail'
  | 'menu'
  | 'moreVert'
  | 'moreHoriz'
  | 'notificationsOff'
  | 'notifications'
  | 'pause'
  | 'payment'
  | 'person'
  | 'phone'
  | 'photo'
  | 'play'
  | 'print'
  | 'refresh'
  | 'rewind'
  | 'search'
  | 'send'
  | 'settings'
  | 'share'
  | 'shoppingCart'
  | 'skipNext'
  | 'skipPrevious'
  | 'star'
  | 'starHalf'
  | 'starOff'
  | 'stop'
  | 'upload'
  | 'visibility'
  | 'visibilityOff'
  | 'volumeDown'
  | 'volumeMute'
  | 'volumeOff'
  | 'volumeUp'
  | 'warning'

// =============================================================================
// Component Names
// =============================================================================

/** Union of all component type discriminator strings in the basic catalog. */
export type ComponentName =
  | 'Text'
  | 'Image'
  | 'Icon'
  | 'Video'
  | 'AudioPlayer'
  | 'Badge'
  | 'Progress'
  | 'Rating'
  | 'Avatar'
  | 'Alert'
  | 'Stat'
  | 'Row'
  | 'Column'
  | 'List'
  | 'Card'
  | 'Tabs'
  | 'Modal'
  | 'Divider'
  | 'Button'
  | 'TextField'
  | 'CheckBox'
  | 'ChoicePicker'
  | 'Slider'
  | 'DateTimeInput'

// =============================================================================
// Primitive & Identity Types
// =============================================================================

/** Unique identifier for a component within a surface. */
export type ComponentId = string

/**
 * Unique identifier for a server-initiated function call.
 * The `agentId` identifies the originating agent; the `callId` uniquely
 * identifies this particular invocation.
 */
export interface CallId {
  /** Uniquely identifies this instance of the function call. */
  callId: string
  /** Identifies the agent initiating the function call. */
  agentId?: string
}

// =============================================================================
// Data Binding
// =============================================================================

/**
 * A reference to a value in the data model via a JSON Pointer path.
 * Used within dynamic value types to bind component properties to data.
 */
export interface DataBinding {
  /** A JSON Pointer path to a value in the data model (e.g. "/user/name"). */
  path: string
}

// =============================================================================
// Function Call
// =============================================================================

/** Where a function is allowed to be invoked from. */
export type CallableFrom = 'clientOnly' | 'remoteOnly' | 'clientOrRemote'

/** The expected return type of a function call. */
export type FunctionReturnType = 'array' | 'boolean' | 'number' | 'object' | 'string' | 'void'

/**
 * Invokes a named function on the client.
 * Used for validation, formatting, logical operations, and side effects (e.g. openUrl).
 */
export interface FunctionCall {
  /** The name of the function to call. */
  call: string
  /** Arguments passed to the function. Values can be dynamic. */
  args?: Record<string, DynamicValue | object>
  /** The expected return type of the function call. Defaults to "boolean". */
  returnType?: FunctionReturnType
  /** Specifies where this function can be invoked from. Defaults to "clientOnly". */
  callableFrom?: CallableFrom
}

// =============================================================================
// Dynamic Value Types
// =============================================================================

/**
 * A string that can be a literal value, a data model binding, or a function
 * call that returns a string.
 */
export type DynamicString = string | DataBinding | (FunctionCall & { returnType: 'string' })

/**
 * A number that can be a literal value, a data model binding, or a function
 * call that returns a number.
 */
export type DynamicNumber = number | DataBinding | (FunctionCall & { returnType: 'number' })

/**
 * A boolean that can be a literal value, a data model binding, or a function
 * call that returns a boolean.
 */
export type DynamicBoolean = boolean | DataBinding | (FunctionCall & { returnType: 'boolean' })

/**
 * A list of strings that can be a literal array, a data model binding, or a
 * function call that returns an array.
 */
export type DynamicStringList = string[] | DataBinding | (FunctionCall & { returnType: 'array' })

/**
 * A value of any type: string, number, boolean, array, a data model binding,
 * or a function call returning any type.
 */
export type DynamicValue = string | number | boolean | unknown[] | DataBinding | FunctionCall

// =============================================================================
// ChildList
// =============================================================================

/**
 * Defines children for a container component.
 *
 * - **Static**: an array of component IDs (string[]).
 * - **Template**: generates children dynamically from a data model list.
 */
export type ChildList = ComponentId[] | ChildListTemplate | ChildListExplicit

/**
 * v0.8 explicit list format: `{ explicitList: ["child-1", "child-2"] }`
 */
export interface ChildListExplicit {
  explicitList: ComponentId[]
}

/**
 * A template for generating a dynamic list of children from a data model list.
 * The `componentId` references the template component; `path` points to the
 * list of property objects in the data model.
 */
export interface ChildListTemplate {
  /** The component to use as a template for each item. */
  componentId: ComponentId
  /** The JSON Pointer path to the list of component property objects in the data model. */
  path: string
}

// =============================================================================
// Action
// =============================================================================

/**
 * An interaction handler that either dispatches a server-side event
 * or executes a local client-side function.
 */
export type Action = EventAction | FunctionCallAction

/** Triggers a server-side event when the user interacts with a component. */
export interface EventAction {
  event: {
    /** The name of the action to dispatch to the server. */
    name: string
    /**
     * Key-value pairs for the action context. Values can be literals or
     * data model bindings. Resolved before sending to the server.
     */
    context?: Record<string, DynamicValue>
  }
}

/** Executes a local client-side function when the user interacts with a component. */
export interface FunctionCallAction {
  functionCall: FunctionCall
}

// =============================================================================
// CheckRule (Validation)
// =============================================================================

/**
 * A single validation rule applied to an input component.
 * The `condition` is a dynamic boolean expression that must evaluate to true
 * for the input to be considered valid.
 */
export interface CheckRule {
  /** A dynamic boolean expression; must evaluate to true for validity. */
  condition: DynamicBoolean
  /** The error message to display if the check fails. */
  message: string
}

// =============================================================================
// Accessibility
// =============================================================================

/**
 * Attributes to enhance accessibility when using assistive technologies
 * like screen readers.
 */
export interface AccessibilityAttributes {
  /**
   * A short string (typically 1-3 words) conveying the purpose of an element.
   * For example, an input field might have a label of "User ID".
   */
  label?: DynamicString
  /**
   * Additional information about an element, such as instructions or the
   * result of an action. For example, a mute button description:
   * "Silences notifications about this conversation".
   */
  description?: DynamicString
}

// =============================================================================
// Theme
// =============================================================================

/**
 * Theme parameters for a surface. Contains well-known properties and allows
 * arbitrary additional theme keys via the index signature.
 */
export interface Theme {
  /**
   * The primary brand color used for highlights (e.g., primary buttons,
   * active borders). Format: hexadecimal code (e.g., "#00BFFF").
   */
  primaryColor?: string
  /**
   * A URL for an image that identifies the agent or tool associated
   * with the surface.
   */
  iconUrl?: string
  /** Text displayed next to the surface to identify the creating agent/tool. */
  agentDisplayName?: string
  /** Additional arbitrary theme parameters. */
  [key: string]: unknown
}

// =============================================================================
// Component Interfaces — Common Properties
// =============================================================================

/** Properties shared by all components. */
export interface ComponentCommon {
  /** Unique identifier for this component within the surface. */
  id: ComponentId
  /** Accessibility attributes for assistive technologies. */
  accessibility?: AccessibilityAttributes
  /**
   * The relative weight of this component within a Row or Column,
   * similar to CSS flex-grow. Only valid on direct children of Row/Column.
   */
  weight?: number
}

// =============================================================================
// Component Interfaces — Display Components
// =============================================================================

/**
 * Displays text content. Supports simple Markdown formatting
 * (without HTML, images, or links).
 */
export interface TextComponent extends ComponentCommon {
  component: 'Text'
  /** The text content to display. Supports simple Markdown. */
  text: DynamicString
  /** A hint for the base text style. Defaults to "body". */
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'caption' | 'body'
}

/** Displays an image from a URL. */
export interface ImageComponent extends ComponentCommon {
  component: 'Image'
  /** The URL of the image to display. */
  url: DynamicString
  /** How the image is resized to fit its container (CSS object-fit). Defaults to "fill". */
  fit?: 'contain' | 'cover' | 'fill' | 'none' | 'scaleDown'
  /** A hint for the image size and style. Defaults to "mediumFeature". */
  variant?: 'icon' | 'avatar' | 'smallFeature' | 'mediumFeature' | 'largeFeature' | 'header'
}

/** Displays a named icon from the standard icon set, or a data-bound icon name. */
export interface IconComponent extends ComponentCommon {
  component: 'Icon'
  /** The icon to display: a static icon name or a data binding to one. */
  name: IconName | DataBinding
}

/** Displays a video from a URL. */
export interface VideoComponent extends ComponentCommon {
  component: 'Video'
  /** The URL of the video to display. */
  url: DynamicString
}

/** Plays audio from a URL. */
export interface AudioPlayerComponent extends ComponentCommon {
  component: 'AudioPlayer'
  /** The URL of the audio to be played. */
  url: DynamicString
  /** A description of the audio, such as a title or summary. */
  description?: DynamicString
}

// =============================================================================
// Component Interfaces — Layout Components
// =============================================================================

/** Arranges its children horizontally. Nest Columns within a Row for grids. */
export interface RowComponent extends ComponentCommon {
  component: 'Row'
  /** The children to arrange, as static IDs or a template. */
  children: ChildList
  /** Arrangement along the main (horizontal) axis. Defaults to "start". */
  justify?: 'center' | 'end' | 'spaceAround' | 'spaceBetween' | 'spaceEvenly' | 'start' | 'stretch'
  /** Alignment along the cross (vertical) axis. Defaults to "stretch". */
  align?: 'start' | 'center' | 'end' | 'stretch'
}

/** Arranges its children vertically. Nest Rows within a Column for grids. */
export interface ColumnComponent extends ComponentCommon {
  component: 'Column'
  /** The children to arrange, as static IDs or a template. */
  children: ChildList
  /** Arrangement along the main (vertical) axis. Defaults to "start". */
  justify?: 'start' | 'center' | 'end' | 'spaceBetween' | 'spaceAround' | 'spaceEvenly' | 'stretch'
  /** Alignment along the cross (horizontal) axis. Defaults to "stretch". */
  align?: 'center' | 'end' | 'start' | 'stretch'
}

/** A scrollable list of children, laid out vertically or horizontally. */
export interface ListComponent extends ComponentCommon {
  component: 'List'
  /** The children to display, as static IDs or a template. */
  children: ChildList
  /** Direction of the list layout. Defaults to "vertical". */
  direction?: 'vertical' | 'horizontal'
  /** Alignment along the cross axis. Defaults to "stretch". */
  align?: 'start' | 'center' | 'end' | 'stretch'
}

/** A card container that wraps a single child component. */
export interface CardComponent extends ComponentCommon {
  component: 'Card'
  /**
   * The ID of the single child component rendered inside the card.
   * Wrap multiple elements in a layout component (Column/Row) first.
   */
  child: ComponentId
}

/** Tab definition within a TabsComponent. */
export interface TabItem {
  /** The tab title. */
  title: DynamicString
  /** The ID of the child component displayed when this tab is active. */
  child: ComponentId
}

/** A tabbed container with multiple switchable panes. */
export interface TabsComponent extends ComponentCommon {
  component: 'Tabs'
  /** Array of tab definitions, each with a title and child component. */
  tabs: TabItem[]
}

/** A modal dialog with a trigger component and content component. */
export interface ModalComponent extends ComponentCommon {
  component: 'Modal'
  /** The ID of the component that opens the modal on interaction. */
  trigger: ComponentId
  /** The ID of the component displayed inside the modal. */
  content: ComponentId
}

/** A horizontal or vertical divider line. */
export interface DividerComponent extends ComponentCommon {
  component: 'Divider'
  /** Orientation of the divider. Defaults to "horizontal". */
  axis?: 'horizontal' | 'vertical'
}

// =============================================================================
// Component Interfaces — Interactive Components
// =============================================================================

/** A clickable button that triggers an action. */
export interface ButtonComponent extends ComponentCommon {
  component: 'Button'
  /**
   * The ID of the child component (usually Text or Icon).
   * Use Text for labeled buttons; use Icon only for icon-only buttons.
   */
  child: ComponentId
  /** The action to perform when the button is clicked. */
  action: Action
  /** Button style variant. Defaults to "default". */
  variant?: 'default' | 'primary' | 'borderless'
  /** Validation rules to check before executing the action. */
  checks?: CheckRule[]
}

/** A text input field. */
export interface TextFieldComponent extends ComponentCommon {
  component: 'TextField'
  /** The text label for the input field. */
  label: DynamicString
  /** The current value of the text field. */
  value?: DynamicString
  /** The type of input field. Defaults to "shortText". */
  variant?: 'longText' | 'number' | 'shortText' | 'obscured'
  /** Validation rules for this field. */
  checks?: CheckRule[]
}

/** A checkbox input. */
export interface CheckBoxComponent extends ComponentCommon {
  component: 'CheckBox'
  /** The text displayed next to the checkbox. */
  label: DynamicString
  /** The current state: true for checked, false for unchecked. */
  value: DynamicBoolean
  /** Validation rules for this checkbox. */
  checks?: CheckRule[]
}

/** An option within a ChoicePickerComponent. */
export interface ChoicePickerOption {
  /** The display text for this option. */
  label: DynamicString
  /** The stable value associated with this option. */
  value: string
}

/** A component for selecting one or more options from a list. */
export interface ChoicePickerComponent extends ComponentCommon {
  component: 'ChoicePicker'
  /** Label for the group of options. */
  label?: DynamicString
  /** The available options. */
  options: ChoicePickerOption[]
  /** The currently selected value(s). Bind to a string array in the data model. */
  value: DynamicStringList
  /** Selection mode. Defaults to "mutuallyExclusive". */
  variant?: 'multipleSelection' | 'mutuallyExclusive'
  /** Display style. Defaults to "checkbox". */
  displayStyle?: 'checkbox' | 'chips'
  /** If true, displays a search input to filter options. Defaults to false. */
  filterable?: boolean
  /** Validation rules for this component. */
  checks?: CheckRule[]
}

/** A slider for selecting a numeric value within a range. */
export interface SliderComponent extends ComponentCommon {
  component: 'Slider'
  /** The label for the slider. */
  label?: DynamicString
  /** The minimum value. Defaults to 0. */
  min?: number
  /** The maximum value. Required. */
  max: number
  /** The current value. */
  value: DynamicNumber
  /** Validation rules for this slider. */
  checks?: CheckRule[]
}

/** A date and/or time input field. */
export interface DateTimeInputComponent extends ComponentCommon {
  component: 'DateTimeInput'
  /** The selected date/time in ISO 8601 format. Initialize with "" if unset. */
  value: DynamicString
  /** If true, allows date selection. Defaults to false. */
  enableDate?: boolean
  /** If true, allows time selection. Defaults to false. */
  enableTime?: boolean
  /** Minimum allowed date/time in ISO 8601 format. */
  min?: DynamicString
  /** Maximum allowed date/time in ISO 8601 format. */
  max?: DynamicString
  /** The text label for the input field. */
  label?: DynamicString
  /** Validation rules for this input. */
  checks?: CheckRule[]
}

/** A pill badge for lightweight status display. */
export interface BadgeComponent extends ComponentCommon {
  component: 'Badge'
  label?: DynamicString
  text?: DynamicString
  variant?: 'neutral' | 'success' | 'warning' | 'error' | 'info' | 'primary'
}

/** A progress indicator. */
export interface ProgressComponent extends ComponentCommon {
  component: 'Progress'
  value?: DynamicNumber
  label?: DynamicString
  variant?: 'linear' | 'circular'
}

/** A rating display or interactive selector. */
export interface RatingComponent extends ComponentCommon {
  component: 'Rating'
  value?: DynamicNumber
  label?: DynamicString
  maxStars?: number
  interactive?: boolean
  action?: Action
}

/** An avatar image or initials chip. */
export interface AvatarComponent extends ComponentCommon {
  component: 'Avatar'
  src?: DynamicString
  name?: DynamicString
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  status?: 'online' | 'offline' | 'away' | 'busy'
}

/** An inline alert message. */
export interface AlertComponent extends ComponentCommon {
  component: 'Alert'
  title?: DynamicString
  message?: DynamicString
  text?: DynamicString
  severity?: 'info' | 'success' | 'warning' | 'error'
  dismissible?: boolean
}

/** A compact stat/KPI display. */
export interface StatComponent extends ComponentCommon {
  component: 'Stat'
  value?: DynamicString | DynamicNumber
  text?: DynamicString | DynamicNumber
  label?: DynamicString
  trend?: DynamicString
  trendDirection?: 'up' | 'down' | 'neutral'
  icon?: DynamicString
}

// =============================================================================
// A2Component — Union of All Components
// =============================================================================

/**
 * Discriminated union of all 18 A2UI component types.
 * Use the `component` field as the discriminator.
 */
export type A2Component =
  | TextComponent
  | ImageComponent
  | IconComponent
  | VideoComponent
  | AudioPlayerComponent
  | BadgeComponent
  | ProgressComponent
  | RatingComponent
  | AvatarComponent
  | AlertComponent
  | StatComponent
  | RowComponent
  | ColumnComponent
  | ListComponent
  | CardComponent
  | TabsComponent
  | ModalComponent
  | DividerComponent
  | ButtonComponent
  | TextFieldComponent
  | CheckBoxComponent
  | ChoicePickerComponent
  | SliderComponent
  | DateTimeInputComponent

// =============================================================================
// ComponentDefinition — Flat JSON Representation
// =============================================================================

/**
 * The flat definition of a component as it appears in the JSON wire format.
 * Every component has an `id` and a `component` discriminator string,
 * plus any additional component-specific properties.
 */
export interface ComponentDefinition {
  /** Unique identifier for this component within the surface. */
  id: ComponentId
  /** The component type discriminator (e.g. "Text", "Button"). */
  component: ComponentName
  /** Accessibility attributes. */
  accessibility?: AccessibilityAttributes
  /** Flex-grow weight when inside a Row or Column. */
  weight?: number
  /** All other component-specific properties. */
  [key: string]: unknown
}

// =============================================================================
// Server-to-Client Messages (v0.10)
// =============================================================================

/**
 * Signals the client to create a new surface and begin rendering.
 * Must be followed by UpdateComponentsMessage and/or UpdateDataModelMessage.
 */
export interface CreateSurfaceMessage {
  version: A2UIVersion
  createSurface: {
    /** Unique identifier for the surface. */
    surfaceId: string
    /**
     * Identifies the catalog to use. Recommended to prefix with a domain
     * you own (e.g. "mycompany.com:somecatalog").
     */
    catalogId: string
    /** Initial theme parameters for the surface. */
    theme?: Theme
    /**
     * If true, the client sends the full data model in the metadata of every
     * A2A message sent to the server. Defaults to false.
     */
    sendDataModel?: boolean
  }
}

/**
 * Updates a surface with a new set of components.
 * One component in the list must have an id of "root".
 */
export interface UpdateComponentsMessage {
  version: A2UIVersion
  updateComponents: {
    /** The surface to update. */
    surfaceId: string
    /** The component definitions to apply. Must contain at least one. */
    components: ComponentDefinition[]
  }
}

/**
 * Updates the data model for an existing surface.
 * The value at `path` is replaced/created, or removed if `value` is omitted.
 */
export interface UpdateDataModelMessage {
  version: A2UIVersion
  updateDataModel: {
    /** The surface this data model update applies to. */
    surfaceId: string
    /**
     * JSON Pointer path within the data model (e.g. "/user/name").
     * Omit or use "/" for the entire data model.
     */
    path?: string
    /**
     * The data to set at the path. If omitted, the key at path is removed.
     */
    value?: unknown
  }
}

/** Signals the client to delete the specified surface. */
export interface DeleteSurfaceMessage {
  version: A2UIVersion
  deleteSurface: {
    /** The surface to delete. */
    surfaceId: string
  }
}

/**
 * A function call initiated by the server, to be executed on the client.
 * The client must respond with a FunctionResponseMessage or ErrorMessage
 * if `wantResponse` is true.
 */
export interface CallFunctionMessage {
  version: A2UIVersion
  /** Unique ID for this function invocation. Must be echoed in the response. */
  functionCallId: CallId
  /** If true, the server expects a response. Defaults to false. */
  wantResponse?: boolean
  /** The function to call. Must have callableFrom of "remoteOnly" or "clientOrRemote". */
  callFunction: FunctionCall & {
    callableFrom: 'remoteOnly' | 'clientOrRemote'
    returnType: FunctionReturnType
  }
}

/** Discriminated union of all server-to-client message types. */
export type A2UIServerMessage =
  | CreateSurfaceMessage
  | UpdateComponentsMessage
  | UpdateDataModelMessage
  | DeleteSurfaceMessage
  | CallFunctionMessage

/**
 * Alias kept for backward compatibility with code that uses `ServerMessage`.
 * @deprecated Use `A2UIServerMessage` instead.
 */
export type ServerMessage = A2UIServerMessage

// =============================================================================
// Client-to-Server Messages (v0.10)
// =============================================================================

/** Reports a user-initiated action from a component to the server. */
export interface ActionMessage {
  version: A2UIVersion
  action: {
    /** The action name, from the component's action.event.name. */
    name: string
    /** The surface where the event originated. */
    surfaceId: string
    /** The component that triggered the event. */
    sourceComponentId: string
    /** ISO 8601 timestamp of when the event occurred. */
    timestamp: string
    /** Resolved key-value pairs from the component's action.event.context. */
    context: Record<string, unknown>
  }
}

/** Returns the result of a server-initiated function call. */
export interface FunctionResponseMessage {
  version: A2UIVersion
  functionResponse: {
    /** Must match the functionCallId from the CallFunctionMessage. */
    functionCallId: CallId
    /** The return value of the function invocation. */
    value: string | number | boolean | unknown[] | object | null
  }
}

/** Reports a client-side error to the server. */
export interface ErrorMessage {
  version: A2UIVersion
  error: ValidationError | GenericError
}

/** A validation failure error. */
export interface ValidationError {
  code: 'VALIDATION_FAILED'
  /** The surface where the error occurred. */
  surfaceId: string
  /** JSON Pointer to the field that failed validation (e.g. "/components/0/text"). */
  path: string
  /** Short description of why validation failed. */
  message: string
}

/** A generic client-side error. Must include either surfaceId or functionCallId. */
export interface GenericError {
  /** Error code (anything except "VALIDATION_FAILED"). */
  code: string
  /** Short description of why the error occurred. */
  message: string
  /** The surface where the error occurred (mutually exclusive with functionCallId). */
  surfaceId?: string
  /** The function call that caused the error (mutually exclusive with surfaceId). */
  functionCallId?: CallId
  /** Additional error properties. */
  [key: string]: unknown
}

/** Union of all client-to-server message types. */
export type A2UIClientMessage =
  | ActionMessage
  | FunctionResponseMessage
  | ErrorMessage

// =============================================================================
// AG-UI Event Types
// =============================================================================

/**
 * Enumeration of AG-UI (Agent-UI) protocol event types.
 * Used for streaming agent interactions through SSE or similar transports.
 */
export enum AGUIEventType {
  TEXT_MESSAGE_CONTENT = 'TEXT_MESSAGE_CONTENT',
  TEXT_MESSAGE_END = 'TEXT_MESSAGE_END',
  TOOL_CALL_START = 'TOOL_CALL_START',
  TOOL_CALL_ARGS = 'TOOL_CALL_ARGS',
  TOOL_CALL_END = 'TOOL_CALL_END',
  TOOL_CALL_RESULT = 'TOOL_CALL_RESULT',
  RUN_STARTED = 'RUN_STARTED',
  RUN_FINISHED = 'RUN_FINISHED',
  RUN_ERROR = 'RUN_ERROR',
  STATE_SNAPSHOT = 'STATE_SNAPSHOT',
  STATE_DELTA = 'STATE_DELTA',
  MESSAGES_SNAPSHOT = 'MESSAGES_SNAPSHOT',
  CUSTOM = 'CUSTOM',
  STEP_STARTED = 'STEP_STARTED',
  STEP_FINISHED = 'STEP_FINISHED',
}

/** An AG-UI event transmitted over a streaming transport. */
export interface AGUIEvent {
  /** The type of event. */
  type: AGUIEventType
  /** The event payload. Structure varies by event type. */
  [key: string]: unknown
}

// =============================================================================
// Surface State (Runtime)
// =============================================================================

/**
 * Runtime state of a rendered surface, maintained by the client.
 * Tracks the component tree, data model, and surface metadata.
 */
export interface SurfaceState {
  /** Map of component ID to component definition. */
  components: Map<string, ComponentDefinition>
  /** The data model: an arbitrary JSON object bound to component properties. */
  dataModel: Record<string, unknown>
  /** The current theme of the surface. */
  theme: Theme
  /** The ID of the root component (typically "root"). */
  rootId: string
  /** The catalog ID used for this surface. */
  catalogId: string
  /** Whether the client sends the data model with every A2A message. */
  sendDataModel: boolean
}

// =============================================================================
// v0.8 Compatibility Types
// =============================================================================

/**
 * v0.8 surface update message format.
 * In v0.8, a single message could carry surface updates, data model updates,
 * and a begin-rendering flag together. Retained for backward compatibility.
 */
export interface SurfaceUpdateMessage {
  /** v0.8 surface definition with components. */
  surfaceUpdate?: {
    /** The surface ID. */
    surfaceId: string
    /** The catalog ID. */
    catalogId?: string
    /** Theme settings. */
    theme?: Theme
    /** Component definitions. */
    components?: ComponentDefinition[]
  }
  /** v0.8 data model update payload. */
  dataModelUpdate?: {
    /** The surface this update applies to. */
    surfaceId: string
    /** JSON Pointer path within the data model. */
    path?: string
    /** The data to set at the path. */
    value?: unknown
  }
  /** v0.8 flag indicating the surface should begin rendering. */
  beginRendering?: {
    /** The surface to begin rendering. */
    surfaceId: string
  }
}

// =============================================================================
// Catalog Function Definitions (for reference / type narrowing)
// =============================================================================

/** Names of all built-in functions defined in the basic catalog. */
export type CatalogFunctionName =
  | 'required'
  | 'regex'
  | 'length'
  | 'numeric'
  | 'email'
  | 'formatString'
  | 'formatNumber'
  | 'formatCurrency'
  | 'formatDate'
  | 'pluralize'
  | 'openUrl'
  | 'and'
  | 'or'
  | 'not'
