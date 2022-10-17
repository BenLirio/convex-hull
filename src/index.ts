import p5 from 'p5'
import State from './state'

const state = new State()

const s = (p:any) => {
  p.setup = () => state.setup(p)
  p.mouseClicked = () => state.mouseClicked(p)

  p.draw = () => {
    state.update(p)
    state.draw(p)
  };
};

new p5(s)