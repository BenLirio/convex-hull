const width = 400
const height = 400
const numPoints = 7
let nextButton

const range = n => [...Array(n)].map((_,i) => i)
const uniform = (a,b) => Math.random()*(b-a)+a
const ccw = (A,B,C) => (C.y-A.y) * (B.x-A.x) > (B.y-A.y) * (C.x-A.x)
const intersect = (A,B,C,D) => ccw(A,C,D) != ccw(B,C,D) && ccw(A,B,C) != ccw(A,B,D)



let centerPoint = {
  x: -10,
  y: -10,
  color: 'blue'
}
const points = range(numPoints)
  .map(_ => ({
    x: uniform(width*0.1,width*0.9),
    y: uniform(height*0.1,height*0.9),
    color: 'white'
  }))


const selectPoints = () => {
  if (points.length < 3) {
    throw new Error('not enough points')
  }
  pointIndexes = range(3)
  pointIndexes.forEach(i => points[i].color = 'red')
  centerPoint = ({
    x: pointIndexes.reduce((acc,i) => acc + points[i].x, 0)/3,
    y: pointIndexes.reduce((acc,i) => acc + points[i].y, 0)/3,
    color: 'blue'
  })
}
const unselectThreePoints = () => {
  points.forEach(p => p.color = 'white')
}

const angles = []

const drawAngles = () => {
  points.forEach(v => {
    const u = centerPoint
    angles.push([u.x,u.y,v.x,v.y])
  })
}
const removeAngles = () => {
  while (angles.length) { angles.pop() }
  centerPoint.x = -10
  centerPoint.y = -10
}

const actions = [
  {
    id: 'start',
    name: 'placeholder',
    func: () => {},
    cleanup: () => {}
  },
  {
    id: 'select',
    name: 'select point within polygon',
    func: selectPoints,
    cleanup: unselectThreePoints
  },
  {
    id: 'angles',
    name: 'draw angles',
    func: drawAngles,
    cleanup: removeAngles
  },
  {
    id: 'done',
    name: 'done',
    func: () => {},
    cleanup: () => {}
  }
]

function setup() {
  createCanvas(width, height);
  nextButton = createButton('next')
  nextButton.mousePressed(nextAction)
  if (actions.length === 0) {
    nextButton.hide()
  } else {
    nextButton.html(actions[1].name)
  }
}

const drawPoint = ({x,y,color}) => {
  push()
  fill(color)
  circle(x,y,10)
  pop()
}

const nextAction = () => {
  if (actions.length >= 3) {
    const [{cleanup},{func},{name}] = actions
    cleanup()
    func()
    nextButton.html(name)
  } else if (actions.length === 2) {
    const [{cleanup},{func}] = actions
    cleanup()
    func()
    nextButton.hide()
  }
  actions.shift()
}

const interactive = () => {
  if (actions.length > 0 && actions[0].id === 'angles') {
    line(centerPoint.x,centerPoint.y,mouseX,mouseY)
    drawPoint({x: mouseX, y: mouseY, color: 'red'})
    const angles = points.map(({x,y}, idx) => {
      // get the angle between centerPoint and the current point
      const angle = Math.atan2(y - centerPoint.y, x - centerPoint.x)
      return [idx,angle]
    })
    const mouseAngle = Math.atan2(mouseY - centerPoint.y, mouseX - centerPoint.x)
    const sortedAngles = angles.sort((a,b) => a[1] - b[1])
    let pos
    for (pos = 0; pos < sortedAngles.length; pos++) {
      if (mouseAngle < sortedAngles[pos][1]) {
        break
      }
    }
    p1 = points[sortedAngles[pos%sortedAngles.length][0]]
    p2 = points[sortedAngles[(pos+sortedAngles.length-1)%sortedAngles.length][0]]
    push()
    if (!intersect(p1,p2,centerPoint,{x: mouseX, y: mouseY})) {
      fill('red')
    }
    triangle(centerPoint.x,centerPoint.y,p1.x,p1.y,p2.x,p2.y)
    pop()
  }
}

function draw() {
  background(220);
  angles.forEach(([x1,y1,x2,y2]) => line(x1,y1,x2,y2))
  points.forEach(drawPoint)
  drawPoint(centerPoint)
  interactive()
}