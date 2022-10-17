import { Point } from "./state"

export const range = (n: number) => Array.from(Array(n).keys())
export const popRandomFromSet = <T>(set: Set<T>) => {
  const item = Array.from(set)[Math.floor(Math.random() * set.size)]
  set.delete(item)
  return item
}
export const midpointOfPoints = (points: Point[]) => {
  const point = points.reduce((acc, point) => {
    acc.x += point.x
    acc.y += point.y
    return acc
  }, new Point(0, 0))
  point.x /= points.length
  point.y /= points.length
  return point
}

export class ModN {
  modulo: number
  val: number
  constructor(val: number, modulo: number) {
    this.modulo = modulo
    this.val = val
    if (this.val < 0) {
      this.val  = (this.modulo + this.val) % this.modulo
    }
    this.val = this.val % this.modulo
  }
  next() {
    return new ModN(this.val + 1, this.modulo)
  }
  prev() {
    return new ModN(this.val - 1, this.modulo)
  }
}