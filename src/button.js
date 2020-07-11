export class Button {
  constructor(x, y, w, h, callback, img) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.callback = callback
    this.special = special
    this.img = img;

  }

  contains(x,y){
    if (x < this.x) return false;
    if (x > this.x + this.w) return false;
    if (y < this.y) return false;
    if (y > this.y + this.h) return false;
    return true;
  }

  click() { this.callback() }

  draw(ctx, stroke=false) {
    if (this.img) {
      ctx.drawImage(this.img, this.x, this.y);
    } else {
      ctx.fillStyle = "#AAA";
      ctx.fillRect(this.x,this.y,this.w,this.h);
    }
    if (!stroke) return
    ctx.strokeStyle = "white"
    ctx.strokeRect(this.x,this.y,this.w,this.h)
  }
}
