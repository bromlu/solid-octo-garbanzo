import GameState, {hideOuterDivs} from "./state"
import { SIZE, getEl, canvas, LINEWIDTH, MAPW } from "./globals"
import { setUpInputs, keys, cursor } from './inputs';
import { Particles } from "./particles"
import DiceManager from "./dice-manager"
import { preloadAssets, doneLoadingResrcs, imgs } from "./load";
import { Player } from "./player";
import { Camera } from "./camera.js";
import { Spawner } from './spawner'
import { CollisionManager } from "./collisions";
import { Island } from "./island"
import { TextParticles } from "./particles"
import { ResourceManager } from "./resource"
import { sounds } from "./load";
import { playTreasureAnimation } from "./treasure"

const ctx = canvas.getContext("2d")
canvas.width = SIZE
canvas.height = SIZE

export const diceManager = new DiceManager()
window.diceManager = diceManager;
const collisionManager = new CollisionManager()

export const player = new Player();
window.player = player;
const spawner = new Spawner();
window.spawner = spawner;
export const camera = new Camera();
window.camera = camera;
export const enemies = [];
window.enemies = enemies;
export const obstacles = [];
window.obstacles = obstacles;
export const enemyBullets = [];
export const playerBullets = [];
export const island = new Island();
export const textParticles = new TextParticles();
export const resourceManager = new ResourceManager();
export let currentLevel = 1;

export let lastKeys = {};

function init() {
  gameState.setState(GameState.MENU, () => {}, () => {});
  hideOuterDivs();
  getEl("menuDiv").classList.remove("nodisplay")
  ctx.lineWidth = LINEWIDTH;
  preloadAssets()
  setUpInputs()
  
  camera.setTarget(player)
  
  let loadImgInterval = setInterval(() => {
    if (doneLoadingResrcs()) {
      console.log("READY")
      getEl("playBtn").disabled = false;
      console.log(getEl("playBtn"))
      player.setAnimations();
      // diceManager.addSpecialAbilityDice();
      // diceManager.addStandardDice();
      // diceManager.addStandardDice();
      // diceManager.addStandardDice();
      // diceManager.addStandardDice();
      diceManager.addDiceForLevel(1);
      console.log(imgs)
      clearInterval(loadImgInterval);

      sounds.ocean_ambient.loop = true;
      sounds.ocean_ambient.volume = 0.05;
      sounds.ocean_ambient.play();
      sounds.music.loop = true;
      sounds.music.volume = 0.2;
      sounds.music.play();
    }
  }, 100)
}


// game loop in state.js
export const gameState = new GameState();
window.gameState = gameState;

init();

export function startGame() {
  gameState.setState(GameState.GAME, gameUpdate, gameDraw)
  spawner.addLevel1Spawns();
  diceManager.rollAll()
  sounds.ocean_ambient.pause()

  setTimeout(() => player.showMessage("<A   D>", true), 500)
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
  enemies.forEach(enemy => {
    if (!enemy.sunk) enemy.draw(ctx);
  });
  obstacles.forEach(obstacle => {
    if (!obstacle.sunk) obstacle.draw(ctx);
  });
  player.draw(ctx);

  enemyBullets.forEach(bullet => {
    if (!bullet.sunk) bullet.draw(ctx);
  });
  playerBullets.forEach(bullet => {
    if (!bullet.sunk) bullet.draw(ctx);
  });
  // diceManager.drawBar(ctx);

  player.drawMessage(ctx);
  ctx.resetTransform();
  diceManager.draw(ctx)
  resourceManager.draw(ctx);
  textParticles.draw(ctx);
}

export function gameUpdate() {
  Particles.update()
  player.update();
  if (player.y < island.y) {
    if (currentLevel >= 4) {
      console.log("done")
      gameState.setState(GameState.CRED, () => {}, () => {});
      resetGame()
      return;
    }
    setTimeout(() => setupLevel(), 0);
    gameState.setState(GameState.ISLAND, () => {}, () => {});
    playTreasureAnimation()
    sounds.ocean_ambient.play();
    // diceManager.setDiceFacesInHtml()
  }
  spawner.update();
  for (let i = 0; i < enemies.length; i++) {
    let enemy = enemies[i];
    if (enemy.sunk) enemies.splice(i--, 1);
    else enemy.update();
  }
  for (let i = 0; i < obstacles.length; i++) {
    let obstacle = obstacles[i];
    if (obstacle.sunk) obstacles.splice(i--, 1);
    else obstacle.update();
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
  textParticles.update();
  lastKeys = JSON.parse(JSON.stringify(keys));

  collisionManager.update();
}

export function setupLevel() {
  resourceManager.ammo = resourceManager.maxAmmo;
  resourceManager.control = resourceManager.maxControl;
  resourceManager.rudder = resourceManager.maxRudder;
  console.log("asdf")
  player.reset()
  enemyBullets.length = 0
  playerBullets.length = 0
  enemies.length = 0
  obstacles.length = 0
  camera.yAnchor = 0;
  currentLevel++;
  island.y -= 1000
  spawner.addSpawnsForLevel(currentLevel)
  diceManager.resetDice();
  diceManager.addDiceForLevel(currentLevel)
  diceManager.rollAll();
  console.log(currentLevel, spawner.enemiesToSpawn)
}

export function resetGame() {
  currentLevel = 0;
  diceManager.resetDice();
  // let goners = document.getElementsByClassName("gone");
  // goners.forEach(element => {
    //   element.parentNode.removeChild(element)
    // });
  diceManager.allDice = [];
  setupLevel();
}
