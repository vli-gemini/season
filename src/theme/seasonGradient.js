// Day 1  — cool purple / teal
const EARLY = ['#5D4463', '#568C89'];
// Day 30 — burnt sienna / amber
const LATE  = ['#7A3530', '#9A6020'];

function lerpHex(from, to, t) {
  const f  = parseInt(from.slice(1), 16);
  const fR = (f >> 16) & 0xff, fG = (f >> 8) & 0xff, fB = f & 0xff;
  const tt = parseInt(to.slice(1), 16);
  const tR = (tt >> 16) & 0xff, tG = (tt >> 8) & 0xff, tB = tt & 0xff;
  const r  = Math.round(fR + (tR - fR) * t);
  const g  = Math.round(fG + (tG - fG) * t);
  const b  = Math.round(fB + (tB - fB) * t);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

export function getSeasonGradient(currentDay, totalDays) {
  const t = Math.min(Math.max((currentDay - 1) / (totalDays - 1), 0), 1);
  return [lerpHex(EARLY[0], LATE[0], t), lerpHex(EARLY[1], LATE[1], t)];
}
