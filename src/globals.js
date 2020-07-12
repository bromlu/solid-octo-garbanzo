export const SIZE = 1000;
export const getEl = x => document.getElementById(x);
export const canvas = getEl("canvas");
export const LINEWIDTH = 4;
export const TAU = Math.PI*2;
export const MAPW = SIZE*2;

export const lerp = (a, b, frac) => a * (1-frac) + b * frac;
export const lerpBounded = (a, b, frac) => {
  frac = Math.max(0, Math.min(frac, 1));
  return lerp(a, b, frac);
}

export const randBell = (num, frac=.5) => {
  let radius = num * frac;
  return num + Math.random() * radius - Math.random() * radius;
}

export const bounded = (min, num, max) => Math.max(min, Math.min(max, num))

export const shuffle = (array) => {
  for(let i = array.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * i)
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
}

export const colorDict = {
  "red": "#F22929",
  "green": "#30D9A9",
  "blue": "#05C7F2",
  "grey": "#6D848C",
}