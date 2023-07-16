
// import { SerialPort, ReadlineParser } from "serialport"
// import { SERIAL_BAUDRATE } from "./constants"

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

import { LinuxJoystick } from "./lib/joystick";

const run = async () => {
  const js0 = new LinuxJoystick(0)
  js0.on("input", console.log)
  js0.init()
}

run()
