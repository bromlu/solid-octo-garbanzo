import GameState from "./state"
import { SIZE, getEl, canvas, LINEWIDTH } from "./globals"
import { setUpInputs } from './inputs';
import { Particles } from "./particles"
import { Dice } from "./dice"
const ctx = canvas.getContext("2d")
canvas.width = SIZE
canvas.height = SIZE

let dice1Faces = ["1","2","3","4","5","6"]
let dice = new Dice(dice1Faces)
let dice2 = new Dice(dice1Faces)
function init(){
  ctx.lineWidth = LINEWIDTH;
  // dice.draw(ctx);

  startGame()
}


// game loop in state.js
window.gameState = new GameState()
setUpInputs()
init();

function startGame() {
  gameState.setState(GameState.GAME, gameUpdate, gameDraw)

  dice.roll(Math.floor(Math.random() * 6), 2000)
  dice2.roll(Math.floor(Math.random() * 6), 1500)
  setTimeout(() => {
    dice.roll(Math.floor(Math.random() * 6), 1800)
    dice2.roll(Math.floor(Math.random() * 6), 2000)
    console.log('rolled')
  }, 5000)
}

let a = true;
gameState.tick();
function gameDraw() {
  ctx.clearRect(0,0,SIZE,SIZE)
  ctx.fillStyle = "red";
  ctx.fillRect(0,0,50,50)
  dice.draw(ctx, 150, 150);
  dice2.draw(ctx, 250, 150);
  if (a) {
    a = false;
    console.log(dice)
  }
  Particles.draw(ctx)
}

function gameUpdate() {
  Particles.update()
}