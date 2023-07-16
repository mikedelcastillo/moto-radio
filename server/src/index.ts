
// import { SerialPort, ReadlineParser } from "serialport"
// import { SERIAL_BAUDRATE } from "./constants"

import { MAX_CONTROLLERS } from "./constants";
import { JoystickManager } from "./lib/joystick/manager";

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
  joystickManagers.push(new JoystickManager(i))
}

function updateLoop() {
  for (const jm of joystickManagers) {
    jm.js?.clearTrackedChanges()
    const changes = jm.js?.trackedChanges || []
    if (changes.length) {
      console.log(changes)
    }
  }
}

setTimeout(() => {
  updateLoop()
}, 1000 / 20)