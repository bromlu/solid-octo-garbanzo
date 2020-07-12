import { TAU, randBell } from "./globals";
import Animation, { cannonBallFrames, splashFrames, enemeyCannonBallFrames } from "./animation";
import { imgs } from "./load";
export class Bullet {
  constructor(x, y, vx, vy, fromEnemy) {
    this.x = x;
    this.y = y;
    this.vx = randBell(vx, 0.2);
    this.vy = randBell(vy, 0.2);

    this.sinkInst = 0;
    this.sinking = false;
    this.sunk = false;
    this.friction = .95;

    let frameSelector = (t) => (this.vx*this.vx + this.vy*this.vy) > 100 ? 0 : 1
    if (fromEnemy) {
      this.animation = new Animation(imgs.enemyBullet, enemeyCannonBallFrames, frameSelector);
    } else {
      this.animation = new Animation(imgs.bullet, cannonBallFrames, frameSelector);
    }

    let splashFrameSelector = Animation.getLinearFrameSelector(400, splashFrames.length)
    this.splashAnimation = new Animation(imgs.splash, splashFrames, splashFrameSelector);
  }
  draw(ctx) {
    if (this.sunk) return;
    if (this.sinking) {
      this.splashAnimation.draw(ctx, this.x, this.y, false, .4);
      return;
    }
    ctx.save();
    ctx.translate(this.x, this.y);
    let th = Math.atan2(this.vy, this.vx);
    ctx.rotate(th + 3*Math.PI / 4);
    this.animation.draw(ctx, 0, 0, false, .4);
    ctx.restore();
  }

  update() {
    if (this.sinking) {
      if (Date.now() >= this.sinkInst) {
        this.sunk = true;
      }
      return;
    }

    this.x += this.vx
    this.y += this.vy
    this.vx *= this.friction;
    this.vy *= this.friction;

    if (Math.abs(this.vx) + Math.abs(this.vy)  < 4) {
      this.sinking = true;
      this.splashAnimation.play();
      this.sinkInst = Date.now() + 400;
    }
  }
}