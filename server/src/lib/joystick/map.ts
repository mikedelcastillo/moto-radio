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
        value: input.value === 0 ? 0 : MAX_INT_RADIO_VALUE,
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
      const valueAxis = valuePos - valueNeg
      const valueAxisAbs = Math.abs(valueAxis)
      if (input.number === 0) return [
        { type: "AXIS_LSX", value: valueAxis },
      ]
      if (input.number === 1) return [
        { type: "AXIS_LSY", value: valueAxis },
      ]
      if (input.number === 2) return [
        { type: "AXIS_LT", value: valueFull },
      ]
      if (input.number === 3) return [
        { type: "AXIS_RSX", value: valueAxis },
      ]
      if (input.number === 4) return [
        { type: "AXIS_RSY", value: valueAxis },
      ]
      if (input.number === 5) return [
        { type: "AXIS_RT", value: valueFull },
      ]
      if (input.number === 6)
        return value > 0 ? [
          { type: "BUTTON_DL", value: 0 },
          { type: "BUTTON_DR", value: valueAxisAbs },
        ] : [
          { type: "BUTTON_DL", value: valueAxisAbs },
          { type: "BUTTON_DR", value: 0 },
        ]
      if (input.number === 7)
        return value > 0 ? [
          { type: "BUTTON_DU", value: 0 },
          { type: "BUTTON_DD", value: valueAxisAbs },
        ] : [
          { type: "BUTTON_DU", value: valueAxisAbs },
          { type: "BUTTON_DD", value: 0 },
        ]
    }
    return []
  },
  [JoystickMapping._8BITDO_ULTIMATE]: (input) => {
    if (input.type === "button") {
      const output: JoystickMappedInput = {
        type: "IGNORE",
        value: input.value === 0 ? 0 : MAX_INT_RADIO_VALUE,
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
      const valueAxis = valuePos - valueNeg
      const valueAxisAbs = Math.abs(valueAxis)
      if (input.number === 0) return [
        { type: "AXIS_LSX", value: valueAxis },
      ]
      if (input.number === 1) return [
        { type: "AXIS_LSY", value: valueAxis },
      ]
      if (input.number === 2) return [
        { type: "AXIS_RSX", value: valueAxis },
      ]
      if (input.number === 3) return [
        { type: "AXIS_RSY", value: valueAxis },
      ]
      if (input.number === 4) return [
        { type: "AXIS_RT", value: valueFull },
      ]
      if (input.number === 5) return [
        { type: "AXIS_LT", value: valueFull },
      ]
      if (input.number === 6)
        return value > 0 ? [
          { type: "BUTTON_DL", value: 0 },
          { type: "BUTTON_DR", value: valueAxisAbs },
        ] : [
          { type: "BUTTON_DL", value: valueAxisAbs },
          { type: "BUTTON_DR", value: 0 },
        ]
      if (input.number === 7)
        return value > 0 ? [
          { type: "BUTTON_DU", value: 0 },
          { type: "BUTTON_DD", value: valueAxisAbs },
        ] : [
          { type: "BUTTON_DU", value: valueAxisAbs },
          { type: "BUTTON_DD", value: 0 },
        ]
    }
    return []
  },
}