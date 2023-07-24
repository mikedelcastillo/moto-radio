import * as CONSTS from "../src/constants"
import fs from "fs"

const OUT_PATH = "../arduino/lib/constants.h"

const lines = [
  `/* THIS FILE WAS AUTOGENERATED ON ${(new Date()).toISOString()} */`,
  "", "// If you wish to make changes, edit /server/src/constants.ts",
  "// then run \"yarn sync-constants\" to update this file.",
  "",
  "#ifndef MR_CONSTS",
  "#define MR_CONSTS",
]

const run = async () => {
  const defineValues: Array<[string, string]> = [
    ["SERIAL_BAUDRATE", CONSTS.SERIAL_BAUDRATE.toString()],
    ["SERIAL_BUFFER_LENGTH", (CONSTS.RADIO_MESSAGE_BUFFER_LENGTH + 2).toString()],
    ["MAX_INT_RADIO_VALUE", CONSTS.MAX_INT_RADIO_VALUE.toString()],
    ["MAX_CONTROLLERS", CONSTS.MAX_CONTROLLERS.toString()],
    ["MAX_RADIO_ADDRESSES", CONSTS.MAX_RADIO_ADDRESSES.toString()],
    ["RADIO_MESSAGE_BUFFER_LENGTH", CONSTS.RADIO_MESSAGE_BUFFER_LENGTH.toString()],
    ["POLL_INTERVAL", CONSTS.POLL_INTERVAL.toString()],
    ["TIMEOUT_INTERVAL", CONSTS.TIMEOUT_INTERVAL.toString()],
  ]

  for (const key in CONSTS.BYTES) {
    defineValues.push([`${key}_BYTE`, CONSTS.BYTES[key as CONSTS.ByteKeys].charCodeAt(0).toString()])
  }

  // #define values
  lines.push("")
  for (const [varName, value] of defineValues) {
    lines.push(`#define ${varName} ${value}`)
  }

  // Int parser
  lines.push("")
  lines.push(...[
    "int16_t parseIntFromChar(uint8_t value){",
    `  if(value < ${CONSTS.INT_START_BYTE}) { return (int16_t) 0; }`,
    `  if(value > ${CONSTS.INT_START_BYTE + CONSTS.MAX_INT_RADIO_VALUE}) { return (int16_t) ${CONSTS.MAX_INT_RADIO_VALUE}; }`,
    `  return (int16_t) value - (int16_t) ${CONSTS.INT_START_BYTE};`,
    "}",
  ])

  // Float parser
  lines.push("")
  lines.push(...[
    "float parseFloatFromChar(uint8_t value){",
    `  return ((float) parseIntFromChar(value)) / ((float) ${CONSTS.MAX_INT_RADIO_VALUE});`,
    "}",
  ])

  // Int to float
  lines.push("")
  lines.push(...[
    "float intToFloat(uint8_t value){",
    `  return ((float) value) / ((float) ${CONSTS.MAX_INT_RADIO_VALUE});`,
    "}",
  ])

  // Controller input struct
  lines.push("")
  lines.push(...[
    `typedef __attribute__((packed, aligned(1))) struct {`,
    ...CONSTS.RADIO_MESSAGE_BUFFER.map(([type, len]) => `  ${len === 1 ? "uint8_t" : "int16_t"} ${type};`),
    `} ControllerInput;`,
  ])

  // Controller struct reset
  lines.push("")
  lines.push(...[
    `void resetControllerInput(ControllerInput *cinput){`,
    ...CONSTS.RADIO_MESSAGE_BUFFER.map(([type]) =>
      `  cinput->${type} = 0;`),
    `}`,
  ])

  // Controller from buffer
  lines.push("")
  lines.push(`void controllerInputFromBuffer(uint8_t buffer[SERIAL_BUFFER_LENGTH], ControllerInput *cinput){`)
  let serialBufferIndex = 2 // 0 = command byte, 1 = controller index
  for (const [type, len] of CONSTS.RADIO_MESSAGE_BUFFER) {
    if (len === 1)
      lines.push(`  cinput->${type} = parseIntFromChar(buffer[${serialBufferIndex}]);`)
    else
      lines.push(`  cinput->${type} = parseIntFromChar(buffer[${serialBufferIndex}]) - parseIntFromChar(buffer[${serialBufferIndex + 1}]);`)
    serialBufferIndex += len
  }
  lines.push("}")

  // Radio addresses
  lines.push("")
  lines.push(`uint8_t RADIO_ADDRESSES[][${CONSTS.RADIO_ADDRESSES.length}] = {\n${CONSTS.RADIO_ADDRESSES.map(word => "  " + JSON.stringify(word)).join(",\n")},\n};`)

  lines.push("", "#endif")

  const output = lines.join("\n")
  await fs.promises.writeFile(OUT_PATH, output)

}

run()