import GameState from "./state"
import { SIZE, getEl, canvas, LINEWIDTH, MAPW } from "./globals"
import { setUpInputs } from './inputs';
import { Particles } from "./particles"
import { Dice } from "./dice"
import DiceManager from "./dice-manager"
import { preloadImages, doneLoadingImgs, imgs } from "./load";
import { Player } from "./player";
import { Camera } from "./camera.js";
const ctx = canvas.getContext("2d")
canvas.width = SIZE
canvas.height = SIZE

export const diceManager = new DiceManager()
diceManager.addStandardDice();
diceManager.addStandardDice();
diceManager.addStandardDice();
diceManager.addStandardDice();

const player = new Player();
window.camera = new Camera();
function init() {
  ctx.lineWidth = LINEWIDTH;
  preloadImages()
  setUpInputs()

  camera.setTarget(player)

  let loadImgInterval = setInterval(() => {
    if (doneLoadingImgs()) {
      console.log(imgs)
      clearInterval(loadImgInterval);
      startGame()
    }
  }, 100)
}


// game loop in state.js
window.gameState = new GameState()

init();

function startGame() {
  gameState.setState(GameState.GAME, gameUpdate, gameDraw)

  // dice.roll(Math.floor(Math.random() * 6), 2000)
  // dice2.roll(Math.floor(Math.random() * 6), 1500)
  // setTimeout(() => {
  //   dice.roll(Math.floor(Math.random() * 6), 1800)
  //   dice2.roll(Math.floor(Math.random() * 6), 2000)
  //   console.log('rolled')
  // }, 5000)
}

gameState.tick();

function gameDraw() {
  ctx.clearRect(0,0,SIZE,SIZE)
  ctx.save();

  camera.moveCtx(ctx);
  let mapIdx = Math.floor(camera.y / MAPW);
  ctx.drawImage(imgs.map, -SIZE, mapIdx*MAPW, MAPW, MAPW)
  ctx.drawImage(imgs.map, -SIZE, (mapIdx+1)*MAPW, MAPW, MAPW)

  Particles.draw(ctx)
  player.draw(ctx);
  ctx.restore();

  diceManager.draw(ctx)
}

function gameUpdate() {
  Particles.update()
  player.update();
  camera.update();
}