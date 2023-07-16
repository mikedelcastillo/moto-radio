import * as CONSTS from "../src/constants"
import fs from "fs"

const OUT_PATH = "../arduino/lib/constants.h"

const lines = [
  `/* THIS FILE WAS AUTOGENERATED ON ${(new Date()).toISOString()} */`,
  "", "// If you wish to make changes, edit /server/src/constants.ts",
  "// then run \"yarn sync-constants\" to update this file."
]

const run = async () => {
  const defineValues: Array<[string, string]> = [
    ["SERIAL_BAUDRATE", CONSTS.SERIAL_BAUDRATE.toString()],
    ["INT_MAX_VALUE", CONSTS.INT_MAX_VALUE.toString()],
    ["MAX_CONTROLLERS", CONSTS.MAX_CONTROLLERS.toString()],
    ["MAX_RADIO_ADDRESSES", CONSTS.MAX_RADIO_ADDRESSES.toString()],
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
    "int parseIntFromChar(uint8_t value){",
    `  if(value < ${CONSTS.INT_START_BYTE}) { return 0; }`,
    `  if(value > ${CONSTS.INT_START_BYTE + CONSTS.INT_MAX_VALUE}) { return ${CONSTS.INT_MAX_VALUE}; }`,
    `  return value - ${CONSTS.INT_START_BYTE};`,
    "}",
  ])

  // Float parser
  lines.push("")
  lines.push(...[
    "float parseFloatFromChar(uint8_t value){",
    `  return ((float) parseIntFromChar(value)) / ((float) ${CONSTS.INT_MAX_VALUE});`,
    "}",
  ])

  // Int to float
  lines.push("")
  lines.push(...[
    "float intToFloat(uint8_t value){",
    `  return ((float) value) / ((float) ${CONSTS.INT_MAX_VALUE});`,
    "}",
  ])

  // Controller enum
  lines.push("")
  lines.push(`enum ${CONSTS.CONTROLLER_INPUT_ENUM_VAR} {\n${CONSTS.CONTROLLER_INPUT_ENUM.map(type => `  ${CONSTS.CONTROLLER_INPUT_ENUM_PREFIX}${type}`).join(",\n")},\n};`)

  // Controller type helper
  lines.push("")
  lines.push(...[
    `${CONSTS.CONTROLLER_INPUT_ENUM_VAR} get${CONSTS.CONTROLLER_INPUT_ENUM_VAR}(uint8_t value){`,
    ...CONSTS.CONTROLLER_INPUT_ENUM.map(type =>
      `  if(value == ${CONSTS.BYTES[type].charCodeAt(0)}) { return ${CONSTS.CONTROLLER_INPUT_ENUM_PREFIX}${type}; }`),
    "}",
  ])

  // Controller input struct
  lines.push("")
  lines.push(...[
    `typedef struct {`,
    ...CONSTS.CONTROLLER_INPUT_ENUM.map(type => `  uint8_t ${type};`),
    `} ControllerInput;`,
  ])

  // Controller struct reset
  lines.push("")
  lines.push(...[
    `void resetControllerInput(ControllerInput *cinput){`,
    ...CONSTS.CONTROLLER_INPUT_ENUM.map(type => `  cinput->${type} = 0;`),
    `}`,
  ])

  // Controller struct set via char
  lines.push("")
  lines.push(...[
    `void setControllerInputValue(ControllerInput *cinput, uint8_t input, uint8_t value){`,
    `  uint8_t intValue = parseIntFromChar(value);`,
    ...CONSTS.CONTROLLER_INPUT_ENUM.map(type =>
      `  if(input == ${CONSTS.BYTES[type].charCodeAt(0)}) { cinput->${type} = intValue; }`),
    `}`,
  ])

  // Radio addresses
  lines.push("")
  lines.push(`uint8_t RADIO_ADDRESSES[][${CONSTS.RADIO_ADDRESSES.length}] = {\n${CONSTS.RADIO_ADDRESSES.map(word => "  " + JSON.stringify(word)).join(",\n")},\n};`)

  const output = lines.join("\n")
  await fs.promises.writeFile(OUT_PATH, output)
}

run()