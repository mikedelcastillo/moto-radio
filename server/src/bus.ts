export type EventMap = Record<string, any>;
export type EventListener<T extends EventMap, K extends keyof T = keyof T> = {
  type: K;
  callback: (payload: T[K]) => any;
};

export class EventBus<T extends EventMap> {
  listeners: EventListener<T, any>[] = [];

  on<K extends keyof T>(type: K, callback: EventListener<T, K>["callback"]) {
    this.listeners.push({ type, callback });
  }

  off<K extends keyof T>(type: K, callback: EventListener<T, K>["callback"]) {
    this.listeners = this.listeners.filter(
      (listener) => listener.type !== type && listener.callback !== callback,
    );
  }

  trigger<K extends keyof T, V extends T[K]>(
    type: K,
    ...payload: V extends undefined ? [V?] : [V]
  ) {
    for (const listener of this.listeners) {
      if (listener.type === type) listener.callback(payload[0] as any);
    }
  }
}