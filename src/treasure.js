import { getEl } from "./globals"
import { imgs } from "./load"
import { Dice } from "./dice";
import { levelDices } from "./dice-manager";
import { diceManager, currentLevel } from "./main";



const tCanvas = getEl("treasureCanvas");
const tctx = tCanvas.getContext("2d");

export function playTreasureAnimation(idx = 0) {
  const timgs = [
    imgs.treasure1,
    imgs.treasure2,
    imgs.treasure3,
    imgs.treasure4,
    imgs.treasure5,
  ]
  tctx.drawImage(timgs[idx], 0, 0, 500, 500)
  tctx.drawImage(timgs[idx], 0, 0, 500, 500)
  if (idx == 4) {
    let dice = new Dice(["1", "2", "3", "4", "5", "6"], ["grey", "grey", "grey", "grey", "grey", "grey"])
    let ld = levelDices[currentLevel - 1]
    dice.mapFaces(ld.faces, ld.colors)
    dice.draw(tctx, 0, 0)
    dice.rotXTarget = Math.PI / 4;
    dice.rotYTarget = Math.PI / 4;
    dice.draw(tctx, 500/3, 500/3)

    dice.rotXTarget = Math.PI / 4 + Math.PI* 2;
    dice.rotYTarget = Math.PI / 4 + Math.PI;
    dice.draw(tctx, 500/3*2, 500/3)
    // console.log(dice)
    // diceManager.allDice[0].draw(tctx, 200, 100)
    console.log(dice)
    
    getEl("continueBtn").disabled = false
    getEl("welcome-msg").innerText = "You found a new dice!";
    return;
  }
  setTimeout(() => playTreasureAnimation(idx+1), 500)
}