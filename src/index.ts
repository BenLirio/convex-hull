import p5 from 'p5'
import State from './State'


const s = (p:any) => {
  const state = new State(p)
  p.setup = () => state.setup()
  p.mouseClicked = () => state.mouseClicked()
  p.windowResized = () => state.resizeCanvas()
  p.draw = () => {
    state.update()
    state.draw()
  }
}

new p5(s)