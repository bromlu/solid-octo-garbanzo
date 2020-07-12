import { SIZE, lerp, colorDict, bounded } from "./globals";
import { imgs } from "./load"

const cantTurnMsgs = [
  "Wheel's stuck!",
  "Can't seem to turn!"
]

export class ResourceManager {
  constructor() {
    this.ammo = 10;
    this.maxAmmo = 20;
    this.ammoStep = this.maxAmmo / 20;
    this.control = 100;
    this.maxControl = 200;
    this.controlStep = this.maxControl / 20;
    this.rudder = 150;
    this.maxRudder = 300;
    this.rudderStep = this.maxRudder / 20;
  }
  
  useAmmo(n) {
    this.ammo -= n;
    if (this.ammo < 0) this.ammo = 0;
  }
  useRudder() {
    this.rudder--;
    if (this.rudder <= 0) {
      this.rudder = 0;
      player.showMessage(cantTurnMsgs)
    }
  }

  useControl() {
    this.control--;
    if (this.control < 0) this.control = 0;
  }


  add(amt, color) {
    if (color == "red") {
      this.ammo += amt * this.ammoStep;
    }
    else if (color == "blue") {
      this.control += amt * this.controlStep;
    }
    else if (color == "green") {
      this.rudder += amt * this.rudderStep;
    }
    else if (color == "grey") {
      for (let i = 0; i < amt; i++) {
        let rand = Math.random();
        if (rand < .333) this.ammo += this.ammoStep;
        else if (rand < .666) this.control += this.controlStep;
        else this.rudder += this.rudderStep;
      }
    }

    this.ammo = bounded(0, this.ammo, this.maxAmmo);
    this.control = bounded(0, this.control, this.maxControl);
    this.rudder = bounded(0, this.rudder, this.maxRudder);
  }

  draw(ctx) {
    ctx.strokeStyle = "#222"
    ctx.fillStyle = colorDict["red"];
    let pad = 20;
    let x = pad;
    let w = 20;
    let maxH = 150
    let h = lerp(0, maxH, this.ammo/this.maxAmmo)
    ctx.fillRect(x, SIZE - h - pad - w, w, h);
    ctx.strokeRect(x, SIZE - maxH - pad - w, w, maxH);
    
    ctx.drawImage(imgs.right_cannon, x-w/2, SIZE - pad - w, w*2, w*2)

    x += w + pad;
    ctx.fillStyle = colorDict["blue"];
    h = lerp(0, maxH, this.control/this.maxControl)
    ctx.fillRect(x, SIZE - h - pad - w, w, h);
    ctx.strokeRect(x, SIZE - maxH - pad - w, w, maxH);

    ctx.drawImage(imgs.shield, x-w/2, SIZE - pad - w, w*2, w*2)

    x += w + pad;
    ctx.fillStyle = colorDict["green"]
    h = lerp(0, maxH, this.rudder/this.maxRudder)
    ctx.fillRect(x, SIZE - h - pad - w, w, h);
    ctx.strokeRect(x, SIZE - maxH - pad - w, w, maxH);

    ctx.drawImage(imgs.turn, x-w/2, SIZE - pad - w, w*2, w*2)

  }

}