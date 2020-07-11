import { TAU, SIZE, bounded, lerp } from "./globals";
import { imgs } from "./load"
import { keys, UP, LEFT, RIGHT, SPACE } from "./inputs"
import { diceManager, playerBullets, enemies } from "./main";
import { Bullet } from "./bullet";
import Animation, { playerShipFrames } from "./animation";


export class Player {
  constructor() {
    this.x = 0; // middle of player (right pixel)
    this.y = 0;  // bottom of player
    this.theta = 0; //0 theta means facing up
    this.r = 16;
    this.a = 0;
    this.aTheta = 0;
    this.v = 0;
    this.vTheta = 0;

    this.forceTheta = .02;
    this.force = 1;
    this.forceStuck = false;

    this.friction = .9
    this.frictionTheta = .8

    this.hurtTimer = 0;

    this.chargingSpecial = false;
    this.bulletV = 30;

    this.afterImages = [];
    this.lastDash = 0;
  }

  reset() {
    this.x = 0;
    this.y = 0;
    this.theta = 0;
    this.a = 0;
    this.aTheta = 0;
    this.v = 0;
    this.vTheta = 0;
    this.forceTheta = .02;
    this.force = 1;
    this.forceStuck = false;
    this.friction = .9
    this.frictionTheta = .8

    this.hurtTimer = 0;

    this.chargingSpecial = false;
    this.bulletV = 30;

    this.afterImages = [];
    this.lastDash = 0;

  }

  setAnimations() {
    let frameSelector = Animation.getLoopingFrameSelector(1000, 2)
    this.moveAnimation = new Animation(imgs.boat, playerShipFrames, frameSelector)

    this.stillAnimation = new Animation(imgs.boat, playerShipFrames, t => 0)
    this.turnAnimation = new Animation(imgs.boat, playerShipFrames, t => 2)
  }

  draw(ctx) {
    ctx.save();
    let x = this.x;
    let y = this.y;
    let theta = this.theta;
    ctx.translate(x, y);
    ctx.rotate(this.theta);

    // ctx.beginPath()
    // ctx.arc(0, 0, this.r, 0, TAU);
    // ctx.closePath()
    // ctx.fill();

    if (this.v > 2) {
      this.moveAnimation.draw(ctx, 0, 0, false, .4);
    } else if (this.vTheta > .07) { 
      this.turnAnimation.draw(ctx, 0, 0, true, .4);
    } else if (this.vTheta < -.07) { 
      this.turnAnimation.draw(ctx, 0, 0, false, .4);
    } else {
      this.stillAnimation.draw(ctx, 0, 0, false, .4);
    }
    
    ctx.restore();
    if(this.isDashing()) {
      for (let i = 0; i < this.afterImages.length; i+= 2) {
        let afterimg = this.afterImages[i]
        ctx.save();
        ctx.translate(afterimg.x, afterimg.y);
        ctx.rotate(afterimg.theta);
        ctx.globalAlpha = .3;
        this.moveAnimation.draw(ctx, 0, 0, false, .4);
        ctx.globalAlpha = 1;
        ctx.restore();
      }
      this.afterImages.push({x, y, theta})
    } 

}

  update() {
    if (!diceManager.rolling) {
      if (keys[SPACE]) {
        this.chargingSpecial = true;
      } else if (this.chargingSpecial) {
        this.fireSpecial(diceManager.getBoundedForce())
        diceManager.rollAll();
        this.chargingSpecial = false
      }
    }

    this.v *= this.friction;
    this.vTheta *= this.frictionTheta;
    if (Math.abs(this.v) < .01) this.v = 0;
    if (Math.abs(this.vTheta) < .01) this.vTheta = 0;

    if (keys[UP] || this.forceStuck) {
      this.a = this.force;
    } else this.a = 0;
    this.v += this.a;

    if (keys[LEFT]) {
      this.aTheta = -this.forceTheta;
    } else if (keys[RIGHT]) {
      this.aTheta = this.forceTheta;
    } else this.aTheta = 0;
    this.vTheta += this.aTheta;

    this.theta += this.vTheta;
    // this.theta = bounded(-TAU/4, this.theta, TAU/4);
    this.x += this.v * Math.sin(this.theta);
    this.y -= this.v * Math.cos(this.theta);
    if (this.y > 0) this.y = 0;
    this.x = bounded(-SIZE, this.x, SIZE);
  }

  fireSpecial(diceForce) {
    let frac = diceForce / diceManager.maxForce // 0 to 1
    if (diceManager.allDice[0].face == "Dash") {
      this.v += diceForce * 300;
      this.lastDash = Date.now();
      this.afterImages = [];
    } else if (diceManager.allDice[0].face == "Fire") {
      let n = Math.floor(lerp(1, 4, frac));
      let spread = Math.PI / 2;
      for (let i = 0; i < n; i++) {
        let dir = this.theta + Math.PI / 2 - spread / 2 + ((i + 1) * (spread / (n + 2)))
        let xv = Math.sin(dir) * this.bulletV;
        let yv = -Math.cos(dir) * this.bulletV;
        playerBullets.push(new Bullet(this.x, this.y, xv, yv, 500))
      }
      for (let i = 0; i < n; i++) {
        let dir = this.theta - Math.PI / 2 - spread / 2 + ((i + 1) * (spread / (n + 2)))
        let xv = Math.sin(dir) * this.bulletV;
        let yv = -Math.cos(dir) * this.bulletV;
        playerBullets.push(new Bullet(this.x, this.y, xv, yv, 500))
      }
    }
  }

  handleCollision() {
    this.chargingSpecial = false;
    if (!diceManager.rolling) {
      if(diceManager.allDice.length === 1) {
        // YOU LOSE
        console.log("YOU LOSE")
      } else {
        diceManager.allDice.pop();
      }

      diceManager.force = 0;
      diceManager.rollAll();
    } 
  }

  isDashing() {
    return this.v > 15 && Date.now() - this.lastDash < 1000
  }

  resolveDiceRoll() {
    if (diceManager.allDice[1]) this.resolveForceDice(diceManager.allDice[1].face);
  }

  resolveForceDice(face) {
    this.forceStuck = false;
    switch (face) {
      case "-2":
        this.force = 0.2
        break;
      case "-1":
        this.force = 0.4;
        break;
      case "0":
        this.force = 0.5;
        break;
      case "1":
        this.force = 1;
        break;
      case "2":
        this.force = 1.7
        break;
      case "3":
        this.force = 2;
        this.forceStuck = true;
        break;
    }
  }
}