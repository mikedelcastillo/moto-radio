import { ControllerInput, INT_MAX_VALUE } from "../../constants"

const MAX_16_BIT_INT_VALUE = Math.pow(2, 15) - 1

export type JoystickInput = {
  type: "axis" | "button",
  time: number,
  number: number,
  value: number,
  init: boolean,
}

export type JoystickMappedInput = {
  type: ControllerInput,
  value: number,
}

export enum JoystickMapping {
  MICROSOFT_XBOX_ONE,
  _8BITDO_ULTIMATE,
}

export type JoystickMap = (input: JoystickInput) => JoystickMappedInput[]

export const JOYSTICK_MAPPINGS: Record<JoystickMapping, JoystickMap> = {
  [JoystickMapping.MICROSOFT_XBOX_ONE]: (input) => {
    if (input.type === "button") {
      const output: JoystickMappedInput = {
        type: "IGNORE",
        value: input.value === 0 ? 0 : INT_MAX_VALUE,
      }
      const order: ControllerInput[] = [
        "BUTTON_A",
        "BUTTON_B",
        "BUTTON_X",
        "BUTTON_Y",
        "BUTTON_LB",
        "BUTTON_RB",
        "BUTTON_SELECT",
        "BUTTON_START",
        "BUTTON_CENTER",
        "BUTTON_LS",
        "BUTTON_RS",
      ]
      if (typeof order[input.number] === "string") {
        output.type = order[input.number]
        return [output]
      }
    }
    if (input.type === "axis") {
      const value = Math.round((input.value / MAX_16_BIT_INT_VALUE) * INT_MAX_VALUE)
      const posValue = Math.round((input.value + MAX_16_BIT_INT_VALUE) / (MAX_16_BIT_INT_VALUE * 2 + 1) * INT_MAX_VALUE)
      if (input.number === 0) return [
        { type: "AXIS_LXL", value: value < 0 ? Math.abs(value) : 0 },
        { type: "AXIS_LXR", value: value > 0 ? Math.abs(value) : 0 },
      ]
      if (input.number === 1) return [
        { type: "AXIS_LYU", value: value < 0 ? Math.abs(value) : 0 },
        { type: "AXIS_LYD", value: value > 0 ? Math.abs(value) : 0 },
      ]
      if (input.number === 2) return [
        { type: "BUTTON_LT", value: posValue },
      ]
      if (input.number === 3) return [
        { type: "AXIS_RXL", value: value < 0 ? Math.abs(value) : 0 },
        { type: "AXIS_RXR", value: value > 0 ? Math.abs(value) : 0 },
      ]
      if (input.number === 4) return [
        { type: "AXIS_RYU", value: value < 0 ? Math.abs(value) : 0 },
        { type: "AXIS_RYD", value: value > 0 ? Math.abs(value) : 0 },
      ]
      if (input.number === 5) return [
        { type: "BUTTON_RT", value: posValue },
      ]
      if (input.number === 6) return [
        { type: "BUTTON_DL", value: value < 0 ? Math.abs(value) : 0 },
        { type: "BUTTON_DR", value: value > 0 ? Math.abs(value) : 0 },
      ]
      if (input.number === 7) return [
        { type: "BUTTON_DU", value: value < 0 ? Math.abs(value) : 0 },
        { type: "BUTTON_DD", value: value > 0 ? Math.abs(value) : 0 },
      ]
    }
    return []
  },
  [JoystickMapping._8BITDO_ULTIMATE]: (input) => {
    return []
  },
}