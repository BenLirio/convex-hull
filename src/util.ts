import { Point } from "./Point"

export const range = (n: number) => Array.from(Array(n).keys())
export const popRandomFromSet = <T>(set: Set<T>) => {
  const item = Array.from(set)[Math.floor(Math.random() * set.size)]
  set.delete(item)
  return item
}
export const midpointOfPoints = (points: Point[]) => {
  const p = points[0].p
  const point = points.reduce((acc, point) => {
    acc.x += point.x
    acc.y += point.y
    return acc
  }, new Point(p, 0, 0))
  point.x /= points.length
  point.y /= points.length
  return point
}

export class ModN {
  modulo: number
  val: number
  constructor(val: number, modulo: number) {
    this.modulo = modulo
    this.val = val % this.modulo
    if (this.val < 0) {
      this.val += this.modulo
    }
  }
  next() {
    return new ModN(this.val + 1, this.modulo)
  }
  prev() {
    return new ModN(this.val - 1, this.modulo)
  }
  decModulo() {
    if (this.modulo === 0) {
      throw new Error('Cannot decrement modulo 0')
    }
    return new ModN(this.val, this.modulo - 1)
  }
}
export class Angle {
  val: number
  private modulo: number
  private epsilon: number = 0.0000001
  constructor(val: number) {
    this.modulo = 2 * Math.PI
    this.val = val % this.modulo
    if (this.val < 0) {
      this.val += this.modulo
    }
    if (Math.min(this.val, this.modulo - this.val) < this.epsilon) {
      this.val = 0
    }
  }
  dist(angle: Angle) {
    const dist = Math.abs(this.val - angle.val)
    return new Angle(Math.min(dist, this.modulo - dist))
  }
  sub(angle: Angle) {
    return new Angle(this.val - angle.val)
  }
  between(a: Angle, c: Angle) {
    const b = this
    const ab = a.dist(b)
    const ac = a.dist(c)
    const bc = b.dist(c)
    if (ac.val > ab.val && ac.val > bc.val) {
      return true
    }
    return false
  }
}