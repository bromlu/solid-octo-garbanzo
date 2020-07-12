
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

export const mantaRayFrames = [
  {"x":2379,"y":497,"w":378,"h":364,"ax":2550,"ay":617},
  {"x":2802,"y":495,"w":349,"h":350,"ax":2960,"ay":607},
  {"x":3239,"y":495,"w":347,"h":350,"ax":3396,"ay":619},
  {"x":3627,"y":494,"w":342,"h":359,"ax":3784,"ay":603},
  {"x":4012,"y":493,"w":328,"h":354,"ax":4184,"ay":623},
  {"x":4410,"y":509,"w":328,"h":342,"ax":4554,"ay":617},
]

export const playerShipFrames = [
  {"x":37,"y":24,"w":123,"h":260,"ax":91,"ay":126},
  {"x":187,"y":23,"w":125,"h":256,"ax":244,"ay":122},
  {"x":425,"y":22,"w":185,"h":247,"ax":544,"ay":132},
]

export const enemeyShipFrames = [
  {"x":3,"y":10,"w":132,"h":233,"ax":65,"ay":102},
  {"x":144,"y":4,"w":121,"h":241,"ax":203,"ay":97},
  {"x":324,"y":10,"w":196,"h":229,"ax":466,"ay":107},
]

export const cannonBallFrames = [
  {"x":8,"y":11,"w":119,"h":102,"ax":55,"ay":37},
  {"x":194,"y":9,"w":82,"h":57,"ax":246,"ay":27},  
]

export const enemeyCannonBallFrames = [
  {"x":16,"y":18,"w":106,"h":86,"ax":52,"ay":55},
  {"x":149,"y":11,"w":91,"h":69,"ax":196,"ay":46},
]

export const splashFrames = [
  {"x":6,"y":79,"w":112,"h":69,"ax":59,"ay":140},
  {"x":205,"y":75,"w":161,"h":75,"ax":285,"ay":138},
  {"x":407,"y":17,"w":272,"h":128,"ax":548,"ay":132},  
]

export const enemyTentacleFrames = [
  {"x":19,"y":47,"w":173,"h":231,"ax":88,"ay":241},
  {"x":210,"y":47,"w":153,"h":227,"ax":281,"ay":233},
  {"x":388,"y":53,"w":169,"h":216,"ax":460,"ay":230},
  {"x":574,"y":51,"w":168,"h":221,"ax":627,"ay":223},
  {"x":748,"y":23,"w":185,"h":257,"ax":812,"ay":226},
  {"x":942,"y":1,"w":189,"h":283,"ax":1025,"ay":246},
  {"x":1148,"y":3,"w":230,"h":294,"ax":1271,"ay":246},
  {"x":1396,"y":2,"w":224,"h":292,"ax":1512,"ay":253},
]

export const playerShootingFrames = [
  {"x":7,"y":12,"w":141,"h":264,"ax":80,"ay":111},
  {"x":169,"y":10,"w":120,"h":267,"ax":224,"ay":107},
]

export const enemyShootingFrames = [
  {"x":5,"y":5,"w":173,"h":354,"ax":90,"ay":135},
  {"x":204,"y":4,"w":174,"h":349,"ax":288,"ay":130},
]