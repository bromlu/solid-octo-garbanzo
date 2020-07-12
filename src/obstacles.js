import { imgs } from "./load"
import { SIZE, bounded, TAU, enemyTypes } from "./globals";
import Animation, { enemyTentacleFrames, splashFrames } from "./animation";

export class Obstacles {
    constructor(x, y, type) {
    this.x = x;
    this.y = y;

    this.r = 32;

    this.health = 100;
    this.sinkInst = 0;
    this.sinking = false;
    this.sunk = false;

    this.hiding = false;
    this.hidden = false;

    if (type == enemyTypes.kraken) {
      let frameSelector = Animation.getLoopingFrameSelector(1250, enemyTentacleFrames.length)
      this.animation = new Animation(imgs.kraken, enemyTentacleFrames, frameSelector)
    } else if (type == enemyTypes.rock) {
      
    }

    let splashFrameSelector = Animation.getLinearFrameSelector(400, splashFrames.length)
    this.splashAnimation = new Animation(imgs.splash, splashFrames, splashFrameSelector);
  }

  update() {
    if (this.sinking) {
      if (Date.now() >= this.sinkInst) {
        this.sunk = true;
      }
      return;
    }
  }

  draw(ctx) {
    if (this.sunk) return;
    if (this.sinking) {
      this.splashAnimation.draw(ctx, this.x, this.y, false, .4);
      return;
    }
    ctx.save();

    ctx.translate(this.x, this.y);
    ctx.beginPath()
    ctx.arc(0, 0, this.r, 0, TAU);
    ctx.closePath()
    ctx.fill();

    this.animation.draw(ctx, 0, 0, false, .4);

    ctx.restore();
  }

  handleCollision() {
    this.health -= 100;
    if (this.health <= 0) {
      this.sinking = true;
      this.splashAnimation.play();
      this.sinkInst = Date.now() + 400;
    }
  }
}