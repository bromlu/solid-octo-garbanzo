import { Dice } from "./dice";
import { SIZE, randBell } from "./globals"

const standardDiceFaces = ["1","2","3","4","5","6"]
export default class DiceManager {
  constructor() {
    this.allDice = [];
    this.rollDuration = 1000;
    this.maxRollDuration = 1500;
    this.lastRoll = 0;
  }

  addDice(faces, color) {
    this.allDice.push(new Dice(faces, color));
    
  }

  addStandardDice(color="#777") {
    this.addDice(standardDiceFaces, color)
  }

  draw(ctx) {
    // if (Date.now() - this.lastRoll > this.maxRollDuration) return; //maybe need this optimization later
    let n = this.allDice.length;
    let width = .9 * SIZE;
    for (let i = 0; i < n; i++) {
      let y = .9 * SIZE;
      let x = SIZE/2 - width/2 + (i+1)*(width/(n+1));
      let dice = this.allDice[i];
      dice.draw(ctx, x, y)
    }
  }

  rollAll(callback) {
    this.lastRoll = Date.now();
    let n = this.allDice.length;
    for (let i = 0; i < n; i++) {
      let dice = this.allDice[i];
      let targetIdx = Math.floor(Math.random() * 6)
      dice.roll(targetIdx, randBell(this.rollDuration));
      let face = dice.faces[targetIdx]; //TODO use me
    }
  }

}