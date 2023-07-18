export const SERIAL_BAUDRATE = 115200
export const INT_START_BYTE = 0

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

export const BYTE_KEYS = [...MESSAGE_BYTE_KEYS, ...CONTROLLER_INPUT_ENUM] as const

export type ControllerInput = typeof CONTROLLER_INPUT_ENUM[number]
export type ByteKeys = typeof BYTE_KEYS[number]

export const BYTES = {
  CONTROLLER_INPUT: "i",
  CONTROLLER_CLEAR: "c",
} as Record<ByteKeys, string>

for (let i = 0; i < CONTROLLER_INPUT_ENUM.length; i++) {
  const key = CONTROLLER_INPUT_ENUM[i] as unknown as ByteKeys
  BYTES[key] = String.fromCharCode(INT_START_BYTE + i)
}