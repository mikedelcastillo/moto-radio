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
  const messages: string[] = []
  for (let i = 0; i < joystickManagers.length; i++) {
    const jm = joystickManagers[i]
    if (typeof jm.js !== "undefined" && jm.ready) {
      messages.push(createInputMessage(i, jm.js))
      jm.js.clearTrackedChanges()
    }
  }

  if (messages.length > 0) {
    const message = messages.join("")
    const debug = message.split("").map(c => "0" + c.charCodeAt(0).toString(16))
      .map(s => s.substring(s.length - 2, s.length)).join(" ")
    console.log(`[SERIAL]: Writing ${debug}`)
    board.write(message)
  }
}

board.open((error) => {
  if (error) {
    console.log("Could not connect to board")
    process.exit()
  }

  console.log("Connected to board!")

  board.on("data", (data) => console.log(`[SERIAL]: ${data}`))

  setInterval(() => {
    updateLoop()
  }, POLL_INTERVAL)
})
