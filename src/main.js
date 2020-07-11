import GameState from "./state"
import { SIZE, getEl, canvas, LINEWIDTH, MAPW } from "./globals"
import { setUpInputs, keys } from './inputs';
import { Particles } from "./particles"
import { Dice } from "./dice"
import DiceManager from "./dice-manager"
import { preloadAssets, doneLoadingResrcs, imgs } from "./load";
import { Player } from "./player";
import { Camera } from "./camera.js";
import { Spawner } from './spawner'
import { Enemy } from './enemy';
import { RandomMovementAI, PatrolAI, TargettingAI } from './AI'
import { CollisionManager } from "./collisions";
import { Island } from "./island"

export const audCtx = new AudioContext();
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
export const playerBullets = [];
export const island = new Island();
export const currentLevel = 1;

function init() {
  ctx.lineWidth = LINEWIDTH;
  preloadAssets()
  setUpInputs()
  
  camera.setTarget(player)
  
  let loadImgInterval = setInterval(() => {
    if (doneLoadingResrcs()) {
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
export const gameState = new GameState();
window.gameState = gameState;

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

export function gameDraw() {
  ctx.clearRect(0,0,SIZE,SIZE)
  // ctx.save();

  camera.moveCtx(ctx);
  let mapIdx = Math.floor(camera.y / MAPW);
  ctx.drawImage(imgs.map, -SIZE, mapIdx*MAPW, MAPW, MAPW)
  ctx.drawImage(imgs.map, -SIZE, (mapIdx+1)*MAPW, MAPW, MAPW)
  if (camera.yAnchor < island.y + SIZE) {
    island.draw(ctx);
  }
  if (camera.yAnchor > -SIZE) {
    island.drawPreviousIsland(ctx);
  }


  Particles.draw(ctx)
  player.draw(ctx);
  enemies.forEach(enemy => {
    if (!enemy.sunk) enemy.draw(ctx);
  });

  enemyBullets.forEach(bullet => {
    if (!bullet.sunk) bullet.draw(ctx);
  });
  playerBullets.forEach(bullet => {
    if (!bullet.sunk) bullet.draw(ctx);
  });
  diceManager.drawBar(ctx);
  // ctx.restore();
  ctx.resetTransform();
  diceManager.draw(ctx)
}

export function gameUpdate() {
  Particles.update()
  player.update();
  if (player.y < island.y) {
    setTimeout(() => resetLevel(), 0);
    gameState.setState(GameState.ISLAND, () => {}, () => {});
    diceManager.setDiceFacesInHtml()
  }
  spawner.update();
  for (let i = 0; i < enemies.length; i++) {
    let enemy = enemies[i];
    if (enemy.sunk) enemies.splice(i--, 1);
    else enemy.update();
  }

  for (let i = 0; i < enemyBullets.length; i++) {
    let bullet = enemyBullets[i];
    if (bullet.sunk) enemyBullets.splice(i--, 1);
    else bullet.update();
  }
  for (let i = 0; i < playerBullets.length; i++) {
    let bullet = playerBullets[i];
    if (bullet.sunk) playerBullets.splice(i--, 1);
    else bullet.update();
  }

  diceManager.update();
  
  camera.update();

  collisionManager.update();
}

export function resetLevel() {
  console.log("asdf")
  player.y = 0;
  player.v = 0;
  player.a = 0;
  enemyBullets.length = 0
  playerBullets.length = 0
  enemies.length = 0
  diceManager.resetDice();
  console.log(enemies)
  
}
