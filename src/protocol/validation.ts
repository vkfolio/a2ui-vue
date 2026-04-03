import type { ComponentName } from '../types'

export interface A2UIValidationError {
  code:
    | 'UNKNOWN_MESSAGE'
    | 'INVALID_MESSAGE'
    | 'INVALID_COMPONENT'
    | 'UNKNOWN_COMPONENT'
    | 'MISSING_REQUIRED_PROP'
    | 'UNKNOWN_PROP'
    | 'INVALID_ACTION'
    | 'INVALID_SEQUENCE'
  message: string
  path: string
  surfaceId?: string
}

export interface ValidateA2UIOptions {
  mode?: 'batch' | 'stream'
}

const SUPPORTED_COMPONENTS = [
  'Text',
  'Image',
  'Icon',
  'Video',
  'AudioPlayer',
  'Badge',
  'Progress',
  'Rating',
  'Avatar',
  'Alert',
  'Stat',
  'Row',
  'Column',
  'List',
  'Card',
  'Tabs',
  'Modal',
  'Divider',
  'Button',
  'TextField',
  'CheckBox',
  'ChoicePicker',
  'Slider',
  'DateTimeInput',
] as const satisfies readonly ComponentName[]

const COMMON_PROPS = new Set(['accessibility', 'weight'])

