import { ConvexHull } from "./ConvexHull"
import { Point } from "./Point"
import { popRandomFromSet, range } from "./util"

export default class State {
  width: number
  height: number
  background: number  = 0
  points: Set<Point>
  convexHull: ConvexHull
  button: any
  p: any
  constructor(p: any) {
    this.p = p
  }
  setCanvasSize() {
    this.width = this.p.windowWidth * 0.8
    this.height = this.p.windowHeight * 0.6
  }
  resizeCanvas() {
    this.setCanvasSize()
    this.p.resizeCanvas(this.width, this.height) 
  }

  handleNextPoint() {
    const point =  popRandomFromSet(this.points)
    point.color = 'darkred'
    this.convexHull.addPoint(point)
    if (this.points.size === 0) {
      this.button.hide()
    }
  }

  setup() {
    this.setCanvasSize()
    const cnv = this.p.createCanvas(this.width, this.height)
    cnv.parent('p5-canvas')
    this.button = this.p.createButton('Next Point')
    this.button.parent('next-button')
    this.button.mousePressed(() => this.handleNextPoint())
    this.points = new Set(range(10).map(() => new Point(
      this.p,
      Math.random() * this.width,
      Math.random() * this.height,
    )))
    // Remove a random point from the set
    const hullPoints = range(3)
      .map(() => popRandomFromSet(this.points))
    this.convexHull = new ConvexHull(this.p, hullPoints)
  }

  mouseClicked() {
    if (this.p.mouseX > 0 && this.p.mouseX < this.width && this.p.mouseY > 0 && this.p.mouseY < this.height) {
      const point = new Point(this.p, this.p.mouseX, this.p.mouseY)
      this.convexHull.addPoint(point)
    }
  }

  update() {
  }

  draw() {
    this.p.background(this.background)


    this.convexHull.draw()
    this.points.forEach(point => point.draw())

    this.p.push()
    this.p.noFill()
    this.p.stroke('white')
    this.p.circle(this.p.mouseX, this.p.mouseY, 10)
    this.p.pop()
  }
}
