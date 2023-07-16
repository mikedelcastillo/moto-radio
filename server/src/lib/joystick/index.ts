import { exec } from "child_process";
import { close, open, read } from "fs";
import { EventBus } from "../../bus";
import { ControllerInput, CONTROLLER_INPUT_ENUM } from "../../constants";
import { JoystickInput, JoystickMappedInput, JoystickMapping, JOYSTICK_MAPPINGS } from "./map";

export type JoystickEventMap = {
  error: NodeJS.ErrnoException,
  rawInput: JoystickInput,
  input: JoystickMappedInput,
  change: ControllerInput[],
}

type JoystickValues = {
  buttons: Record<number, number>,
  axes: Record<number, number>
}

export class LinuxJoystick extends EventBus<JoystickEventMap>{
  private path = ""
  private buffer: Buffer = Buffer.alloc(8)
  private fd?: number

  name = ""
  map = JoystickMapping.MICROSOFT_XBOX_ONE
  rawValues: JoystickValues = {
    buttons: {},
    axes: {},
  }
  values = {} as Record<ControllerInput, number>
  trackedChanges: ControllerInput[] = []

  constructor(id: number) {
    super()
    this.path = `/dev/input/js${id}`
    this.resetValues()
  }

  log(message: string) {
    if (typeof process.env.DEBUG_JOYSTICK === "string")
      console.log(`[JS@${this.path}]: ${message}`)
  }

  resetValues() {
    this.rawValues = {
      buttons: {},
      axes: {},
    }
    for (const key of CONTROLLER_INPUT_ENUM) {
      this.values[key] = 0
    }
    this.clearTrackedChanges()
  }

  clearTrackedChanges() {
    this.trackedChanges = []
  }

  async open() {
    await this.getDevice()
    await this.startReading()
    this.log("Ready")
  }

  getDevice() {
    return new Promise<void>((resolve, reject) => {
      exec(`udevadm info -a ${this.path} | grep ATTRS{name}`, (err, stdout) => {
        if (err) return reject(err)
        const deviceName = (/"(.*?)"/).exec(stdout)?.[1] || ""
        this.name = deviceName
        if (deviceName.match(/xbox/i))
          this.map = JoystickMapping.MICROSOFT_XBOX_ONE
        if (deviceName.match(/8bitdo ultimate/i))
          this.map = JoystickMapping._8BITDO_ULTIMATE
        if (deviceName) this.log(`Device name: ${deviceName}`)
        resolve()
      })
    })
  }

  startReading() {
    return new Promise<void>(async (resolve, reject) => {
      open(this.path, "r", (err, fd) => {
        if (err) {
          this.trigger("error", err)
          return reject(err)
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
    this.rawValues[payload.type === "button" ? "buttons" : "axes"][payload.number] = payload.value
    this.trigger("rawInput", payload)
    this.log(`Raw: ${payload.time} ${payload.type} ${payload.number} ${payload.value}`)
    const mappedInputs = JOYSTICK_MAPPINGS[this.map](payload)
    for (const mappedInput of mappedInputs) {
      if (this.values[mappedInput.type] !== mappedInput.value) {
        this.values[mappedInput.type] = mappedInput.value
        if (!this.trackedChanges.includes(mappedInput.type)) {
          this.trackedChanges.push(mappedInput.type)
          this.trigger("change", this.trackedChanges)
        }
      }
      this.trigger("input", mappedInput)
      this.log(`Mapped: ${mappedInput.type} ${mappedInput.value}`)
    }
    if (this.fd) this.read()
  }

  close() {
    return new Promise<void>((resolve) => {
      if (typeof this.fd === "undefined") return
      close(this.fd, () => {
        this.fd = undefined
        this.resetValues()
        resolve()
      })
    })
  }
}