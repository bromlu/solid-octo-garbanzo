import { imgs } from "./load"
import { enemyBullets } from "./main";
import { Bullet } from "./bullet";
import { SIZE, bounded} from "./globals";

export class Enemy {
    constructor(x, y, AI, sprite) {
        this.x = x;
        this.y = y;
        this.theta = 0;
        this.AI = AI
        this.sprite = sprite;

        this.r = 32;
        this.a = 0;
        this.aTheta = 0;
        this.v = 0;
        this.vTheta = 0;

        this.forceTheta = .02;
        this.force = 1;
        
        this.friction = .9
        this.frictionTheta = .8

        this.reloadTime = 1000;
        this.lastShot = 0;
        this.numBullets = 5;
        this.bulletV = 30;

        this.health = 100;
    }

    update() {
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
      } else if(this.AI.goRight(this)) {
        this.aTheta = this.forceTheta;
      } else this.aTheta = 0;
      this.vTheta += this.aTheta;
  
      this.theta += this.vTheta;
      this.x += this.v * Math.sin(this.theta);
      this.y -= this.v * Math.cos(this.theta);
      this.x = bounded(-SIZE, this.x, SIZE);

      let now = Date.now();

      if (this.AI.useShot(this) && now > this.lastShot + this.reloadTime) {
        let useRight = this.AI.useRightSide;
        let n = this.numBullets;
        if (useRight) {
          let spread = Math.PI/2;
          for (let i = 0; i < n; i++)
          {
            let dir = this.theta + Math.PI/2 - spread/2 + ((i+1) * (spread / (n+2)))
            // let dir = this.theta + Math.PI/2;
            let xv = Math.sin(dir) * this.bulletV;
            let yv = -Math.cos(dir) * this.bulletV;
            enemyBullets.push(new Bullet(this.x, this.y, xv, yv, 500))
          }
        } else {
          let dir = this.theta - Math.PI/2;
          let xv = Math.sin(dir) * this.bulletV;
          let yv = -Math.cos(dir) * this.bulletV;
          for (let i = 0; i < n; i++)
          {
            enemyBullets.push(new Bullet(this.x, this.y, xv, yv, 500))
          }
        }
        this.lastShot = now;
      }
    }

    draw(ctx) {
        ctx.save();

        ctx.translate(this.x, this.y);
        ctx.rotate(this.theta);
        let left = -this.sprite.width / 2;
        let top = -this.sprite.height / 2;
        ctx.drawImage(this.sprite, left, top)

        ctx.restore();

    }
}