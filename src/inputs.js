const keys = {} //for debug 
const K_ESC = 27
const MLEFT = 0
const MRIGHT = 2

export function setUpInputs() {
    window.addEventListener("keydown", e => {
        let k = e.keyCode
        if (keys[k] == true) return;
        keys[k] = true
        if (k == K_ESC) {
            // Stuff here
        }
    })
    window.addEventListener("keyup", e => {
        let k = e.keyCode
        keys[k] = false
    })

    window.addEventListener("mousedown", e => {
        e.preventDefault()
        console.log(cursor)

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