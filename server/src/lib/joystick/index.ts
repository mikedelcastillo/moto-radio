import { close, open, read } from "fs";
import { EventBus } from "../../bus";

type JoystickEventMap = {
  error: NodeJS.ErrnoException,
  input: {
    type: "axis" | "button",
    time: number,
    number: number,
    value: number,
    init: boolean,
  },
}

type JoystickValues = {
  buttons: Record<number, number>,
  axes: Record<number, number>
}

export class LinuxJoystick extends EventBus<JoystickEventMap>{
  values: JoystickValues = {
    buttons: {},
    axes: {},
  }
  id: number
  private buffer: Buffer = Buffer.alloc(8)
  private fd?: number

  constructor(id: number) {
    super()
    this.id = id
  }

  resetValues() {
    this.values = {
      buttons: {},
      axes: {},
    }
  }

  open() {
    return new Promise<void>((resolve, reject) => {
      open(`/dev/input/js${this.id}`, "r", (err, fd) => {
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
    const payload: JoystickEventMap["input"] = {
      type: this.buffer[6] & 0x01 ? "button" : "axis", // 0x02 axis
      time: this.buffer.readUint32LE(0),
      number: this.buffer[7],
      value: this.buffer.readInt16LE(4),
      init: !!(this.buffer[6] & 0x80)
    }
    this.values[payload.type === "button" ? "buttons" : "axes"][payload.number] = payload.value
    this.trigger("input", payload)
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