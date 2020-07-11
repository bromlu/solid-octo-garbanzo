import { Dice } from "./dice";
import { SIZE, randBell, bounded, lerp } from "./globals"
import { keys } from "./inputs"
import { player } from "./main"

const standardDiceFaces = ["1","2","3","4","5","6"]
const specialAbilityDiceFaces = ["Dash","Fire"," ","Dash","Fire"," "]
export default class DiceManager {
  constructor() {
    this.allDice = [];
    this.rollDuration = 1000;
    this.maxRollDuration = 1500;
    this.lastRoll = 0;
    this.force = 0;
    this.forceVel = 0.005;
    this.maxForce = 0.15;
    this.rolling = false;
    this.rollStart = 0;
  }

  increaseForce() {
    this.force += this.forceVel;
    // if (this.force > this.maxForce) this.force -= this.maxForce;
  }

  getBoundedForce() { //gives a number between 0 and maxforce
    let dir = (Math.floor(this.force / this.maxForce) % 2);
    let f = this.force % this.maxForce
    return dir == 0 ? f : this.maxForce - f;
  }

  addDice(faces, color) {
    this.allDice.push(new Dice(faces, color));
    
  }

  addStandardDice(color="#777") {
    this.addDice(standardDiceFaces, color)
  }

  addSpecialAbilityDice(color="#777") {
    this.addDice(specialAbilityDiceFaces, color)
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

  drawBar(ctx) {
    if (this.force > 0) {
      let barW = (this.getBoundedForce() / this.maxForce) * 100
      ctx.strokeRect(player.x-50, player.y + 50, 100, 10)
      ctx.fillRect(player.x-barW / 2, player.y + 50, barW, 10)
    }
  }

  rollAll() {
    this.lastRoll = Date.now();
    let n = this.allDice.length;
    this.force = this.getBoundedForce();
    this.rollDuration = lerp(500, 2000, (this.maxForce - this.force) / this.maxForce)

    for (let i = 0; i < n; i++) {
      let dice = this.allDice[i];
      let targetIdx = Math.floor(Math.random() * 6)
      dice.roll(targetIdx, randBell(this.rollDuration, .3), this.force);
      dice.done = false;
      dice.face = dice.faces[targetIdx]; //TODO use me
    }
    this.rolling = true;
    this.rollStart = Date.now();
  }

  onRollFinished() {
    this.rolling = false;
    this.force = 0;
  }

  update() {
    const now = Date.now();
    if (this.rolling) {
      if (Date.now() <= this.rollStart + this.rollDuration * 0.8) {
        return;
      }
      let numDone = 0;
      for (let dice of this.allDice) {
        if (dice.done) {
          numDone++;
          continue;
        }
        dice.done = dice.isDoneRolling(now);
        if (dice.done) {
          numDone++;
          console.log("clunk")
        }
      }
      if (numDone == this.allDice.length) this.onRollFinished();
    } else {

      if (keys[32])  this.increaseForce()

    }
  }


}