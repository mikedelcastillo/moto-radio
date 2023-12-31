import { BYTES, MAX_INT_RADIO_VALUE, INT_START_BYTE, MAX_CONTROLLERS, RADIO_MESSAGE_BUFFER } from "../constants"
import { LinuxJoystick } from "./joystick"
import { clamp } from "./utils"

export const numberToByte = (n: number) => {
  n = clamp(n, MAX_INT_RADIO_VALUE)
  return String.fromCharCode(INT_START_BYTE + n)
}

export const createInputMessage = (controllerIndex: number, js: LinuxJoystick) => {
  controllerIndex = clamp(controllerIndex, MAX_CONTROLLERS - 1)
  const output: number[] = [
    BYTES.CONTROLLER_INPUT.charCodeAt(0),
    numberToByte(controllerIndex).charCodeAt(0),
  ]
  for (const [type, len] of RADIO_MESSAGE_BUFFER) {
    output.push(numberToByte(Math.max(0, js.values[type])).charCodeAt(0))
    if (len === 2)
      output.push(numberToByte(Math.abs(Math.min(0, js.values[type]))).charCodeAt(0))
  }
  return Buffer.from(output)
}