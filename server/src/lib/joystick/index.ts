import { exec } from "child_process";
import { close, open, read } from "fs";
import { EventBus } from "../../bus";
import { JoystickInput, JoystickMappedInput, JoystickMapping, JOYSTICK_MAPPINGS } from "./map";

type JoystickEventMap = {
  error: NodeJS.ErrnoException,
  rawInput: JoystickInput,
  input: JoystickMappedInput,
}

type JoystickValues = {
  buttons: Record<number, number>,
  axes: Record<number, number>
}

export class LinuxJoystick extends EventBus<JoystickEventMap>{
  map = JoystickMapping.MICROSOFT_XBOX_ONE
  private path = ""
  values: JoystickValues = {
    buttons: {},
    axes: {},
  }
  private buffer: Buffer = Buffer.alloc(8)
  private fd?: number

  constructor(id: number) {
    super()
    this.path = `/dev/input/js${id}`
  }

  resetValues() {
    this.values = {
      buttons: {},
      axes: {},
    }
  }

  async open() {
    await this.setMapping()
    await this.startReading()
  }

  setMapping() {
    return new Promise<void>((resolve, reject) => {
      exec(`udevadm info -a ${this.path} | grep ATTRS{name}`, (err, stdout) => {
        if (err) return reject()
        if (stdout.match(/xbox/i))
          this.map = JoystickMapping.MICROSOFT_XBOX_ONE
        if (stdout.match(/8bitdo ultimate/i))
          this.map = JoystickMapping._8BITDO_ULTIMATE
        resolve()
      })
    })
  }

  startReading() {
    return new Promise<void>(async (resolve, reject) => {
      open(this.path, "r", (err, fd) => {
        if (err) {
          this.trigger("error", err)
          return reject()
        }
        this.fd = fd
        this.read()
        resolve()
      })
    })
  }

  private read() {
    if (typeof this.fd === "undefined") return
    read(this.fd, this.buffer, 0, 8, null, this.parse.bind(this))
  }

  private parse(err: NodeJS.ErrnoException | null, bytesRead: number) {
    if (err) return this.trigger("error", err)
    const payload: JoystickInput = {
      type: this.buffer[6] & 0x01 ? "button" : "axis", // 0x02 axis
      time: this.buffer.readUint32LE(0),
      number: this.buffer[7],
      value: this.buffer.readInt16LE(4),
      init: !!(this.buffer[6] & 0x80)
    }
    this.values[payload.type === "button" ? "buttons" : "axes"][payload.number] = payload.value
    this.trigger("rawInput", payload)
    const mappedInputs = JOYSTICK_MAPPINGS[this.map](payload)
    for (const mappedInput of mappedInputs) {
      this.trigger("input", mappedInput)
    }
    if (this.fd) this.read()
  }

  close() {
    return new Promise<void>((resolve, reject) => {
      if (typeof this.fd === "undefined") return reject()
      close(this.fd, () => {
        this.fd = undefined
        this.resetValues()
        resolve()
      })
    })
  }
}