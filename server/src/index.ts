import { SerialPort } from "serialport";
import { MAX_CONTROLLERS, POLL_INTERVAL, SERIAL_BAUDRATE } from "./constants";
import { JoystickManager } from "./lib/joystick/manager";
import { createInputMessage } from "./lib/message";

const board = new SerialPort({
  path: "/dev/ttyUSB0",
  baudRate: SERIAL_BAUDRATE,
  autoOpen: false,
})

const joystickManagers: JoystickManager[] = []

for (let i = 0; i < MAX_CONTROLLERS; i++) {
  const jm = new JoystickManager(i)
  joystickManagers.push(jm)
}

function updateLoop() {
  const messages: Buffer[] = []
  for (let i = 0; i < joystickManagers.length; i++) {
    const jm = joystickManagers[i]
    if (typeof jm.js !== "undefined" && jm.ready) {
      messages.push(createInputMessage(i, jm.js))
      jm.js.clearTrackedChanges()
    }
  }

  for (const buffer of messages) {
    if (typeof process.env.DEBUG_SERIAL_WRITE === "string")
      console.log(`[SERIAL]: Writing`, buffer)
    board.write(buffer)
  }
}

board.open((error) => {
  if (error) {
    console.log("Could not connect to board")
    process.exit(1)
  }

  console.log("Connected to board!")

  board.on("data", (data) => console.log(`[SERIAL]: ${data}`))
  board.on("close", () => {
    console.log("Board closed")
    process.exit(1)
  })
  board.on("error", () => {
    console.log("Board errored")
    process.exit(1)
  })

  setInterval(() => {
    updateLoop()
  }, POLL_INTERVAL)
})
