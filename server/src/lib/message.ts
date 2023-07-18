import { BYTES, ControllerInput, MAX_INT_RADIO_VALUE, INT_START_BYTE, MAX_CONTROLLERS } from "../constants"
import { clamp } from "./utils"

export const numberToByte = (n: number) => {
  n = clamp(n, MAX_INT_RADIO_VALUE)
  return String.fromCharCode(INT_START_BYTE + n)
}

export const createInputMessage = (controllerIndex: number, type: ControllerInput, valuePos: number, valueNeg: number) => {
  controllerIndex = clamp(controllerIndex, MAX_CONTROLLERS - 1)
  return [
    BYTES.CONTROLLER_INPUT,
    numberToByte(controllerIndex),
    BYTES[type],
    numberToByte(valuePos),
    numberToByte(valueNeg),
  ].join("")
}