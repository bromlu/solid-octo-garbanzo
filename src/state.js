import { getEl, canvas } from "./globals"
export default class GameState {
  constructor() {
    this.state = 0
    this.update = ()=>{}
    this.draw = ()=>{}
  }
  static get MENU() {return 0}
  static get ISLAND() {return 1}
  static get GAME() {return 2}
  static get CRED() {return 3}

  inState(num) {
    return this.state == num
  }

  setState(num, update, draw) {
    console.log(num, divDict[num])
    if (this.inState(num)) return
    this.state = num
    this.update = update
    this.draw = draw
    hideOuterDivs()
    divDict[num].classList.remove("nodisplay")
  }


  tick() {
    let current = Date.now();
    let elapsed = current - lastTime;
    lastTime = current;
    lag += elapsed;
    while (lag >= MS_PER_UPDATE) {
      this.update();
      lag -= MS_PER_UPDATE;
    }
    this.draw();
    requestAnimationFrame(this.tick.bind(this));
  }
}

const divDict = {}

divDict[GameState.GAME] = canvas
divDict[GameState.ISLAND] = getEl("diceMenu")
divDict[GameState.MENU] = getEl("menuDiv")
divDict[GameState.CRED] = getEl("credDiv")


const body = getEl("body")
export function hideOuterDivs() {
  divDict[GameState.GAME].classList.add("nodisplay")
  divDict[GameState.ISLAND].classList.add("nodisplay")
  divDict[GameState.MENU].classList.add("nodisplay")
  divDict[GameState.CRED].classList.add("nodisplay")
}

const UPDATES_PER_SEC = 30;
const MS_PER_UPDATE = 1000 / UPDATES_PER_SEC;
var lastTime = Date.now();
var lag = 0;
