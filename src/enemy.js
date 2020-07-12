import { imgs, sounds } from "./load"
import { enemyBullets, island } from "./main";
import { Bullet } from "./bullet";
import { SIZE, bounded, TAU, enemyTypes } from "./globals";
import Animation, { mantaRayFrames, enemeyShipFrames, splashFrames } from "./animation";

export class Enemy {
  constructor(x, y, AI, type) {
    this.x = x;
    this.y = y;
    this.theta = 0;
    this.AI = AI
    this.type = type;

    this.r = 32;
    this.a = 0;
    this.aTheta = 0;
    this.v = 0;
    this.vTheta = 0;

    this.forceTheta = .02;
    this.force = 1;

    this.friction = .9
    this.frictionTheta = .8

    this.reloadTime = 3000;
    this.lastShot = 0;
    this.numBullets = 3;
    this.bulletV = 30;

    this.health = 100;
    this.sinkInst = 0;
    this.sinking = false;
    this.sunk = false;

    if (type == enemyTypes.manta) {
      let frameSelector = Animation.getLoopingFrameSelector(1000, mantaRayFrames.length)
      this.animation = new Animation(imgs.manta, mantaRayFrames, frameSelector)
    } else if (type == enemyTypes.boat) {
      let frameSelector = Animation.getLoopingFrameSelector(1000, 2)
      this.animation = new Animation(imgs.enemyBoat, enemeyShipFrames, frameSelector)
    }

    let splashFrameSelector = Animation.getLinearFrameSelector(400, splashFrames.length)
    this.splashAnimation = new Animation(imgs.splash, splashFrames, splashFrameSelector);

  }

  update() {
    if (this.sinking) {
      if (Date.now() >= this.sinkInst) {
        this.sunk = true;
      }
      if (this.type == enemyTypes.boat && this.sinkInst - Date.now() < 800 && !this.splashAnimation.played) {
        this.splashAnimation.play()
        this.splashAnimation.played = true;
      }
      return;
    }

    if (this.AI.update) this.AI.update(this);

    this.v *= this.friction;
    this.vTheta *= this.frictionTheta;
    if (Math.abs(this.v) < .01) this.v = 0;
    if (Math.abs(this.vTheta) < .01) this.vTheta = 0;

    if (this.AI.goForward(this)) {
      this.a = this.force;
    } else this.a = 0;
    this.v += this.a;

    if (this.AI.goLeft(this)) {
      this.aTheta = -this.forceTheta;
    } else if (this.AI.goRight(this)) {
      this.aTheta = this.forceTheta;
    } else this.aTheta = 0;
    this.vTheta += this.aTheta;

    this.theta += this.vTheta;
    this.x += this.v * Math.sin(this.theta);
    this.y -= this.v * Math.cos(this.theta);
    this.x = bounded(-SIZE, this.x, SIZE);
    this.y = bounded(island.y, this.y, 0);

    let now = Date.now();

    if (this.AI.useShot(this) && now > this.lastShot + this.reloadTime) {
      sounds.shoot.volume = 0.2;
      sounds.shoot.currentTime = 0;
      sounds.shoot.play();

      let useRight = this.AI.useRightSide;
      let n = this.numBullets;
      let spread = Math.PI / 2;
      if (useRight) {
        for (let i = 0; i < n; i++) {
          let dir = this.theta + Math.PI / 2 - spread / 2 + ((i + 1) * (spread / (n + 2)))
          // let dir = this.theta + Math.PI/2;
          let xv = Math.sin(dir) * this.bulletV;
          let yv = -Math.cos(dir) * this.bulletV;
          enemyBullets.push(new Bullet(this.x, this.y, xv, yv, true))
        }
      } else {
        for (let i = 0; i < n; i++) {
          let dir = this.theta - Math.PI / 2 - spread / 2 + ((i + 1) * (spread / (n + 2)))
          let xv = Math.sin(dir) * this.bulletV;
          let yv = -Math.cos(dir) * this.bulletV;
          enemyBullets.push(new Bullet(this.x, this.y, xv, yv, true))
        }
      }
      this.lastShot = now;
    }
  }

  draw(ctx) {
    let broken = this.sinking && this.type == enemyTypes.boat && !this.splashAnimation.played;
    if (this.sunk) return;
    if (this.sinking) {
      if (!broken) this.splashAnimation.draw(ctx, this.x, this.y, false, .4);
    }
    ctx.save();

    ctx.translate(this.x, this.y);
    ctx.rotate(this.theta);
    // ctx.beginPath()
    // ctx.arc(0, 0, this.r, 0, TAU);
    // ctx.closePath()
    // ctx.fill();

    if (broken) {
      ctx.scale(.4,.4);
      ctx.drawImage(imgs.brokenEnemy, -163/2, -235/2)
    } else if (!this.sinking) {
      this.animation.draw(ctx, 0, 0, false, .4);
    }


    ctx.restore();

  }

  handleCollision() {
    this.health -= 100;
    if (this.health <= 0) {
      this.sinking = true;
      this.splashAnimation.play();
      this.sinkInst = Date.now() + 400;
      if (this.type == enemyTypes.boat) this.sinkInst += 800;

      sounds.splash.volume = 0.2;
      sounds.splash.currentTime = 0;
      sounds.splash.play();
    }
  }
}