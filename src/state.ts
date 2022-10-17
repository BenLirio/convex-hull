import { midpointOfPoints, ModN, popRandomFromSet, range } from "./util"

export default class State {
  width: number
  height: number
  background: number
  points: Set<Point>
  convexHull: ConvexHull
  button: any
  constructor() {
    this.width = 400
    this.height = 400
    this.background = 200
    this.points = new Set(range(3).map(() => new Point(
      Math.random() * this.width,
      Math.random() * this.height,
    )))
    // Remove a random point from the set
    const hullPoints = range(3)
      .map(() => popRandomFromSet(this.points))
    this.convexHull = new ConvexHull(hullPoints.map(point => {
      point.color = 'red'
      return point
    }))
  }

  handleNextPoint() {
    const point =  popRandomFromSet(this.points)
    point.color = 'red'
    this.convexHull.addPoint(point)
    if (this.points.size === 0) {
      this.button.hide()
    }
  }

  setup(p: any) {
    p.createCanvas(this.width, this.height)
    this.button = p.createButton('Next Point')
    this.button.mousePressed(() => this.handleNextPoint())
  }

  mouseClicked(p: any) {
    if (p.mouseX > 0 && p.mouseX < this.width && p.mouseY > 0 && p.mouseY < this.height) {
      const point = new Point(p.mouseX, p.mouseY, 'red')
      this.convexHull.addPoint(point)
    }
  }

  update(p: any) {
  }

  draw(p: any) {
    p.background(this.background)
    this.points.forEach(point => point.draw(p))
    this.convexHull.draw(p)
  }
}

class ConvexHull {
  points: Point[]
  origin: Point
  constructor(points: Point[]) {
    this.points = points
    this.origin = midpointOfPoints(this.points)
    this.origin.color = 'blue'
    this.points.sort((a, b) =>
      this.origin.angleTo(a) - this.origin.angleTo(b)
    )
  }

  draw(p: any) {
    if (this.points.length < 2) {
      throw new Error("Convex hull must have at least 2 points")
    }
    this.points[0].draw(p)
    for (let i = 1; i < this.points.length; i++) {
      p.line(this.points[i - 1].x, this.points[i - 1].y, this.points[i].x, this.points[i].y)
      this.points[i].draw(p)
    }
    p.line(this.points[0].x, this.points[0].y, this.points[this.points.length - 1].x, this.points[this.points.length - 1].y)
    if (this.origin !== undefined) {
      this.origin.draw(p)
      this.points.forEach(point => {
        p.line(this.origin.x, this.origin.y, point.x, point.y)
      })
    }
  }
  addPoint(point: Point) {
    const angles = this.points.map(p => this.origin.angleTo(p))
    const angle = this.origin.angleTo(point)
    let cur = new ModN(0, angles.length)
    while (true) {
      if (angle < angles[cur.val]) {
        this.points.splice(cur.val, 0, point)
        cur.modulo += 1
        break
      }
      cur = cur.next()
      if (cur.val === 0) {
        this.points.push(point)
        cur.modulo += 1
        cur.val = cur.modulo - 1
        break
      }
    }
    const after = cur.next()
    const before = cur.prev()
    const line1 = new Line(this.points[before.val], this.points[after.val])
    const line2 = new Line(this.points[cur.val], this.origin)
    if (!line1.intersects(line2)) {
      this.points.splice(cur.val, 1)
    }
  }
}

export class Point {
  x: number
  y: number
  color?: string
  constructor(x: number, y: number, color?: string) {
    this.x = x
    this.y = y
    this.color = color
  }
  angleTo(point: Point) {
    return Math.atan2(point.y - this.y, point.x - this.x)
  }
  draw(p: any) {
    p.push()
    if (this.color) {
      p.fill(this.color)
    }
    p.circle(this.x, this.y, 10)
    p.pop()
  }
}
export class Line {
  u: Point
  v: Point
  color?: string
  constructor(u: Point, v: Point, color?: string) {
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
  draw(p: any) {
    p.push()
    if (this.color) {
      p.fill(this.color)
    }
    p.line(this.u.x, this.u.y, this.v.x, this.v.y)
    p.pop()
  }
}