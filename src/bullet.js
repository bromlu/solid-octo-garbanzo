import { TAU, randBell } from "./globals";
export class Bullet {
  constructor(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = randBell(vx, .8);
    this.vy = randBell(vy, .8);
    this.rotate = false;

    this.sinkInst = 0;
    this.sinking = false;
    this.sunk = false;
    this.friction = .95;
  }
  draw(ctx) {
    if (!this.rotate) {
      ctx.fillStyle = "#333";
      ctx.beginPath()
      ctx.arc(this.x, this.y, 5, 0, TAU);
      ctx.closePath()
      ctx.fill();
    }
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

    if (Math.abs(this.vx) + Math.abs(this.vy)  < .5) {
      this.sinking = true;
      this.sinkInst = Date.now() + 1000;
    }
  }
}