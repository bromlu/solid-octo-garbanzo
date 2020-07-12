
export let loaded = 0;
const imgSources = {
  player: "/assets/player.png",
  map: "/assets/ocean.png",
  enemyBoat: "/assets/Enemy_Boat_Movement.png",
  dash: "/assets/dash.png",
  island: "/assets/island.png",
  manta: "/assets/Manta_Ray.png",
  boat: "/assets/Boat_Movement.png",
  bullet: "/assets/Cannonballs.png",
  splash: "/assets/splash.png",
  red: "/assets/red_face.png",
  blue: "/assets/blue_face.png",
  green: "/assets/green_face.png",
  grey: "/assets/grey_face.png",
  forward: "/assets/forward_icon.png",
  dash: "/assets/dash_icon.png",
  shield: "/assets/shield_icon.png",
  left_cannon: "/assets/left_cannon_icon.png",
  right_cannon: "/assets/right_cannon_icon.png",
  kraken: "/assets/Tentacle.png"
}

const audioSources = {
  clunk: "/assets/clunk.mp3",
}
export const imgs = {}
export const sounds = {}

export function preloadAssets() {
  for (let key in imgSources) {
    imgs[key] = new Image()
    imgs[key].src = imgSources[key]
    imgs[key].onload = onResrcLoad
  }

  for (let key in audioSources) {
    sounds[key] = new Audio(audioSources[key])
    sounds[key].onloadeddata = onResrcLoad
  }
}
window.sounds = sounds;

export const doneLoadingResrcs = () => loaded == Object.keys(imgSources).length + Object.keys(audioSources).length

const onResrcLoad = () => {loaded++; console.log("loaded")}