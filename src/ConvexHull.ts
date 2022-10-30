import { Line } from "./Line"
import { Point } from "./Point"
import { midpointOfPoints, ModN } from "./util"
const debug = false

export class ConvexHull {
  points: Point[]
  deadPoints: Point[] = []
  origin: Point
  debugLines: Line[]
  p: any
  constructor(p: any, points: Point[]) {
    points.forEach(point => point.color = 'blue')
    this.p = p
    this.points = points
    this.origin = midpointOfPoints(this.points)
    this.origin.color = 'blue'
    this.points.sort((a, b) => {
      const angleA = this.origin.angleTo(a)
      const angleB = this.origin.angleTo(b)
      if (angleA.val === angleB.val) { return 0 }
      if (angleA.val < angleB.val) { return -1 }
      return 1
    })
    this.debugLines = []
  }

  draw() {
    if (this.points.length < 2) {
      throw new Error("Convex hull must have at least 2 points")
    }

    this.p.push()
    this.p.fill(this.p.color(255,255,255,100))
    this.p.beginShape()
    this.p.strokeWeight(2)
    this.p.stroke('white')
    this.points.forEach(point => {
      this.p.vertex(point.x, point.y)
    })
    this.p.endShape(this.p.CLOSE)
    this.p.pop()

    if (debug) {
      this.points.forEach((point, i) => {
        this.p.push()
        this.p.text(i, point.x, point.y)
        this.p.pop()
      })
      this.debugLines.forEach(line => line.draw())
      const angle = this.origin.angleTo(new Point(this.p, this.p.mouseX, this.p.mouseY))
      this.p.text(angle.val, this.p.mouseX, this.p.mouseY)
      if (this.origin !== undefined) {
        this.origin.draw()
        this.points.forEach(point => {
          this.p.line(this.origin.x, this.origin.y, point.x, point.y)
        })
      }
    }
    this.deadPoints.forEach(point => point.draw())
    this.points.forEach(point => point.draw())
  }

  addDeadPoint(point: Point) {
    point.color = 'darkred'
    this.deadPoints.push(point)
  }

  addPoint(point: Point) {
    point.color = 'blue'
    const angle = this.origin.angleTo(point)
    const angles = this.points.map(p => this.origin.angleTo(p))
    let idx = angles.findIndex(a => a.val > angle.val)
    const line1 = new Line(this.p, point, this.origin)
    if (idx === -1) {
      const line2 = new Line(this.p, this.points[this.points.length - 1], this.points[0])
      if (!line1.intersects(line2)) {
        this.addDeadPoint(point)
        return
      }
      this.points.push(point)
    } else {
      const line2 = new Line(this.p, this.points[(idx+this.points.length - 1)%this.points.length], this.points[idx])
      if (!line1.intersects(line2)) {
        this.addDeadPoint(point)
        return
      }
      this.points.splice(idx, 0, point)
    }
    let newIdx = new ModN(idx, this.points.length)
    while (true) {
      const before = newIdx.prev()
      const a = point.angleTo(this.points[before.val])
      const b = point.angleTo(this.points[before.prev().val])
      const c = point.angleTo(this.origin)
      if (a.between(b,c)) {
        this.addDeadPoint(this.points[before.val])
        this.points.splice(before.val, 1)
        if (before.val < newIdx.val) {
          newIdx = newIdx.prev()
        }
        newIdx = newIdx.decModulo()
      } else {
        break
      }
    }
    while (true) {
      const after = newIdx.next()
      const a = point.angleTo(this.points[after.val])
      const b = point.angleTo(this.points[after.next().val])
      const c = point.angleTo(this.origin)
      if (a.between(b,c)) {
        this.addDeadPoint(this.points[after.val])
        this.points.splice(after.val, 1)
        if (after.val < newIdx.val) {
          newIdx = newIdx.prev()
        }
        newIdx = newIdx.decModulo()
      } else {
        break
      }
    }
  }
}