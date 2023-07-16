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

export class LinuxJoystick extends EventBus<JoystickEventMap>{
  id: number
  private buffer: Buffer = Buffer.alloc(8)
  private fd?: number

  constructor(id: number) {
    super()
    this.id = id
  }

  async init() {
    return new Promise<void>((resolve) => {
      open(`/dev/input/js${this.id}`, "r", () => {
        this.open.bind(this)
        resolve()
      })
    })
  }

  private open(err: NodeJS.ErrnoException | null, fd: number) {
    if (err) {
      this.trigger("error", err)
      throw err
    }
    this.fd = fd
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
      value: this.buffer.readInt16LE(),
      init: !!(this.buffer[6] & 0x80)
    }
    this.trigger("input", payload)
    if (this.fd) this.read()
  }

  async close() {
    return new Promise<void>((resolve, reject) => {
      if (typeof this.fd === "undefined") return reject()
      close(this.fd, () => {
        this.fd = undefined
        resolve()
      })
    })
  }
}