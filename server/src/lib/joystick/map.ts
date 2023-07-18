import { ControllerInput, MAX_INT_RADIO_VALUE } from "../../constants"

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
  valuePos: number,
  valueNeg: number,
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
        valuePos: input.value === 0 ? 0 : MAX_INT_RADIO_VALUE,
        valueNeg: 0,
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
      const value = Math.round((input.value / MAX_16_BIT_INT_VALUE) * MAX_INT_RADIO_VALUE)
      const valueFull = Math.round((input.value + MAX_16_BIT_INT_VALUE) / (MAX_16_BIT_INT_VALUE * 2 + 1) * MAX_INT_RADIO_VALUE)
      const valuePos = value < 0 ? Math.abs(value) : 0
      const valueNeg = value > 0 ? Math.abs(value) : 0
      if (input.number === 0) return [
        { type: "AXIS_LSX", valuePos, valueNeg },
      ]
      if (input.number === 1) return [
        { type: "AXIS_LSY", valuePos, valueNeg },
      ]
      if (input.number === 2) return [
        { type: "AXIS_LT", valuePos: valueFull, valueNeg: 0 },
      ]
      if (input.number === 3) return [
        { type: "AXIS_RSX", valuePos, valueNeg },
      ]
      if (input.number === 4) return [
        { type: "AXIS_RSY", valuePos, valueNeg },
      ]
      if (input.number === 5) return [
        { type: "AXIS_RT", valuePos: valueFull, valueNeg: 0 },
      ]
      if (input.number === 6) return [
        { type: "BUTTON_DL", valuePos, valueNeg },
      ]
      if (input.number === 7) return [
        { type: "BUTTON_DU", valuePos, valueNeg },
      ]
    }
    return []
  },
  [JoystickMapping._8BITDO_ULTIMATE]: (input) => {
    if (input.type === "button") {
      const output: JoystickMappedInput = {
        type: "IGNORE",
        valuePos: input.value === 0 ? 0 : MAX_INT_RADIO_VALUE,
        valueNeg: 0,
      }
      const order: ControllerInput[] = [
        "BUTTON_A",
        "BUTTON_B",
        "IGNORE",
        "BUTTON_X",
        "BUTTON_Y",
        "IGNORE",
        "BUTTON_LB",
        "BUTTON_RB",
        "IGNORE",
        "IGNORE",
        "BUTTON_SELECT",
        "BUTTON_START",
        "BUTTON_CENTER",
        "BUTTON_LS",
        "BUTTON_RS",
        // paddle r 19
        // paddle L  23
      ]
      if (typeof order[input.number] === "string") {
        output.type = order[input.number]
        return [output]
      }
    }
    if (input.type === "axis") {
      const value = Math.round((input.value / MAX_16_BIT_INT_VALUE) * MAX_INT_RADIO_VALUE)
      const valueFull = Math.round((input.value + MAX_16_BIT_INT_VALUE) / (MAX_16_BIT_INT_VALUE * 2 + 1) * MAX_INT_RADIO_VALUE)
      const valuePos = value < 0 ? Math.abs(value) : 0
      const valueNeg = value > 0 ? Math.abs(value) : 0
      if (input.number === 0) return [
        { type: "AXIS_LSX", valuePos, valueNeg },
      ]
      if (input.number === 1) return [
        { type: "AXIS_LSY", valuePos, valueNeg },
      ]
      if (input.number === 2) return [
        { type: "AXIS_RSX", valuePos, valueNeg },
      ]
      if (input.number === 3) return [
        { type: "AXIS_RSY", valuePos, valueNeg },
      ]
      if (input.number === 4) return [
        { type: "AXIS_RT", valuePos: valueFull, valueNeg: 0 },
      ]
      if (input.number === 5) return [
        { type: "AXIS_LT", valuePos: valueFull, valueNeg: 0 },
      ]
      if (input.number === 6) return [
        { type: "BUTTON_DL", valuePos, valueNeg },
      ]
      if (input.number === 7) return [
        { type: "BUTTON_DU", valuePos, valueNeg },
      ]
    }
    return []
  },
}