import { TAU, SIZE, bounded } from "./globals";
import { imgs } from "./load"
import { keys, UP, LEFT, RIGHT, SPACE } from "./inputs"
import {diceManager } from "./main";

export class Player {
  constructor() { 
    this.x = 100; // middle of player (right pixel)
    this.y = 200;  // bottom of player
    this.theta = 0; //0 theta means facing up
    this.r = 32;
    this.a = 0;
    this.aTheta = 0;
    this.v = 0;
    this.vTheta = 0;

    this.forceTheta = .02;
    this.force = 1;
    
    this.friction = .9
    this.frictionTheta = .8

    this.hurtTimer = 0;


    this.specialPower = 0
    this.maxSpecialPower = 100
  }

  draw(ctx) {
    ctx.save();

    ctx.translate(this.x, this.y);
    ctx.rotate(this.theta);
    let left = - imgs.player.width/2;
    let top = - imgs.player.height / 2
    ctx.drawImage(imgs.player, left, top)

    ctx.restore();
  }

  getBoundedSpecialPower() {
    let dir = (Math.floor(this.specialPower / this.maxSpecialPower) % 2);
    let f = this.specialPower % this.maxSpecialPower
    return dir == 0 ? f : this.maxSpecialPower - f;
  }

  update() {
    if (!diceManager.rolling) {
      if (keys[SPACE]) {
        this.specialPower += 1
      } else if (this.specialPower > 0) {
        this.fireSpecial(this.getBoundedSpecialPower())
        diceManager.rollAll();
        this.specialPower = 0
      }
    }

    this.v *= this.friction;
    this.vTheta *= this.frictionTheta;
    if (Math.abs(this.v) < .01) this.v = 0;
    if (Math.abs(this.vTheta) < .01) this.vTheta = 0;
    
    if (keys[UP]) {
      this.a = this.force;
    } else this.a = 0;
    this.v += this.a;
    
    if (keys[LEFT]) {
      this.aTheta = -this.forceTheta;
    } else if(keys[RIGHT]) {
      this.aTheta = this.forceTheta;
    } else this.aTheta = 0;
    this.vTheta += this.aTheta;

    this.theta += this.vTheta;
    // this.theta = bounded(-TAU/4, this.theta, TAU/4);
    this.x += this.v * Math.sin(this.theta);
    this.y -= this.v * Math.cos(this.theta);

    this.x = bounded(-SIZE, this.x, SIZE);
  }

  fireSpecial(specialPower) {
    console.log(diceManager.allDice[0].face)
    if (diceManager.allDice[0].face == "Dash") {
      this.v = specialPower
    }
  }
}