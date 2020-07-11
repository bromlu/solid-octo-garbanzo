export default class Animation {
  /**
   * Creates new instance of Animation
   * @param {Image | Canvas} spritesheet image to draw frames from
   * @param {FramePositionData[]} frames FramePositionData in animation order
   * @param {(t) => number} frameSelector function to convert time to frame index
   */
  constructor(spritesheet, frames, frameSelector) {
    this.spritesheet = spritesheet;
    this.frames = frames;
    this.frameSelector = frameSelector;

    this.t = Date.now();
  }

  play() {
    this.t = Date.now();
  }

  /**
   * 
   * @param {CanvasRenderingContext2D} ctx the context of the canvas to render to
   * @param {number} x 
   * @param {number} y 
   */
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

var mantaRayFrames = [{"x":2379,"y":497,"w":378,"h":364,"ax":2550,"ay":617},
                      {"x":2802,"y":495,"w":349,"h":350,"ax":2960,"ay":607},
                      {"x":3239,"y":495,"w":347,"h":350,"ax":3396,"ay":619},
                      {"x":3627,"y":494,"w":342,"h":359,"ax":3784,"ay":603},
                      {"x":4012,"y":493,"w":328,"h":354,"ax":4184,"ay":623},
                      {"x":4410,"y":509,"w":328,"h":342,"ax":4554,"ay":617},]