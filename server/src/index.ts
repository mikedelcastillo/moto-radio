
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
  js0.on("error", (err) => {
    console.warn(err)
    process.exit()
  })
  // js0.on("input", (input) => {
  //   console.log(JSON.stringify(js0.values))
  // })
  js0.on("change", () => {
    console.log(js0.changedInputs)
  })
  setInterval(() => {
    js0.clearTrackedChanges()
  }, 1000)
  await js0.open()
}

run()