const ALLOWED_PROPS: Record<string, Set<string>> = {
  Text: new Set(['text', 'variant', 'usageHint']),
  Image: new Set(['url', 'src', 'fit', 'variant', 'usageHint', 'alt', 'borderRadius']),
  Icon: new Set(['name', 'size', 'color']),
  Video: new Set(['url', 'src']),
  AudioPlayer: new Set(['url', 'src', 'description']),
  Badge: new Set(['label', 'text', 'variant']),
  Progress: new Set(['value', 'label', 'variant']),
  Rating: new Set(['value', 'label', 'maxStars', 'interactive', 'action']),
  Avatar: new Set(['src', 'name', 'size', 'status']),
  Alert: new Set(['title', 'message', 'text', 'severity', 'dismissible']),
  Stat: new Set(['value', 'text', 'label', 'trend', 'trendDirection', 'icon']),
  Row: new Set(['children', 'justify', 'align', 'distribution', 'alignment']),
  Column: new Set(['children', 'justify', 'align', 'distribution', 'alignment']),
  List: new Set(['children', 'direction', 'align', 'alignment']),
  Card: new Set(['child', 'backgroundColor', 'color', 'textColor', 'padding', 'borderRadius']),
  Tabs: new Set(['tabs']),
  Modal: new Set(['trigger', 'content']),
  Divider: new Set(['axis']),
  Button: new Set(['child', 'label', 'text', 'action', 'variant', 'checks']),
  TextField: new Set(['label', 'value', 'text', 'variant', 'textFieldType', 'dataPath', 'checks', 'placeholder']),
  CheckBox: new Set(['label', 'value', 'checks']),
  ChoicePicker: new Set(['label', 'options', 'value', 'variant', 'displayStyle', 'filterable', 'checks']),
  Slider: new Set(['label', 'min', 'max', 'value', 'checks']),
  DateTimeInput: new Set(['value', 'enableDate', 'enableTime', 'min', 'max', 'label', 'checks']),
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function pushError(
  errors: A2UIValidationError[],
  code: A2UIValidationError['code'],
  message: string,
  path: string,
  surfaceId?: string,
): void {
  errors.push({ code, message, path, surfaceId })
}

function getComponentType(definition: Record<string, unknown>): string | null {
  if (typeof definition.component === 'string') return definition.component
  if (isRecord(definition.component)) {
    const keys = Object.keys(definition.component)
    if (keys.length === 1) return keys[0]
  }
  return null
}

function getComponentProps(definition: Record<string, unknown>, componentType: string): Record<string, unknown> {
  if (typeof definition.component === 'string') {
    const props = { ...definition }
    delete props.id
    delete props.component
    return props
  }
  if (isRecord(definition.component) && isRecord(definition.component[componentType])) {
    return { ...(definition.component[componentType] as Record<string, unknown>) }
  }
  return {}
}

function hasProp(props: Record<string, unknown>, ...names: string[]): boolean {
  return names.some((name) => props[name] !== undefined)
}

function validateAction(action: unknown, path: string, errors: A2UIValidationError[], surfaceId?: string): void {
  if (typeof action === 'string') return
  if (!isRecord(action)) {
    pushError(errors, 'INVALID_ACTION', 'Action must be a string or object.', path, surfaceId)
    return
  }
  if (isRecord(action.event)) {
    if (typeof action.event.name !== 'string' || !action.event.name.trim()) {
      pushError(errors, 'INVALID_ACTION', 'action.event.name must be a non-empty string.', `${path}.event.name`, surfaceId)
    }
    if (action.event.context !== undefined && !isRecord(action.event.context)) {
      pushError(errors, 'INVALID_ACTION', 'action.event.context must be an object when provided.', `${path}.event.context`, surfaceId)
    }
    return
  }
  if (typeof action.name === 'string') {
    if (action.context !== undefined && !isRecord(action.context) && !Array.isArray(action.context)) {
      pushError(errors, 'INVALID_ACTION', 'Legacy action.context must be an object or array.', `${path}.context`, surfaceId)
    }
    return
  }
  if (isRecord(action.functionCall) && typeof action.functionCall.call === 'string') {
    return
  }
  pushError(errors, 'INVALID_ACTION', 'Action must use string, { event }, legacy { name }, or { functionCall } format.', path, surfaceId)
}

function validateChildList(children: unknown, path: string, errors: A2UIValidationError[], surfaceId?: string): void {
  if (Array.isArray(children)) return
  if (!isRecord(children)) {
    pushError(errors, 'INVALID_COMPONENT', 'children must be an array or child-list object.', path, surfaceId)
    return
  }
  if (Array.isArray(children.explicitList)) return
  if (typeof children.componentId === 'string' && typeof children.path === 'string') return
  pushError(errors, 'INVALID_COMPONENT', 'children must use explicitList or { componentId, path }.', path, surfaceId)
}

function validateComponentDefinition(
  definition: unknown,
  path: string,
  errors: A2UIValidationError[],
  surfaceId?: string,
): void {
  if (!isRecord(definition)) {
    pushError(errors, 'INVALID_COMPONENT', 'Component definition must be an object.', path, surfaceId)
    return
  }
  if (typeof definition.id !== 'string' || !definition.id.trim()) {
    pushError(errors, 'INVALID_COMPONENT', 'Component definition requires a non-empty id.', `${path}.id`, surfaceId)
  }

  const componentType = getComponentType(definition)
  if (!componentType) {
    pushError(errors, 'INVALID_COMPONENT', 'Component definition requires a valid component discriminator.', `${path}.component`, surfaceId)
    return
  }
  if (!SUPPORTED_COMPONENTS.includes(componentType as ComponentName)) {
    pushError(errors, 'UNKNOWN_COMPONENT', `Unsupported component "${componentType}".`, `${path}.component`, surfaceId)
    return
  }

  const props = getComponentProps(definition, componentType)
  const allowed = ALLOWED_PROPS[componentType]
  for (const key of Object.keys(props)) {
    if (!allowed.has(key) && !COMMON_PROPS.has(key)) {
      pushError(errors, 'UNKNOWN_PROP', `Unsupported prop "${key}" on ${componentType}.`, `${path}.${key}`, surfaceId)
    }
  }

  const requireProp = (condition: boolean, propName: string, message?: string) => {
    if (!condition) {
      pushError(errors, 'MISSING_REQUIRED_PROP', message ?? `${componentType} requires "${propName}".`, `${path}.${propName}`, surfaceId)
    }
  }

  switch (componentType) {
    case 'Text':
      requireProp(hasProp(props, 'text'), 'text')
      break
    case 'Image':
      requireProp(hasProp(props, 'url', 'src'), 'url')
      break
    case 'Icon':
      requireProp(hasProp(props, 'name'), 'name')
      break
    case 'Video':
    case 'AudioPlayer':
      requireProp(hasProp(props, 'url', 'src'), 'url')
      break
    case 'Badge':
      requireProp(hasProp(props, 'label', 'text'), 'label')
      break
    case 'Progress':
      requireProp(hasProp(props, 'value', 'label'), 'value', 'Progress requires "value" or "label".')
      break
    case 'Rating':
      requireProp(hasProp(props, 'value', 'label'), 'value', 'Rating requires "value" or "label".')
      if (props.action !== undefined) validateAction(props.action, `${path}.action`, errors, surfaceId)
      break
    case 'Avatar':
      requireProp(hasProp(props, 'src', 'name'), 'src', 'Avatar requires "src" or "name".')
      break
    case 'Alert':
      requireProp(hasProp(props, 'message', 'text', 'title'), 'message', 'Alert requires "message", "text", or "title".')
      break
    case 'Stat':
      requireProp(hasProp(props, 'value', 'text'), 'value', 'Stat requires "value" or "text".')
      break
    case 'Row':
    case 'Column':
    case 'List':
      requireProp(hasProp(props, 'children'), 'children')
      if (props.children !== undefined) validateChildList(props.children, `${path}.children`, errors, surfaceId)
      break
    case 'Card':
      requireProp(hasProp(props, 'child'), 'child')
      break
    case 'Tabs':
      requireProp(Array.isArray(props.tabs), 'tabs')
      break
    case 'Modal':
      requireProp(hasProp(props, 'trigger'), 'trigger')
      requireProp(hasProp(props, 'content'), 'content')
      break
    case 'Button':
      requireProp(hasProp(props, 'child', 'label', 'text'), 'child', 'Button requires "child", "label", or "text".')
      requireProp(hasProp(props, 'action'), 'action')
      if (props.action !== undefined) validateAction(props.action, `${path}.action`, errors, surfaceId)
      break
    case 'TextField':
      requireProp(hasProp(props, 'label'), 'label')
      requireProp(hasProp(props, 'value', 'text', 'dataPath'), 'value', 'TextField requires a bound value/text/dataPath.')
      break
    case 'CheckBox':
      requireProp(hasProp(props, 'label'), 'label')
      requireProp(hasProp(props, 'value'), 'value')
      break
    case 'ChoicePicker':
      requireProp(hasProp(props, 'options') && Array.isArray(props.options), 'options')
      requireProp(hasProp(props, 'value'), 'value')
      break
    case 'Slider':
      requireProp(hasProp(props, 'max'), 'max')
      requireProp(hasProp(props, 'value'), 'value')
      break
    case 'DateTimeInput':
      requireProp(hasProp(props, 'value'), 'value')
      break
  }
}

function validateMessage(message: unknown, index: number, errors: A2UIValidationError[]): { surfaceId?: string; kind?: string } {
  const path = `/messages/${index}`
  if (!isRecord(message)) {
    pushError(errors, 'INVALID_MESSAGE', 'Each message must be an object.', path)
    return {}
  }

  if (message.createSurface && isRecord(message.createSurface)) {
    const surfaceId = typeof message.createSurface.surfaceId === 'string' ? message.createSurface.surfaceId : undefined
    if (!surfaceId) {
      pushError(errors, 'INVALID_MESSAGE', 'createSurface.surfaceId must be a non-empty string.', `${path}.createSurface.surfaceId`)
    }
    return { surfaceId, kind: 'createSurface' }
  }

  if (message.updateComponents && isRecord(message.updateComponents)) {
    const surfaceId = typeof message.updateComponents.surfaceId === 'string' ? message.updateComponents.surfaceId : undefined
    if (!Array.isArray(message.updateComponents.components) || message.updateComponents.components.length === 0) {
      pushError(errors, 'INVALID_MESSAGE', 'updateComponents.components must be a non-empty array.', `${path}.updateComponents.components`, surfaceId)
    } else {
      message.updateComponents.components.forEach((component, componentIndex) => {
        validateComponentDefinition(component, `${path}.updateComponents.components/${componentIndex}`, errors, surfaceId)
      })
    }
    return { surfaceId, kind: 'updateComponents' }
  }

  if (message.updateDataModel && isRecord(message.updateDataModel)) {
    const surfaceId = typeof message.updateDataModel.surfaceId === 'string' ? message.updateDataModel.surfaceId : undefined
    return { surfaceId, kind: 'updateDataModel' }
  }

  if (message.deleteSurface && isRecord(message.deleteSurface)) {
    const surfaceId = typeof message.deleteSurface.surfaceId === 'string' ? message.deleteSurface.surfaceId : undefined
    return { surfaceId, kind: 'deleteSurface' }
  }

  if (message.callFunction && isRecord(message.callFunction)) {
    return { kind: 'callFunction' }
  }

  if (message.surfaceUpdate && isRecord(message.surfaceUpdate)) {
    const surfaceId = typeof message.surfaceUpdate.surfaceId === 'string' ? message.surfaceUpdate.surfaceId : undefined
    if (!Array.isArray(message.surfaceUpdate.components) || message.surfaceUpdate.components.length === 0) {
      pushError(errors, 'INVALID_MESSAGE', 'surfaceUpdate.components must be a non-empty array.', `${path}.surfaceUpdate.components`, surfaceId)
    } else {
      message.surfaceUpdate.components.forEach((component, componentIndex) => {
        validateComponentDefinition(component, `${path}.surfaceUpdate.components/${componentIndex}`, errors, surfaceId)
      })
    }
    return { surfaceId, kind: 'surfaceUpdate' }
  }

  if (message.dataModelUpdate && isRecord(message.dataModelUpdate)) {
    const surfaceId = typeof message.dataModelUpdate.surfaceId === 'string' ? message.dataModelUpdate.surfaceId : undefined
    if (message.dataModelUpdate.contents !== undefined && !Array.isArray(message.dataModelUpdate.contents)) {
      pushError(errors, 'INVALID_MESSAGE', 'dataModelUpdate.contents must be an array when provided.', `${path}.dataModelUpdate.contents`, surfaceId)
    }
    return { surfaceId, kind: 'dataModelUpdate' }
  }

  if (message.beginRendering && isRecord(message.beginRendering)) {
    const surfaceId = typeof message.beginRendering.surfaceId === 'string' ? message.beginRendering.surfaceId : undefined
    if (typeof message.beginRendering.root !== 'string' || !message.beginRendering.root.trim()) {
      pushError(errors, 'INVALID_MESSAGE', 'beginRendering.root must be a non-empty string.', `${path}.beginRendering.root`, surfaceId)
    }
    return { surfaceId, kind: 'beginRendering' }
  }

  pushError(errors, 'UNKNOWN_MESSAGE', 'Message is not a supported A2UI payload.', path)
  return {}
}

export function validateA2UIMessages(messages: unknown, options: ValidateA2UIOptions = {}): A2UIValidationError[] {
  const errors: A2UIValidationError[] = []
  if (!Array.isArray(messages)) {
    pushError(errors, 'INVALID_MESSAGE', 'A2UI payload must be an array of messages.', '/messages')
    return errors
  }

  const bySurface = new Map<string, Set<string>>()
  messages.forEach((message, index) => {
    const { surfaceId, kind } = validateMessage(message, index, errors)
    if (surfaceId && kind) {
      const kinds = bySurface.get(surfaceId) ?? new Set<string>()
      kinds.add(kind)
      bySurface.set(surfaceId, kinds)
    }
  })

  if ((options.mode ?? 'batch') === 'batch') {
    for (const [surfaceId, kinds] of bySurface.entries()) {
      if (kinds.has('createSurface') && !kinds.has('updateComponents')) {
        pushError(errors, 'INVALID_SEQUENCE', 'createSurface requires updateComponents with component definitions.', '/messages', surfaceId)
      }
      if (kinds.has('surfaceUpdate') && !kinds.has('beginRendering')) {
        pushError(errors, 'INVALID_SEQUENCE', 'surfaceUpdate payloads require beginRendering in batch mode.', '/messages', surfaceId)
      }
      if (kinds.has('beginRendering') && !kinds.has('surfaceUpdate')) {
        pushError(errors, 'INVALID_SEQUENCE', 'beginRendering requires a matching surfaceUpdate in batch mode.', '/messages', surfaceId)
      }
    }
  }

  return errors
}

export function formatA2UIValidationErrors(errors: A2UIValidationError[]): string {
  return errors
    .map((error) => {
      const surface = error.surfaceId ? ` [surface:${error.surfaceId}]` : ''
      return `${error.code}${surface} ${error.path}: ${error.message}`
    })
    .join('\n')
}
