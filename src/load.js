
export let loaded = 0;
const sources = {
  player: "/assets/player.png",
  map: "/assets/ocean.png"
}
export const imgs = {}

export function preloadImages() {
  for (let key in sources) {
    imgs[key] = new Image()
    imgs[key].src = sources[key]
    imgs[key].onload = onImageLoad
  }
}

export const doneLoadingImgs = () => loaded == Object.keys(sources).length

const onImageLoad = () => {loaded++}