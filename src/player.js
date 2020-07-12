import { TAU, SIZE, bounded, lerp, enemyTypes } from "./globals";
import { imgs, sounds } from "./load"
import { keys, UP, LEFT, RIGHT, SPACE, A, D, W } from "./inputs"
import { diceManager, playerBullets, enemies, resourceManager, gameState, resetGame } from "./main";
import { Bullet } from "./bullet";
import Animation, { playerShipFrames, shieldFrames } from "./animation";
import GameState from "./state";


export class Player {
  constructor() {
    this.x = 0; // middle of player (right pixel)
    this.y = 0;  // bottom of player
    this.theta = 0; //0 theta means facing up
    this.r = 16;
    this.a = 0;
    this.aTheta = 0;
    this.v = 10;
    this.vTheta = 0;

    this.forceTheta = .02;
    this.force = 1;
    this.forceStuck = false;

    this.friction = .9
    this.frictionTheta = .8

    this.hurtTimer = 0;

    this.chargingSpecial = false;
    this.bulletV = 30;

    this.afterImages = [];
    this.lastDash = 0;

    this.forwardEnd = 0;

    this.message = ""
    this.lastMessageInst = 0;

    this.shield = false;
    this.shieldInst = 0;

    this.sinkInst = 0
    this.sinking = false;
  }

  reset() {
    this.x = 0;
    this.y = 0;
    this.theta = 0;
    this.a = 0;
    this.aTheta = 0;
    this.v = 10;
    this.vTheta = 0;
    this.forceTheta = .02;
    this.force = 1;
    this.forceStuck = false;
    this.friction = .9
    this.frictionTheta = .8
    this.hurtTimer = 0;
    this.chargingSpecial = false;
    this.bulletV = 30;
    this.afterImages = [];
    this.lastDash = 0;
    this.message = "";
    this.lastMessageInst = 0;
    this.shield = false;
    this.shieldInst = 0;
    this.sinkInst = 0;
    this.sinking = false;

    this.invincibleEnd = 0;
  }

  setAnimations() {
    let frameSelector = Animation.getLoopingFrameSelector(1000, 2)
    this.moveAnimation = new Animation(imgs.boat, playerShipFrames, frameSelector)

    this.stillAnimation = new Animation(imgs.boat, playerShipFrames, t => 0)
    this.turnAnimation = new Animation(imgs.boat, playerShipFrames, t => 2)
    this.shieldAnimation = new Animation(imgs.forcefield, shieldFrames, Animation.getLoopingFrameSelector(500, 2))
  }

  draw(ctx) {
    ctx.save();
    let x = this.x;
    let y = this.y;
    let theta = this.theta;
    ctx.translate(x, y);
    ctx.rotate(this.theta);

    if (this.sinking) {
      ctx.scale(.4,.4);
      ctx.drawImage(imgs.brokenPlayer, -163/2, -235/2)
      ctx.restore();
      return;
    }

    // ctx.beginPath()
    // ctx.arc(0, 0, this.r, 0, TAU);
    // ctx.closePath()
    // ctx.fill();
    let invince = this.invincibleEnd > Date.now()
    if (invince) {
      ctx.globalAlpha = .5 + .5 * Math.sin(Date.now())
    }
    if (this.v > 2) {
      this.moveAnimation.draw(ctx, 0, 0, false, .4);
    } else if (this.vTheta > .07) { 
      this.turnAnimation.draw(ctx, 0, 0, true, .4);
    } else if (this.vTheta < -.07) { 
      this.turnAnimation.draw(ctx, 0, 0, false, .4);
    } else {
      this.stillAnimation.draw(ctx, 0, 0, false, .4);
    }
    
    if (this.shield) {
      this.shieldAnimation.draw(ctx, 0, 0, false, .5);
    }
    
    ctx.restore();
    if(this.isDashing()) {
      for (let i = 0; i < this.afterImages.length; i+= 2) {
        let afterimg = this.afterImages[i]
        ctx.save();
        ctx.translate(afterimg.x, afterimg.y);
        ctx.rotate(afterimg.theta);
        ctx.globalAlpha = .3;
        this.moveAnimation.draw(ctx, 0, 0, false, .4);
        ctx.globalAlpha = 1;
        ctx.restore();
      }
      this.afterImages.push({x, y, theta})
    }

}

