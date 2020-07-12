
export var loaded = 0;
const imgSources = {
  map: "./assets/ocean.png",
  enemyBoat: "./assets/Enemy_Boat_Movement.png",
  island: "./assets/island.png",
  manta: "./assets/Manta_Ray.png",
  boat: "./assets/Boat_Movement.png",
  bullet: "./assets/Cannonballs.png",
  enemyBullet: "./assets/Monster_Attacks.png",
  splash: "./assets/splash.png",
  red: "./assets/red_face.png",
  blue: "./assets/blue_face.png",
  green: "./assets/green_face.png",
  grey: "./assets/grey_face.png",
  forward: "./assets/forward_icon.png",
  dash: "./assets/dash_icon.png",
  shield: "./assets/shield_icon.png",
  left_cannon: "./assets/left_cannon_icon.png",
  right_cannon: "./assets/right_cannon_icon.png",
  kraken: "./assets/Tentacle.png",
  text: "./assets/Text_Bubble.png",
  rock: "./assets/Rocks.png",
  forcefield: "./assets/shield.png",
  brokenEnemy: "./assets/Broken_Enemy_Boat.png",
  brokenPlayer: "./assets/Broken_Player_Boats.png",
  treasure1: "./assets/treasure_chest/treasure_chest1.png",
  treasure2: "./assets/treasure_chest/treasure_chest2.PNG",
  treasure3: "./assets/treasure_chest/treasure_chest3.PNG",
  treasure4: "./assets/treasure_chest/treasure_chest4.PNG",
  treasure5: "./assets/treasure_chest/treasure_chest5.PNG",
  seaweed: "./assets/Seaweed.png",
  turn: "./assets/turn_icon.png",
}

const audioSources = {
  clunk: "./assets/clunk.mp3",
  dash: "./assets/dash.mp3",
  enemy_attack: "./assets/enemy_attack.mp3",
  hit: "./assets/hit.mp3",
  ocean_ambient: "./assets/ocean_ambient.mp3",
  shoot: "./assets/shoot.mp3",
  splash: "./assets/splash.mp3",
  music: "./assets/music_chill.mp3",
  shield: "./assets/force_field_short.mp3"
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

export const doneLoadingResrcs = () => {
  return loaded == Object.keys(imgSources).length + Object.keys(audioSources).length
}

const onResrcLoad = () => { loaded++; console.log("loaded", loaded) }