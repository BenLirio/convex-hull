import { Point } from "./Point"

export class Line {
  u: Point
  v: Point
  color?: string
  p: any
  constructor(p: any, u: Point, v: Point, color?: string) {
    this.p = p
    this.u = u
    this.v = v
    this.color = color
  }
  intersects(line: Line) {
    const ccw = (a: Point, b: Point, c: Point) => {
      return (c.y - a.y) * (b.x - a.x) > (b.y - a.y) * (c.x - a.x)
    }
    return ccw(this.u, line.u, line.v) !== ccw(this.v, line.u, line.v) &&
      ccw(this.u, this.v, line.u) !== ccw(this.u, this.v, line.v)
  }
  slope() {
    return (this.v.y - this.u.y) / (this.v.x - this.u.x)
  }
  draw() {
    this.p.push()
    this.p.strokeWeight(5)
    this.p.stroke('white')
    if (this.color) {
      this.p.fill(this.color)
      this.p.stroke(this.color)
    }
    this.p.line(this.u.x, this.u.y, this.v.x, this.v.y)
    this.p.pop()
  }
}