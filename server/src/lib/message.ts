import { BYTES, ControllerInput, INT_MAX_VALUE, INT_START_BYTE, MAX_CONTROLLERS } from "../constants"
import { clamp } from "./utils"

export const numberToByte = (n: number) => {
  n = clamp(n, INT_MAX_VALUE)
  return String.fromCharCode(INT_START_BYTE + n)
}

export const createInputMessage = (controllerIndex: number, type: ControllerInput, value: number) => {
  controllerIndex = clamp(controllerIndex, MAX_CONTROLLERS - 1)
  return [
    BYTES.CONTROLLER_INPUT,
    numberToByte(controllerIndex),
    BYTES[type],
    numberToByte(value)
  ].join("")
}