
export let loaded = 0;
const imgSources = {
  player: "/assets/player.png",
  map: "/assets/ocean.png",
  enemy: "/assets/enemy.png",
  dash: "/assets/dash.png",
  island: "/assets/island.png",
  manta: "/assets/Manta_Ray.png",
  boat: "/assets/Boat_Movement.png",
  bullet: "/assets/Cannonballs.png",
  splash: "/assets/splash.png",
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