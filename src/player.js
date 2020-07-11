import { TAU, SIZE, bounded } from "./globals";
import { imgs } from "./load"
import { keys, UP, LEFT, RIGHT, SPACE } from "./inputs"
import { diceManager, playerBullets } from "./main";
import { Bullet } from "./bullet";

export class Player {
  constructor() {
    this.x = 100; // middle of player (right pixel)
    this.y = 200;  // bottom of player
    this.theta = 0; //0 theta means facing up
    this.r = 16;
    this.a = 0;
    this.aTheta = 0;
    this.v = 0;
    this.vTheta = 0;

    this.forceTheta = .02;
    this.force = 1;

    this.friction = .9
    this.frictionTheta = .8

    this.hurtTimer = 0;

    this.chargingSpecial = false;
    this.bulletV = 30;
  }

  draw(ctx) {
    ctx.save();

    ctx.beginPath()
    ctx.arc(this.x, this.y, this.r, 0, TAU);
    ctx.closePath()
    ctx.fill();


    ctx.translate(this.x, this.y);
    ctx.rotate(this.theta);
    let left = - imgs.player.width / 2;
    let top = - imgs.player.height / 2
    ctx.drawImage(imgs.player, left, top)

    ctx.restore();
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

    if (keys[UP]) {
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

    this.x = bounded(-SIZE, this.x, SIZE);
  }

  fireSpecial(diceForce) {
    if (diceManager.allDice[0].face == "Dash") {
      this.v += diceForce * 300;
    } else if (diceManager.allDice[0].face == "Fire") {
      let n = Math.floor(diceForce * 50);
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
      diceManager.force = 0;
      diceManager.rollAll();
    }
    // else take damage?
  }

  isDashing() {
    return this.v > 10
  }
}