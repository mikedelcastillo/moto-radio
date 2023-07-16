import { JoystickEventMap, LinuxJoystick } from "."
import { EventBus } from "../../bus"

type JoystickManagerEventMap = JoystickEventMap & {
  connect: undefined,
  disconnect: undefined,
}

const RETRY_WAIT_S = 1

export class JoystickManager extends EventBus<JoystickManagerEventMap>{
  id: number
  js: LinuxJoystick | undefined
  ready = false

  constructor(id: number) {
    super()
    this.id = id
    this.initialize()
  }

  log(message: string) {
    if (typeof process.env.DEBUG_JOYSTICK_MANAGER === "string")
      console.log(`[JSM-${this.id}]: ${message}`)
  }

  private async initialize() {
    try {
      this.log(`Initializing...`)
      this.js = new LinuxJoystick(this.id)
      this.js.on("error", (err) => {
        this.log(`Runtime error: ${err.message}`)
        this.retry()
        this.trigger("error", err)
      })
      this.js.on("change", () => this.trigger("change"))
      this.js.on("input", (args) => this.trigger("input", args))
      this.js.on("rawInput", (args) => this.trigger("rawInput", args))
      await this.js.open()
      this.ready = true
      this.trigger("connect")
      this.log(`Connected to ${this.js.name}`)
    } catch (e: any) {
      this.log(`Init error: ${e?.message || "unknown error"}`)
      this.retry()
    }
  }

  private retry() {
    this.log(`Retrying in ${RETRY_WAIT_S}s...`)
    this.ready = false
    this.trigger("disconnect")
    this.js?.close()
    this.js = undefined
    setTimeout(() => {
      this.log(`Retrying...`)
      this.initialize()
    }, RETRY_WAIT_S * 1000)
  }
}