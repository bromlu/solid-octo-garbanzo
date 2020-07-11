
import { imgs } from "./load"
import { SIZE, MAPW, getEl } from "./globals"
import { diceManager } from "./main"

export class Island {
  constructor(y=-6000) {
    this.y = y;
  }

  draw(ctx) {
    let w = MAPW;
    let h = w / 2;
    ctx.drawImage(imgs.island, -SIZE, this.y-h, w, h);
  }

  drawPreviousIsland(ctx) {
    let w = MAPW;
    let h = w / 2;
    ctx.drawImage(imgs.island, -SIZE, 0, w, h);
  }
}

getEl("reRollControlModifiers").addEventListener("click", () => {
    diceManager.reRollControlModifiers()
})

getEl("reRollAbilities").addEventListener("click", () => {
    diceManager.reRollAbilities()
})