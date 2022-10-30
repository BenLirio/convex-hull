import { Angle } from "./util"

export class Point {
  x: number
  y: number
  color: string
  p: any
  constructor(p: any, x: number, y: number, color?: string) {
    this.p = p
    this.x = x
    this.y = y
    this.color = color || this.p.color(0,0,0,0)
  }
  angleTo(point: Point) {
    return new Angle(Math.atan2(point.y - this.y, point.x - this.x))
  }
  draw() {
    this.p.push()
    this.p.fill(this.color)
    this.p.strokeWeight(1)
    this.p.stroke('white')
    this.p.circle(this.x, this.y, 10)
    this.p.pop()
  }
}