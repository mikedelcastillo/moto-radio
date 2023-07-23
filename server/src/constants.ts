export const SERIAL_BAUDRATE = 115200
export const INT_START_BYTE = 0
export const POLL_INTERVAL = 25
export const TIMEOUT_INTERVAL = 100

export const RADIO_ADDRESSES = [
  "twig", "soy", "boni", "branch", "pizza", "drafj",
  "draft", "blu", "percy", "pasta", "rust", "jinx", "bambi",
]

export const MAX_RADIO_ADDRESSES = RADIO_ADDRESSES.length
export const MAX_CONTROLLERS = 4
export const MAX_INT_RADIO_VALUE = 255

export const MESSAGE_BYTE_KEYS = [
  "CONTROLLER_INPUT",
  "CONTROLLER_CLEAR",
] as const

export const CONTROLLER_INPUT_ENUM_VAR = "ControllerInputType"
export const CONTROLLER_INPUT_ENUM_PREFIX = "CI_"
export const CONTROLLER_INPUT_ENUM = [
  "BUTTON_A",
  "BUTTON_B",
  "BUTTON_X",
  "BUTTON_Y",
  "BUTTON_START",
  "BUTTON_SELECT",
  "AXIS_LT",
  "AXIS_RT",
  "BUTTON_LB",
  "BUTTON_RB",
  "BUTTON_DU",
  "BUTTON_DD",
  "BUTTON_DL",
  "BUTTON_DR",
  "BUTTON_LS",
  "BUTTON_RS",
  "AXIS_LSX",
  "AXIS_LSY",
  "AXIS_RSX",
  "AXIS_RSY",
  "BUTTON_CENTER",
  "IGNORE",
] as const

export const BYTE_KEYS = [...MESSAGE_BYTE_KEYS] as const

export type ControllerInput = typeof CONTROLLER_INPUT_ENUM[number]
export type ByteKeys = typeof BYTE_KEYS[number]

export const RADIO_MESSAGE_BUFFER = [
  ["BUTTON_A", 1],
  ["BUTTON_B", 1],
  ["BUTTON_X", 1],
  ["BUTTON_Y", 1],
  ["BUTTON_START", 1],
  ["BUTTON_SELECT", 1],
  ["AXIS_LT", 1],
  ["AXIS_RT", 1],
  ["BUTTON_LB", 1],
  ["BUTTON_RB", 1],
  ["BUTTON_DU", 1],
  ["BUTTON_DD", 1],
  ["BUTTON_DL", 1],
  ["BUTTON_DR", 1],
  ["BUTTON_LS", 1],
  ["BUTTON_RS", 1],
  ["BUTTON_CENTER", 1],
  ["AXIS_LSX", 2],
  ["AXIS_LSY", 2],
  ["AXIS_RSX", 2],
  ["AXIS_RSY", 2],
] as const satisfies readonly (readonly [ControllerInput, 1 | 2])[]

export const RADIO_MESSAGE_BUFFER_LENGTH = RADIO_MESSAGE_BUFFER
  .reduce((sum, item) => sum += item[1], 0)

export const BYTES = {
  CONTROLLER_INPUT: "i",
  CONTROLLER_CLEAR: "c",
} as const satisfies Record<ByteKeys, string>