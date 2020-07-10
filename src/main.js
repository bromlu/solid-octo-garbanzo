import GameState from "./state"
import { SIZE, getEl, canvas, LINEWIDTH } from "./globals"

const ctx = canvas.getContext("2d")
canvas.width = SIZE
canvas.height = SIZE

function init(){
  ctx.lineWidth = LINEWIDTH
}

setUpInputs()
init();

// game loop in state.js
window.gameState = new GameState()

function startGame() {
  gameState.setState(GameState.GAME, gameUpdate, gameDraw)
}

getEl("playBtn").addEventListener("click", startGame)
getEl("beginBtn").addEventListener("click", ()=>{
  gameState.setState(GameState.SCENE1, ()=>{},  ()=>{})
})
getEl("credBtn").addEventListener("click", ()=>{
  gameState.setState(GameState.CRED, ()=>{},  ()=>{})
})

gameState.tick();

function gameDraw() {
  ctx.clearRect(0,0,SIZE,SIZE)
}

function gameUpdate() {
}