
import { imgs } from "./load"
import { SIZE, MAPW, getEl } from "./globals"
import { diceManager } from "./main"

export class Island {
  constructor(y=-2000) {
    this.y = y;
  }

  draw(ctx) {
    let w = MAPW;
    let h = w / 2;
    ctx.drawImage(imgs.island, -SIZE, this.y-h + 100, w, h);
  }

  drawPreviousIsland(ctx) {
    let w = MAPW;
    let h = w / 2;
    ctx.drawImage(imgs.island, -SIZE, -20, w, h);
  }
}

getEl("reRollControlModifiers").addEventListener("click", () => {
    diceManager.reRollControlModifiers()
})

getEl("reRollAbilities").addEventListener("click", () => {
    diceManager.reRollAbilities()
})