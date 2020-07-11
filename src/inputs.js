import { diceManager } from "./main";
export const keys = {}

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

export function setUpInputs() {
    window.addEventListener("keydown", e => {
        let k = e.keyCode
        if (keys[k] == true && k !== 32) return;
        keys[k] = true
        if (k == 32) {
            diceManager.increaseForce()
        }

    })
    window.addEventListener("keyup", e => {
        let k = e.keyCode
        keys[k] = false
        if (k == 32) {
            diceManager.rollAll();
        }
    })

    window.addEventListener("mousedown", e => {
        e.preventDefault()

        let k = e.button
        keys[k] = true
        if (k != MLEFT) return //only left click
        // left click actions here
        
    })
    window.addEventListener("mouseup", e => {
        let k = e.button
        keys[k] = false
    })
    window.addEventListener("mousemove", e => {
        let k = e.button
        if (keys[k] == true) return;
        keys[k] = true
    })

    canvas.addEventListener("contextmenu", e => {
        e.preventDefault()
    })
}