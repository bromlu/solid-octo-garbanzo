const { SIZE, bounded, TAU } = require("./globals");

export class Camera {
  constructor() {

    this.xAnchor = 0;
    this.yAnchor = 0;
    this.x = this.xAnchor;
    this.y = this.yAnchor;

    this.vel = 5;

    this.xShakeFactor = 0;
    this.yShakeFactor = 0;
    this.xShakeSeed = 0;
    this.yShakeSeed = 0;
  }
  shake(amplitude) {
      let z1 = (Math.random() - Math.random()) * amplitude / 5;
      let z2 = (Math.random() - Math.random()) * amplitude / 5;
      this.xShakeFactor = amplitude + z1;
      this.yShakeFactor = amplitude + z2;
      let rand = Math.random();
      this.xShakeSeed = rand * TAU;
      this.yShakeSeed = rand * TAU;
  }

  setTarget(obj) {
      this.target = obj;
  }

  update() {

      if (this.xShakeFactor > 0)  {
          let now = Date.now();
          this.x = this.xAnchor + this.xShakeFactor * Math.sin(this.xShakeSeed-now);
          this.y = this.yAnchor + this.yShakeFactor * Math.cos(this.yShakeSeed-now);
          this.xShakeFactor *= .9;
          this.yShakeFactor *= .9;

          if (this.xShakeFactor < .5) {
              this.xShakeFactor = 0;
              this.yShakeFactor = 0;
          }
      }

      
      let dx = this.xAnchor - this.x;
      let dy = this.yAnchor - this.y;
      
      if (this.xShakeFactor <= 0) {
          if (Math.abs(dx) < .001) this.x = this.xAnchor;
          if (Math.abs(dy) < .001) this.y = this.yAnchor;
      }

      this.x += dx/2//Math.sign(dx) * this.vel;
      this.y += dy/2//Math.sign(dy) * this.vel;

      if (this.target == null) return;
      this.xAnchor = this.target.x - SIZE/2;
      this.yAnchor = this.target.y - SIZE/2;
      this.xAnchor = bounded(-SIZE, this.xAnchor, 0);
  }

  moveCtx(ctx) {
      ctx.translate(-Math.round(this.x), -Math.round(this.y));
  }
}
