export const clamp = (value: number, max: number, min = 0) =>
  Math.max(min, Math.min(max, value))