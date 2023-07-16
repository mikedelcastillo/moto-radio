
// import { SerialPort, ReadlineParser } from "serialport"
// import { SERIAL_BAUDRATE } from "./constants"

import { MAX_CONTROLLERS } from "./constants";
import { JoystickManager } from "./lib/joystick/manager";
import { createInputMessage } from "./lib/message";

// const board = new SerialPort({
//   path: "/dev/ttyUSB0",
//   baudRate: SERIAL_BAUDRATE,
//   autoOpen: false,
// })

// board.open((error) => {
//   if (error) {
//     console.log("Could not connect to board")
//     process.exit()
//   }

//   console.log("Connected to board!")
// })

const joystickManagers: JoystickManager[] = []

for (let i = 0; i < MAX_CONTROLLERS; i++) {
  const jm = new JoystickManager(i)
  joystickManagers.push(jm)
}

function updateLoop() {
  const messages: string[] = []
  for (let i = 0; i < joystickManagers.length; i++) {
    const jm = joystickManagers[i]
    if (typeof jm.js === "undefined") continue

    const changes = jm.js.trackedChanges
    if (changes.length > 0) {
      for (const change of changes) {
        messages.push(createInputMessage(i, change, jm.js?.values[change] || 0))
      }
    }

    jm.js.clearTrackedChanges()
  }
  if (messages.length > 0) {
    console.log(messages)
  }
}

setInterval(() => {
  updateLoop()
}, 1000 / 20)