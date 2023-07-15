export const MAX_CONTROLLERS = 4
export const INT_MAX_VALUE = 128
export const INT_START_BYTE = "0".charCodeAt(0)

export const RADIO_ADDRESSES = [
    "twig", "soy", "boni", "branch", "pizza", "drafj", 
    "draft", "blu", "percy", "pasta", "rust", "jinx", "bambi",
]

export const MESSAGE_BYTE_KEYS = [
    "CONTROLLER_INPUT",
    "CONTROLLER_ADDRESS",
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
    "BUTTON_LT",
    "BUTTON_LB",
    "BUTTON_RT",
    "BUTTON_RB",
    "BUTTON_DU",
    "BUTTON_DD",
    "BUTTON_DL",
    "BUTTON_DR",
    "AXIS_LXL",
    "AXIS_LXR",
    "AXIS_LYU",
    "AXIS_LYD",
    "AXIS_RXL",
    "AXIS_RXR",
    "AXIS_RYU",
    "AXIS_RYD",
] as const

export const BYTE_KEYS = [...MESSAGE_BYTE_KEYS, ...CONTROLLER_INPUT_ENUM] as const

export type ByteKeys = keyof typeof BYTE_KEYS

export const BYTES = {
    CONTROLLER_INPUT: "i",
    CONTROLLER_ADDRESS: "a",
} as unknown as Record<ByteKeys, string>

for(let i = 0; i < CONTROLLER_INPUT_ENUM.length; i++){
    const key = CONTROLLER_INPUT_ENUM[i] as unknown as ByteKeys
    BYTES[key] = String.fromCharCode(INT_START_BYTE + i)
}