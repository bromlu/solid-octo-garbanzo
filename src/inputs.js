import { diceManager, gameState, gameUpdate, gameDraw, resetLevel, startGame, initLevel2 } from "./main";
import GameState from "./state"
import { getEl, canvas } from "./globals";
import { doneLoadingResrcs } from "./load"

export const keys = {}
export const cursor = { x: -1, y: -1 }

export const K_ESC = 27
export const MLEFT = 0
export const MRIGHT = 2
export const W = 87
export const A = 65
export const S = 83
export const D = 68
export const LEFT = 37
export const UP = 38
export const RIGHT = 39
export const DOWN = 40
export const SPACE = 32

export function setUpInputs() {
    window.addEventListener("keydown", e => {
        let k = e.keyCode
        if (keys[k] == true) return;
        keys[k] = true

    })
    window.addEventListener("keyup", e => {
        let k = e.keyCode
        keys[k] = false
    })

    canvas.addEventListener("mousedown", e => {
        e.preventDefault()

        let k = e.button
        keys[k] = true
        // left click actions here

    })
    canvas.addEventListener("mouseup", e => {
        let k = e.button
        keys[k] = false
    })

    canvas.addEventListener("mousemove", e => {
        cursor.x = Math.round(e.offsetX * canvas.width / canvas.clientWidth)
        cursor.y = Math.round(e.offsetY * canvas.height / canvas.clientHeight)

    })

    canvas.addEventListener("contextmenu", e => {
        e.preventDefault()
    })
}

getEl("continueBtn").addEventListener("click", () => {
    gameState.setState(GameState.GAME, gameUpdate, gameDraw)
    getEl("continueBtn").disabled = true;
})

getEl("playBtn").addEventListener("click", () => {
    if (doneLoadingResrcs()) startGame();
})

getEl("credBtn").addEventListener("click", () => {
    if (gameState.state == GameState.MENU) {
        gameState.setState(GameState.CRED, () => {}, () => {});
    }
})