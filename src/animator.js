export default class Animation {
    constructor(spritesheet, frames, frameSelector) {
      this.spritesheet = spritesheet;
      this.frames = frames;
      this.frameSelector = frameSelector;
  
      this.t = Date.now();
    }
  
    start() {
      this.t = Date.now();
    }
  
    draw(ctx, x, y, flip, scale=1) {
      if (this.frameSelector == null) return;
      if (this.frames == null || this.frames.length == 0) return;
      if (this.spritesheet == null) return;
      
      let elapsed = Date.now() - this.t;
      let f = this.frames[this.frameSelector(elapsed)];
      let left = x - (f.ax - f.x) * scale;
      let top = y - (f.ay - f.y) * scale;
      let dw = f.w * scale;
      let dh = f.h * scale;
      if (flip) {
        let right = x + (f.ax - f.x) * scale;
        ctx.scale(-1, 1);
        ctx.drawImage(this.spritesheet, f.x, f.y, f.w, f.h, -right, top, dw, dh);
        ctx.scale(-1, 1);
      } else {
        ctx.drawImage(this.spritesheet, f.x, f.y, f.w, f.h, left, top, dw, dh);
      }
    }
  
    static getLinearFrameSelector(duration, numFrames) {
      let perFrame = duration / numFrames;
      return (t => {
        if (t/perFrame >= numFrames) return numFrames-1;
        return Math.floor(t/perFrame);
      });
    }
  
    static getLoopingFrameSelector(duration, numFrames) {
      let perFrame = duration / numFrames;
      return (t => {
          return Math.floor(t/perFrame) % numFrames;
      });
    }
  
    static getReversingFrameSelector(duration, numFrames) {
      if (numFrames < 2) throw RangeError("numFrames should be greater than 2.")
      let b = numFrames - 1;
      numFrames = (numFrames * 2) - 2;
      let perFrame = duration / numFrames;
      return (t => {
          let x = Math.floor(t/perFrame) % numFrames;
          return b - Math.abs(b - x);
      });
    }
  }