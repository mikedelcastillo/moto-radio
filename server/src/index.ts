
import { SerialPort, ReadlineParser } from "serialport"
import { SERIAL_BAUDRATE } from "./constants"

const board = new SerialPort({
  path: "/dev/ttyUSB0",
  baudRate: SERIAL_BAUDRATE,
  autoOpen: false,
})

board.open((error) => {
  if (error) {
    console.log("Could not connect to board")
    process.exit()
  }

  console.log("Connected to board!")
})