export const SIZE = 1000;
export const getEl = x => document.getElementById(x);
export const canvas = getEl("canvas");
export const LINEWIDTH = 4;

export const lerp = (a, b, frac) => a * (1-frac) + b * frac;
export const lerpBounded = (a, b, frac) => {
  frac = Math.max(0, Math.min(frac, 1));
  return lerp(a, b, frac)
}