  update() {
    // if (!diceManager.rolling) {
    //   if (keys[SPACE]) {
    //     this.chargingSpecial = true;
    //   } else if (this.chargingSpecial) {
    //     this.fireSpecial(diceManager.getBoundedForce())
    //     diceManager.rollAll();
    //     this.chargingSpecial = false
    //   }
    // }
    if (this.sinking) {
      if (Date.now() > this.sinkInst) {
        gameState.setState(GameState.MENU, () => {}, () => {});
        resetGame();
      }
      return;
    }

    if (this.shield) {
      this.r = 32
      if (Date.now() - this.shieldInst > 500) {
        resourceManager.useControl()
        if (resourceManager.control <= 0) {
          this.shield = false;
        }
      }
    }
    else this.r = 16

    this.v *= this.friction;
    this.vTheta *= this.frictionTheta;
    if (Math.abs(this.v) < .01) this.v = 0;
    if (Math.abs(this.vTheta) < .01) this.vTheta = 0;

    if (this.forwardEnd > Date.now()) {
      this.a = this.force;
    } else this.a = 0;
    this.v += this.a;
    if (this.forceStuck & Math.random() < .1) this.force = Math.random() * 3


    if (keys[A] && resourceManager.rudder > 0) {
      this.aTheta = -this.forceTheta;
      resourceManager.useRudder()
    } else if (keys[D] && resourceManager.rudder > 0) {
      this.aTheta = this.forceTheta;
      resourceManager.useRudder()
    } else this.aTheta = 0;
    
    this.vTheta += this.aTheta;
    this.theta += this.vTheta;

    // if (this.theta < -TAU/4) {
    //   this.theta = -TAU/4;
    //   this.vTheta = 0;
    //   if (this.aTheta) resourceManager.rudder++
    // } else if (this.theta > TAU/4) {
    //   this.theta = TAU/4;
    //   this.vTheta = 0;
    //   if (this.aTheta) resourceManager.rudder++
    // }

    this.x += this.v * Math.sin(this.theta);
    this.y -= this.v * Math.cos(this.theta);
    if (this.y > 0) this.y = 0;
    this.x = bounded(-SIZE, this.x, SIZE);
  }

  startForward() {
    this.forwardEnd = Date.now() + 2000;
    if (Math.random() < .4) this.showMessage("Onward!")
  }

  startDash() {
    this.v += 45;
    this.lastDash = Date.now();
    this.afterImages = [];

    if (Math.random() < .4) this.showMessage("Full steam ahead!")

    sounds.dash.volume = 0.2;
    sounds.dash.currentTime = 0;
    sounds.dash.play();
  }

  shootRight() {
    let n = Math.ceil(resourceManager.ammo);
    if (n > 5) n = 5;
    if (n == 0) { console.log("no ammo"); return;}
    resourceManager.useAmmo(n);

    sounds.shoot.volume = 0.02;
    sounds.shoot.currentTime = 0;
    sounds.shoot.play();

    let spread = Math.PI / 2;
    for (let i = 0; i < n; i++) {
      let dir = this.theta + Math.PI / 2 - spread / 2 + ((i + 1) * (spread / (n + 2)))
      let xv = Math.sin(dir) * this.bulletV;
      let yv = -Math.cos(dir) * this.bulletV;
      playerBullets.push(new Bullet(this.x, this.y, xv, yv, false))
    }
  }

  shootLeft() {
    // let n = Math.floor(lerp(1, 4, frac));
    let n = Math.ceil(resourceManager.ammo);
    if (n > 5) n = 5;
    resourceManager.useAmmo(n);

    if (n == 0) { console.log("no ammo"); return;}

    sounds.shoot.volume = 0.02;
    sounds.shoot.currentTime = 0;
    sounds.shoot.play();

    let spread = Math.PI / 2;
    for (let i = 0; i < n; i++) {
      let dir = this.theta - Math.PI / 2 - spread / 2 + ((i + 1) * (spread / (n + 2)))
      let xv = Math.sin(dir) * this.bulletV;
      let yv = -Math.cos(dir) * this.bulletV;
      playerBullets.push(new Bullet(this.x, this.y, xv, yv, false))
    }
  }

