import GameState from "./state"
import { SIZE, getEl, canvas, LINEWIDTH, MAPW } from "./globals"
import { setUpInputs, keys } from './inputs';
import { Particles } from "./particles"
import { Dice } from "./dice"
import DiceManager from "./dice-manager"
import { preloadImages, doneLoadingImgs, imgs } from "./load";
import { Player } from "./player";
import { Camera } from "./camera.js";
import { Spawner } from './spawner'

import { Enemy } from './enemy';
import { RandomMovementAI, PatrolAI, TargettingAI } from './AI'
import { CollisionManager } from "./collisions";

const ctx = canvas.getContext("2d")
canvas.width = SIZE
canvas.height = SIZE

export const diceManager = new DiceManager()
const collisionManager = new CollisionManager()

export const player = new Player();
const spawner = new Spawner();
export const camera = new Camera();
window.camera = camera;
export const enemies = [];
export const enemyBullets = [];

function init() {
  ctx.lineWidth = LINEWIDTH;
  preloadImages()
  setUpInputs()
  
  camera.setTarget(player)
  
  let loadImgInterval = setInterval(() => {
    if (doneLoadingImgs()) {
      diceManager.addSpecialAbilityDice();
      diceManager.addStandardDice();
      diceManager.addStandardDice();
      diceManager.addStandardDice();
      diceManager.addStandardDice();
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
  spawner.addLevel1Spawns()
  // spawner.addEnemy(new Enemy(0, -400, new RandomMovementAI(1000)))

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
  // ctx.save();

  camera.moveCtx(ctx);
  let mapIdx = Math.floor(camera.y / MAPW);
  ctx.drawImage(imgs.map, -SIZE, mapIdx*MAPW, MAPW, MAPW)
  ctx.drawImage(imgs.map, -SIZE, (mapIdx+1)*MAPW, MAPW, MAPW)

  Particles.draw(ctx)
  player.draw(ctx);
  enemies.forEach(enemy => {
    enemy.draw(ctx);
  });

  enemyBullets.forEach(bullet => {
    if (!bullet.sunk) bullet.draw(ctx);
  });

  diceManager.drawBar(ctx);
  // ctx.restore();
  ctx.resetTransform();
  diceManager.draw(ctx)
}

function gameUpdate() {
  Particles.update()
  player.update();
  spawner.update();
  enemies.forEach(enemy => {
    enemy.update();
  });

  for (let i = 0; i < enemyBullets.length; i++) {
    let bullet = enemyBullets[i];
    if (bullet.sunk) enemyBullets.splice(i--, 1);
    else bullet.update();
  }

  diceManager.update();
  
  camera.update();

  collisionManager.update();
}
