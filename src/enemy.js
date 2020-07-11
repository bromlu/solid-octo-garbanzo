import Vector from './vector.js'
import { imgs } from "./load"

export class Enemy {
    constructor(x, y, AI) {
        this.vector = new Vector(x, y);
        this.theta = 0;
        this.AI = AI

        this.r = 32;
        this.a = 0;
        this.aTheta = 0;
        this.v = 1;
        this.vTheta = 0;

        this.forceTheta = .02;
        this.force = 1;
        
        this.friction = .9
        this.frictionTheta = .8
    }

    update() {
        this.v *= this.friction;
        this.vTheta *= this.frictionTheta;
        if (Math.abs(this.v) < .01) this.v = 0;
        if (Math.abs(this.vTheta) < .01) this.vTheta = 0;
        
        if (this.AI.goForward) {
          this.a = this.force;
        } else this.a = 0;
        this.v += this.a;
        
        if (this.AI.goLeft) {
          this.aTheta = -this.forceTheta;
        } else if(this.AI.goRight) {
          this.aTheta = this.forceTheta;
        } else this.aTheta = 0;
        this.vTheta += this.aTheta;
    
        this.theta += this.vTheta;
        this.vector.x += this.v * Math.sin(this.theta);
        this.vector.y -= this.v * Math.cos(this.theta);
    }

    draw(ctx) {
        ctx.translate(this.vector.x, this.vector.y);
        ctx.rotate(this.theta);
        let left = - imgs.enemy.width / 2;
        let top = - imgs.enemy.height / 2
        ctx.drawImage(imgs.enemy, left, top)
        ctx.resetTransform();
    }
}