  // fireSpecial(diceForce) {
  //   let frac = diceForce / diceManager.maxForce // 0 to 1
  //   if (diceManager.allDice[0].face == "Dash") {
     
  //   } else if (diceManager.allDice[0].face == "Fire") {
  //     let n = Math.floor(lerp(1, 4, frac));
  //     let spread = Math.PI / 2;
  //     for (let i = 0; i < n; i++) {
  //       let dir = this.theta + Math.PI / 2 - spread / 2 + ((i + 1) * (spread / (n + 2)))
  //       let xv = Math.sin(dir) * this.bulletV;
  //       let yv = -Math.cos(dir) * this.bulletV;
  //       playerBullets.push(new Bullet(this.x, this.y, xv, yv, 500))
  //     }
  //     for (let i = 0; i < n; i++) {
  //       let dir = this.theta - Math.PI / 2 - spread / 2 + ((i + 1) * (spread / (n + 2)))
  //       let xv = Math.sin(dir) * this.bulletV;
  //       let yv = -Math.cos(dir) * this.bulletV;
  //       playerBullets.push(new Bullet(this.x, this.y, xv, yv, 500))
  //     }
  //   }
  // }

  handleCollision(objectThatHitMe) {
    if (objectThatHitMe && objectThatHitMe.type === enemyTypes.seaweed) {
      this.force = 0.5;
      setTimeout(() => { this.force = 1 }, 500);
      return;
    }
    if (this.shield && sounds.shield.currentTime == 0 || sounds.shield.currentTime > 1) {
      sounds.shield.currentTime = 0;
      sounds.shield.volume = 0.09;
      sounds.shield.play();
      return;
    }
    if (this.invincibleEnd > Date.now()) return;
    this.invincibleEnd = Date.now() + 1000;
    sounds.hit.volume = 0.05;
    sounds.hit.currentTime = 0.85;
    sounds.hit.play();
    console.log("hit")
    this.chargingSpecial = false;
    
    // if (!diceManager.rolling) 
    diceManager.loseFace();

    if (Date.now() - this.lastMessageInst > 2000 && Math.random() < .4) {
      this.showHurtMessage();
    }
  }

  isDashing() {
    return this.v > 15 && Date.now() - this.lastDash < 1000
  }

  // resolveDiceRoll() {
  //   if (diceManager.allDice[1]) this.resolveForceDice(diceManager.allDice[1].face);
  // }

  shieldUp() {
    this.shield = true;
    this.shieldInst = Date.now();
  }

  showHurtMessage() {
    this.showMessage(hurtMsgs[Math.floor(Math.random()*hurtMsgs.length)])
  }

  showMessage(msg, important) { 
    if (!important && Date.now() - this.lastMessageInst < 2000) {
      return;
    }
    if (typeof msg == "string") this.message = msg;
    else msg = msg[Math.floor(Math.random()*msg.length)];
    this.message = msg;
    this.lastMessageInst = Date.now();
  }
  
  drawMessage(ctx) {
    let elapsed = Date.now() - this.lastMessageInst;
    if (elapsed > 1500) return;
    ctx.font = "30px Grenze Gotisch";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    let tm = ctx.measureText(this.message);
    let w = tm.width + 30;
    let h = 30 + 30;
    let x = this.x
    let y = this.y - h;

    ctx.globalAlpha = 1 - (elapsed / 1500)
    ctx.drawImage(imgs.text, x - w/2, y - h/2, w, h);
    ctx.fillStyle = "#222"
    ctx.fillText(this.message, x, y);
    ctx.globalAlpha = 1
  }
}

const hurtMsgs = [
  "We've been hit!",
  "We're going down!",
  "We're going down!",
]
