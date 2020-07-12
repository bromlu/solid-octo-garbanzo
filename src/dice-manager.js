import { Dice } from "./dice";
import { SIZE, randBell, bounded, lerp, getEl, TAU } from "./globals"
import { keys, cursor } from "./inputs"
import { player, lastKeys, textParticles, resourceManager } from "./main"
import { sounds } from "./load";

// const controlModifierDiceFaces = ["1", "2", "3", "-1", "-2", "0"]
// const abilityDiceFaces = [" ", "Dash", "Fire"]

// const specialAbilityDiceFaces = ["Dash", "Fire", "Fire", "Dash", "Fire", "Fire"]
// const DashDiceFaces = ["Fire", "Dash", "Dash", "Dash", "Dash", "Dash"]
// const FireDiceFaces = ["Fire", "Fire", "Fire", "Fire", "Fire", "Fire"]
const standardDiceFaces = ["left_cannon", "right_cannon", "forward", "dash", "shield", "X"]
// const standardDiceFaces = ["left_cannon", "left_cannon", "left_cannon", "right_cannon", "right_cannon", "right_cannon"]
const standardDiceColors = ["red", "blue", "green", "red", "blue", "grey"]
// const standardDiceColors = ["grey", "grey", "grey", "grey", "grey", "grey"]
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

  reRollControlModifiers() {
    for(let controlDiceIndex = 1; controlDiceIndex < 5; controlDiceIndex++) {
      let faces = [];
      for (let i = 0; i < 6; i++) {
        let newFaceIdx = Math.floor(Math.random() * controlModifierDiceFaces.length)
        faces.push(controlModifierDiceFaces[newFaceIdx])
      }
      this.allDice.splice(controlDiceIndex, 1, new Dice(faces, "#777"));
    }
    this.setDiceFacesInHtml()
  }

  reRollAbilities() {
    let faces = [];
    for (let i = 0; i < 6; i++) {
      let newFaceIdx = Math.floor(Math.random() * abilityDiceFaces.length)
      faces.push(abilityDiceFaces[newFaceIdx])
    }
    this.allDice.splice(0, 1);
    this.allDice.unshift(new Dice(faces, "#777"))
    this.setDiceFacesInHtml()
  }

  setDiceFacesInHtml() {
    getEl('abilityDiceFace1').src = this.allDice[0].faces[0] === 'Dash' ? './assets/dash.png' : ''
    getEl('abilityDiceFace2').src = this.allDice[0].faces[1] === 'Dash' ? './assets/dash.png' : ''
    getEl('abilityDiceFace3').src = this.allDice[0].faces[2] === 'Dash' ? './assets/dash.png' : ''
    getEl('abilityDiceFace4').src = this.allDice[0].faces[3] === 'Dash' ? './assets/dash.png' : ''
    getEl('abilityDiceFace5').src = this.allDice[0].faces[4] === 'Dash' ? './assets/dash.png' : ''
    getEl('abilityDiceFace6').src = this.allDice[0].faces[5] === 'Dash' ? './assets/dash.png' : ''
    getEl('controlDiceFace1').innerHTML = this.allDice[1].faces[0]
    getEl('controlDiceFace2').innerHTML = this.allDice[1].faces[1]
    getEl('controlDiceFace3').innerHTML = this.allDice[1].faces[2]
    getEl('controlDiceFace4').innerHTML = this.allDice[1].faces[3]
    getEl('controlDiceFace5').innerHTML = this.allDice[1].faces[4]
    getEl('controlDiceFace6').innerHTML = this.allDice[1].faces[5]
  }

  resetDice() {
    this.allDice.forEach(dice => {
      dice.rotXTarget = Math.PI / 4 + Math.PI/2 * Math.floor((Math.random() * 3));
      dice.rotYTarget = Math.PI / 4 + Math.PI/2 * Math.floor((Math.random() * 3));
  
      dice.face = "";
    })
  }

  increaseForce() {
    this.force += this.forceVel;
    // if (this.force > this.maxForce) this.force -= this.maxForce;
  }

  getBoundedForce() { //gives a number between 0 and maxforce
    // let dir = (Math.floor(this.force / this.maxForce) % 2);
    // let f = this.force % this.maxForce
    // return dir == 0 ? f : this.maxForce - f;
    return this.maxForce;
  }

  addDice(faces, color) {
    this.allDice.push(new Dice(faces, color));
    this.setDicePositions()
  }

  addStandardDice() {
    this.addDice(standardDiceFaces, standardDiceColors)
  }

  // addSpecialAbilityDice(color = "#777") {
  //   // this.addDice(DashDiceFaces, color)
  //   this.addDice(FireDiceFaces, color)
  // }

  setDicePositions() {
    let n = this.allDice.length;
    let width = .9 * SIZE;
    for (let i = 0; i < n; i++) {
      let y = .9 * SIZE;
      let x = SIZE / 2 - width / 2 + (i + 1) * (width / (n + 1));
      let dice = this.allDice[i];
      dice.x = x;
      dice.y = y;
    }
  }

  draw(ctx) {
    // if (Date.now() - this.lastRoll > this.maxRollDuration) return; //maybe need this optimization later
    this.allDice.forEach(dice => {
      if (!this.rolling && dice.resolved) {
        ctx.globalAlpha = .2;
        dice.draw(ctx)
        ctx.globalAlpha = 1;
      } else {
        dice.draw(ctx)
      }
      if (dice.hover) {
        ctx.beginPath()
        ctx.arc(dice.x, dice.y, 50, 0, TAU);
        ctx.strokeStyle = "yellow";
        ctx.stroke();
        ctx.closePath()
      }
    });
  }

  drawBar(ctx) {
    if (this.force > 0) {
      ctx.fillStyle = "red"
      ctx.strokeStyle = "#555"
      let barW = (this.getBoundedForce() / this.maxForce) * 100
      ctx.strokeRect(player.x - 50, player.y + 50, 100, 10)
      ctx.fillRect(player.x - barW / 2, player.y + 50, barW, 10)
    }
  }

  rollAll() {
    this.lastRoll = Date.now();
    let n = this.allDice.length;
    this.force = this.getBoundedForce();
    this.rollDuration = lerp(500, 2000, (this.maxForce - this.force) / this.maxForce)

    for (let i = 0; i < n; i++) {
      let dice = this.allDice[i];
      dice.hover = false;
      let targetIdx = Math.floor(Math.random() * 6)
      dice.roll(targetIdx, randBell(this.rollDuration, .3), this.force);
      dice.done = false;
      dice.face = dice.faces[targetIdx];
      dice.color = dice.colors[targetIdx];
      dice.faceIdx = targetIdx;
    }
    this.force = 0;
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
          sounds.clunk.currentTime = 0;
          sounds.clunk.play();
          dice.resolved = false;
        }
      }
      if (numDone == this.allDice.length) this.onRollFinished();
    } else if (!this.allResolved()) { //set hover, handle click
      for (let dice of this.allDice) {
        dice.hover = false;
        if (dice.resolved) continue;
        if (dice.contains(cursor.x, cursor.y)) {
          dice.hover = true;
          if (!lastKeys[0] && keys[0]) { //LMB
            this.resolveDice(dice)
            return;
          } else if (!lastKeys[2] && keys[2]) { //RMB
            this.resolveDiceColor(dice)
            return;
          }
        }
      }
    } else {
      this.rollAll();
    }
    // else {
    //   if (keys[32]) this.increaseForce()
    // }
  }

  resolveDice(dice) {
    // "left_cannon", "right_cannon", "forward", "dash", "shield", "X"
    switch (dice.face) {
      case "dash":
        player.startDash();
        break;
      case "forward":
        player.startForward();
        break;
      case "left_cannon":
        player.shootLeft();
        break;
      case "right_cannon":
        player.shootRight();
        break;
      case "shield":
        player.shieldUp();
        break;
      default:
        break;
    }
    dice.resolved = true;

    // textParticles.newTextPart(dice.x, dice.y-30, "white", dice.face)
  }

  
  resolveDiceColor(dice) {
    let color = dice.color
    let amt = 0;
    for (let d of this.allDice) {
      if (d.resolved) continue;
      if (d.color == dice.color){
        d.resolved = true;
        let gain = Math.ceil(amt/2) + 1;
        amt += gain
        textParticles.newTextPart(d.x, d.y-30, "white", "+"+gain)
      }
    }
    resourceManager.add(amt, color);
  }

  allResolved() {
    for (let i = 0; i < this.allDice.length; i++) {
      if (!this.allDice[i].resolved) return false;
    }
    return true;
  }

  loseFace() {
    let minScore = 100;
    let minDice = null;
    for (let i = 0; i < this.allDice.length; i++) {
      let dice = this.allDice[i];
      let diceScore = faceScores[dice.face];
      if (diceScore < minScore) {
        minDice = dice;
        minScore = diceScore;
      }
    }
    if (minDice == null) {
      console.log("heavy damage");
      return;
    }
    
    minDice.mapFaces(
      minDice.faces.map((face, idx) => idx == minDice.faceIdx ? "X" : face),
      minDice.colors.map((color, idx) => idx == minDice.faceIdx ? "grey" : color)
    );
    minDice.face = "X"
    minDice.color = "grey"
  }

}

let faceScores = {
  "left_cannon": 1,
  "right_cannon": 1,
  "forward": 9,
  "dash": 2,
  "shield": 2,
  "X": 100
}