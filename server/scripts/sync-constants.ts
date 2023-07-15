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
        ["MAX_CONTROLLERS", CONSTS.MAX_CONTROLLERS.toString()],
    ]

    for(const key in CONSTS.BYTES){
        defineValues.push([`${key}_BYTE`, CONSTS.BYTES[key].charCodeAt(0).toString()])
    }

    // #define values
    lines.push("")
    for(const [varName, value] of defineValues){
        lines.push(`#define ${varName} ${value}`)
    }

    // Controller enum
    lines.push("")
    lines.push(`enum ${CONSTS.CONTROLLER_INPUT_ENUM_VAR} {\n${CONSTS.CONTROLLER_INPUT_ENUM.map(type => `  ${CONSTS.CONTROLLER_INPUT_ENUM_PREFIX}${type}`).join(",\n")},\n};`)

    // Controller type helper
    lines.push("")
    lines.push(...[
        `${CONSTS.CONTROLLER_INPUT_ENUM_VAR} get${CONSTS.CONTROLLER_INPUT_ENUM_VAR}(char value){`,
        ...CONSTS.CONTROLLER_INPUT_ENUM.map(type => 
            `  if(value == ${CONSTS.BYTES[type as CONSTS.ByteKeys].charCodeAt(0)}) { return ${CONSTS.CONTROLLER_INPUT_ENUM_PREFIX}${type}; }`),
        "}",
    ])

    // Int parser
    lines.push("")
    lines.push(...[
        "int parseIntFromChar(char value){",
        `  if(value < ${CONSTS.INT_START_BYTE}) { return 0; }`,
        `  if(value > ${CONSTS.INT_START_BYTE + CONSTS.INT_MAX_VALUE}) { return ${CONSTS.INT_MAX_VALUE}; }`,
        `  return value - ${CONSTS.INT_START_BYTE};`,
        "}",
    ])

    // Float parser
    lines.push("")
    lines.push(...[
        "float parseFloatFromInt(char value){",
        `  return ((float) parseIntFromChar(value)) / ((float) ${CONSTS.INT_START_BYTE});`,
        "}",
    ])

    // Radio addresses
    lines.push("")
    lines.push(`byte RADIO_ADDRESSES[][${CONSTS.RADIO_ADDRESSES.length}] = {\n${CONSTS.RADIO_ADDRESSES.map(word => "  " + JSON.stringify(word)).join(",\n")},\n};`)

    const output = lines.join("\n")
    await fs.promises.writeFile(OUT_PATH, output)
}

run()