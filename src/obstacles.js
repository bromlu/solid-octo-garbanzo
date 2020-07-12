import { imgs, sounds } from "./load"
import { player, island, enemyBullets } from "./main"
import { SIZE, bounded, TAU, enemyTypes } from "./globals";
import Animation, { enemyTentacleFrames, splashFrames } from "./animation";
import { Bullet } from "./bullet"

export class Obstacles {
    constructor(x, y, type) {
    this.x = x;
    this.y = y;

    this.r = 32;
    this.type = type
    this.theta = 0;

    this.health = 100;
    this.showHideDuration = 1100;
    this.showHideTarget = Date.now() + this.showHideDuration;

    this.sinkInst = 0;
    this.sinking = false;
    this.sunk = false;

    this.hideInst = 0;
    this.hiding = false;
    this.hidden = false;

    this.showInst = 0;
    this.showing = false;
    this.shown = true;

    this.flip = player.x < this.x;

    if (type == enemyTypes.kraken) {
      let frameSelector = Animation.getLinearFrameSelector(1000, enemyTentacleFrames.length)
      this.animation = new Animation(imgs.kraken, enemyTentacleFrames, frameSelector)
    } else if (type == enemyTypes.rock) {
      
    }

    let splashFrameSelector = Animation.getLinearFrameSelector(400, splashFrames.length)
    this.splashAnimation = new Animation(imgs.splash, splashFrames, splashFrameSelector);

    this.lastShot = Date.now() // Don't shoot right away
    this.reloadTime = 2200 // every other showing?
    this.bulletV = 30;
  }

  update() {
    if (this.type !== enemyTypes.kraken) return;

    if (Date.now() > this.lastShot + this.reloadTime && this.hiding) {
      sounds.enemy_attack.volume = 0.05;
      sounds.enemy_attack.currentTime = 0.3;
      sounds.enemy_attack.play();

      let useRight = !this.flip;
      let n = 1;
      let spread = Math.PI / 2;
      if (useRight) {
        for (let i = 0; i < n; i++) {
          let dir = this.theta + Math.PI / 2 // - spread / 2 + ((i + 1) * (spread / (n + 2)))
          // let dir = this.theta + Math.PI/2;
          let xv = Math.sin(dir) * this.bulletV;
          let yv = -Math.cos(dir) * this.bulletV;
          enemyBullets.push(new Bullet(this.x, this.y, xv, yv, true))
        }
      } else {
        for (let i = 0; i < n; i++) {
          let dir = this.theta - Math.PI / 2 // - spread / 2 + ((i + 1) * (spread / (n + 2)))
          let xv = Math.sin(dir) * this.bulletV;
          let yv = -Math.cos(dir) * this.bulletV;
          enemyBullets.push(new Bullet(this.x, this.y, xv, yv, true))
        }
      }
      this.lastShot = Date.now();
    }

    if (this.sinking) {
      if (Date.now() >= this.sinkInst) {
        this.sunk = true;
        this.sinking = false;
      }
      return
    }
    if (this.hiding) {
      if (Date.now() >= this.hideInst) {
        this.hidden = true;
        this.hiding = false;
      }
      return
    }
    if (this.showing) {
      if (Date.now() >= this.showInst) {
        this.shown = true;
        this.showing = false;
      }
      return
    }

    if (this.shown) {
      if (Date.now() >= this.showHideTarget) {
        this.shown = false;
        this.hiding = true;
        this.splashAnimation.play();
        this.hideInst = Date.now() + 400;
        this.showHideTarget = Date.now() + this.showHideDuration
      }
    }

    if (this.hidden) {
      if (Date.now() >= this.showHideTarget) {
        this.x += Math.random() * 100 * (Math.random() > .5 ? -1 : 1);
        this.y += Math.random() * 100 * (Math.random() > .5 ? -1 : 1);
        bounded(-SIZE, this.x, SIZE);
        this.y = bounded(island.y, this.y, 0);
        this.flip = player.x < this.x;

        this.animation.play();
        this.hidden = false;
        this.showing = true;
        this.splashAnimation.play();
        this.showInst = Date.now() + 400;
        this.showHideTarget = Date.now() + this.showHideDuration

        sounds.splash.volume = 0.02;
        sounds.splash.currentTime = 0;
        sounds.splash.play();
      }
    }


  }

  draw(ctx) {
    if (this.type === enemyTypes.rock) {
      ctx.save();

      ctx.translate(this.x, this.y);

      ctx.drawImage(imgs.rock, 0 - 32, 0 - 32, 64, 64);

      ctx.restore();
      return;
    }

    if (this.type === enemyTypes.seaweed) {
      ctx.save();

      ctx.translate(this.x, this.y);

      ctx.drawImage(imgs.seaweed, 0 - 32, 0 - 32, 64, 64);

      ctx.restore();
      return;
    }


    if (this.sunk || this.hidden) return;
    if (this.sinking || this.hiding || this.showing) {
      this.splashAnimation.draw(ctx, this.x, this.y, false, .4);
      return;
    }
    ctx.save();

    ctx.translate(this.x, this.y);
    // ctx.beginPath()
    // ctx.arc(0, 0, this.r, 0, TAU);
    // ctx.closePath()
    // ctx.fill();

    this.animation.draw(ctx, 0, 0, this.flip, .4);

    ctx.restore();
  }

  handleCollision() {
    if (this.type !== enemyTypes.kraken) return;
    this.health -= 100;
    if (this.health <= 0) {
      this.sinking = true;
      this.splashAnimation.play();
      this.sinkInst = Date.now() + 400;

      sounds.splash.volume = 0.2;
      sounds.splash.currentTime = 0;
      sounds.splash.play();
    }
  }


}