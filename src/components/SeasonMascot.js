import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Animated, TouchableWithoutFeedback, Easing, StyleSheet } from 'react-native';
import Svg, {
  G, Ellipse, Circle, Path, Line, Defs,
  Filter, FeGaussianBlur,
} from 'react-native-svg';

function getStage(day) {
  if (day >= 30) return 'release';
  if (day >= 25) return 'puff';
  if (day >= 17) return 'transition';
  if (day >= 9)  return 'flower';
  return 'bud';
}

// viewBox matches the HTML reference design (140×188)
const VW  = 140;
const VH  = 188;
// Rendered size
const W   = 90;
const H   = 122;
// Face center in rendered pixels (for flying seed anchor)
const RCX = Math.round(70 * W / VW);  // 45
const RCY = Math.round(56 * H / VH);  // 36

// ── Shared blur filters (gouache wash effect) ─────────────────────────────────
function SharedDefs() {
  return (
    <Defs>
      <Filter id="s1" x="-30%" y="-30%" width="160%" height="160%">
        <FeGaussianBlur stdDeviation="1.6" />
      </Filter>
      <Filter id="s2" x="-50%" y="-50%" width="200%" height="200%">
        <FeGaussianBlur stdDeviation="3.2" />
      </Filter>
      <Filter id="s3" x="-100%" y="-100%" width="300%" height="300%">
        <FeGaussianBlur stdDeviation="5.5" />
      </Filter>
    </Defs>
  );
}

// ── Artsy eye: painted depth + ink outline ────────────────────────────────────
function ArtEye({ cx, cy, rx, ry, closed, sw = 1.8 }) {
  if (closed) {
    return (
      <Path
        d={`M ${cx - rx * 0.88} ${cy} Q ${cx} ${cy - ry * 1.6} ${cx + rx * 0.88} ${cy}`}
        stroke="#2A1C3A" strokeWidth={sw} fill="none" strokeLinecap="round"
      />
    );
  }
  const ir = rx * 0.72;
  return (
    <G>
      <Ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="white" opacity={0.92} filter="url(#s1)" />
      <Circle cx={cx + rx * 0.09} cy={cy + ry * 0.09} r={ir * 1.12} fill="#2A1840" opacity={0.85} />
      <Circle cx={cx + rx * 0.09} cy={cy + ry * 0.07} r={ir} fill="#160E30" />
      <Circle cx={cx + rx * 0.30} cy={cy - ry * 0.30} r={ir * 0.43} fill="white" />
      <Circle cx={cx - rx * 0.20} cy={cy + ry * 0.24} r={ir * 0.18} fill="rgba(255,255,255,0.55)" />
      <Ellipse cx={cx} cy={cy} rx={rx} ry={ry} stroke="#2A1C3A" strokeWidth={sw} fill="none" />
    </G>
  );
}

// ── Stem: shadow wash + colour wash + ink ─────────────────────────────────────
function ArtStem({ d, shadowColor, fillColor }) {
  return (
    <G>
      <Path d={d} stroke={shadowColor} strokeWidth={10} strokeLinecap="round" fill="none" opacity={0.20} filter="url(#s2)" />
      <Path d={d} stroke={fillColor}   strokeWidth={5}  strokeLinecap="round" fill="none" opacity={0.50} filter="url(#s1)" />
      <Path d={d} stroke="#2A1C3A"     strokeWidth={2.2} strokeLinecap="round" fill="none" />
    </G>
  );
}

// ── Bud (days 1–8) ────────────────────────────────────────────────────────────
function BudHead({ closed }) {
  return (
    <G>
      <ArtStem d="M 70 95 C 66.5 115 73.5 135 70 171" shadowColor="#6AAA60" fillColor="#88C478" />
      <Path d="M 68 114 C 60 108 54 103 50 101" stroke="#2A1C3A" strokeWidth={1.3} strokeLinecap="round" fill="none" opacity={0.7} />
      <Path d="M 72 132 C 80 126 86 122 89 121" stroke="#2A1C3A" strokeWidth={1.3} strokeLinecap="round" fill="none" opacity={0.7} />

      {/* Sepal leaves — painted + inked */}
      <Path d="M 70 95 C 60 88 52 82 50 76 C 56 82 62 88 70 95 Z" fill="#72B862" opacity={0.45} filter="url(#s1)" />
      <Path d="M 70 95 C 60 88 52 82 50 76 C 56 82 62 88 70 95 Z" stroke="#2A1C3A" strokeWidth={1.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M 70 95 C 80 88 88 82 90 76 C 84 82 78 88 70 95 Z" fill="#72B862" opacity={0.45} filter="url(#s1)" />
      <Path d="M 70 95 C 80 88 88 82 90 76 C 84 82 78 88 70 95 Z" stroke="#2A1C3A" strokeWidth={1.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M 70 95 C 68 84 68 74 70 68 C 72 74 72 84 70 95 Z" fill="#7EC870" opacity={0.40} filter="url(#s1)" />
      <Path d="M 70 95 C 68 84 68 74 70 68 C 72 74 72 84 70 95 Z" stroke="#2A1C3A" strokeWidth={1.5} fill="none" strokeLinecap="round" />

      {/* Bud body — 3 gouache wash layers */}
      <Ellipse cx={71} cy={59} rx={18} ry={28} fill="#3A8840" opacity={0.25} filter="url(#s3)" />
      <Ellipse cx={70} cy={57} rx={17} ry={27} fill="#5CB860" opacity={0.55} filter="url(#s2)" />
      <Ellipse cx={70} cy={55} rx={16} ry={26} fill="#74CC6C" opacity={0.72} filter="url(#s1)" />
      <Ellipse cx={64} cy={44} rx={7}  ry={10} fill="#A8E8A0" opacity={0.38} filter="url(#s1)" />
      <Ellipse cx={70} cy={56} rx={16.5} ry={26.5} stroke="#2A1C3A" strokeWidth={2} fill="none" />

      {/* Crown petal tip marks */}
      <Path d="M 70 30 Q 62 38 64 46" stroke="#2A1C3A" strokeWidth={1.6} fill="none" strokeLinecap="round" />
      <Path d="M 70 30 Q 78 38 76 46" stroke="#2A1C3A" strokeWidth={1.6} fill="none" strokeLinecap="round" />
      <Path d="M 70 30 L 70 43"        stroke="#2A1C3A" strokeWidth={1.6} fill="none" strokeLinecap="round" />

      {/* Brows — raised, curious */}
      <Path d="M 57 51 Q 62 48.5 67 50.5" stroke="#2A1C3A" strokeWidth={1.7} fill="none" strokeLinecap="round" opacity={0.65} />
      <Path d="M 73 50.5 Q 78 48.5 83 51" stroke="#2A1C3A" strokeWidth={1.7} fill="none" strokeLinecap="round" opacity={0.65} />

      {/* Left eye + lashes */}
      <ArtEye cx={62} cy={57} rx={7.5} ry={7} closed={closed} />
      <Line x1={55.5} y1={53}   x2={57.5} y2={51}   stroke="#2A1C3A" strokeWidth={1.3} strokeLinecap="round" />
      <Line x1={60}   y1={50.5} x2={61}   y2={48.5} stroke="#2A1C3A" strokeWidth={1.3} strokeLinecap="round" />
      <Line x1={65}   y1={50.5} x2={65.5} y2={48}   stroke="#2A1C3A" strokeWidth={1.3} strokeLinecap="round" />

      {/* Right eye + lashes */}
      <ArtEye cx={78} cy={57} rx={7.5} ry={7} closed={closed} />
      <Line x1={71.5} y1={53}   x2={73.5} y2={51}   stroke="#2A1C3A" strokeWidth={1.3} strokeLinecap="round" />
      <Line x1={76}   y1={50.5} x2={77}   y2={48.5} stroke="#2A1C3A" strokeWidth={1.3} strokeLinecap="round" />
      <Line x1={81}   y1={50.5} x2={81.5} y2={48}   stroke="#2A1C3A" strokeWidth={1.3} strokeLinecap="round" />

      {/* Blush */}
      <Ellipse cx={50} cy={64} rx={9} ry={6} fill="#E87860" opacity={0.22} filter="url(#s1)" />
      <Ellipse cx={90} cy={64} rx={9} ry={6} fill="#E87860" opacity={0.22} filter="url(#s1)" />

      {/* Hopeful smile */}
      <Path d="M 64 68 Q 70 73.5 76 68" stroke="#2A1C3A" strokeWidth={2} fill="none" strokeLinecap="round" />
    </G>
  );
}

// ── Flower (days 9–16) ────────────────────────────────────────────────────────
const PETAL_A = 'M 70 33.5 C 57 25 63.5 13.5 70 8.5 C 76.5 13.5 83 25 70 33.5 Z';
const PETAL_B = 'M 70 33.5 C 57.5 25.5 64 13 70 8.5 C 76 13 82.5 25.5 70 33.5 Z';

function FlowerHead({ closed }) {
  return (
    <G>
      <ArtStem d="M 70 85 C 67 105 73 125 70 164" shadowColor="#6AAA60" fillColor="#88C478" />
      <Path d="M 69 108 C 61 102 55 97 52 95"   stroke="#2A1C3A" strokeWidth={1.3} strokeLinecap="round" fill="none" opacity={0.65} />
      <Path d="M 71 128 C 79 122 85 118 88 117" stroke="#2A1C3A" strokeWidth={1.3} strokeLinecap="round" fill="none" opacity={0.65} />

      {/* Petal shadow wash */}
      {Array.from({ length: 10 }, (_, i) => (
        <G key={`fpsw${i}`} transform={`rotate(${i * 36}, 70, 58)`}>
          <Path d={i % 2 === 0 ? PETAL_A : PETAL_B} fill="#B89EC8" opacity={0.28} filter="url(#s3)" />
        </G>
      ))}
      {/* Petal colour wash */}
      {Array.from({ length: 10 }, (_, i) => (
        <G key={`fpcw${i}`} transform={`rotate(${i * 36}, 70, 58)`}>
          <Path d={i % 2 === 0 ? PETAL_A : PETAL_B} fill={i % 2 === 0 ? '#F4CE40' : '#F0C835'} opacity={0.75} filter="url(#s1)" />
        </G>
      ))}
      {/* Petal ink outlines */}
      {Array.from({ length: 10 }, (_, i) => (
        <G key={`fpink${i}`} transform={`rotate(${i * 36}, 70, 58)`}>
          <Path d={i % 2 === 0 ? PETAL_A : PETAL_B} stroke="#2A1C3A" strokeWidth={i % 2 === 0 ? 1.8 : 1.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </G>
      ))}

      {/* Face — warm golden gouache */}
      <Circle cx={71} cy={59} r={27} fill="#C87820" opacity={0.30} filter="url(#s3)" />
      <Circle cx={70} cy={57} r={25} fill="#F0AE30" opacity={0.70} filter="url(#s2)" />
      <Circle cx={70} cy={57} r={24} fill="#F8C040" opacity={0.75} filter="url(#s1)" />
      <Ellipse cx={61} cy={47} rx={11} ry={9} fill="#FCDA80" opacity={0.45} filter="url(#s1)" />
      <Circle cx={70} cy={57} r={24.5} stroke="#2A1C3A" strokeWidth={2.2} fill="none" />

      {/* Blush */}
      <Ellipse cx={47} cy={64} rx={11} ry={7.5} fill="#E86850" opacity={0.24} filter="url(#s2)" />
      <Ellipse cx={93} cy={64} rx={11} ry={7.5} fill="#E86850" opacity={0.24} filter="url(#s2)" />

      {/* Crosshatch shading */}
      <G stroke="#2A1C3A" strokeWidth={0.9} opacity={0.10} strokeLinecap="round">
        <Line x1={83} y1={44} x2={92} y2={53} />
        <Line x1={86} y1={44} x2={94} y2={52} />
        <Line x1={89} y1={46} x2={94} y2={51} />
        <Line x1={81} y1={48} x2={92} y2={59} />
        <Line x1={83} y1={53} x2={92} y2={62} />
        <Line x1={84} y1={58} x2={93} y2={67} />
        <Line x1={82} y1={63} x2={90} y2={71} />
        <Line x1={79} y1={68} x2={86} y2={75} />
      </G>

      {/* Brows */}
      <Path d="M 55 50 Q 62 47.5 68 49.5" stroke="#2A1C3A" strokeWidth={1.8} fill="none" strokeLinecap="round" opacity={0.70} />
      <Path d="M 72 49.5 Q 78 47.5 85 50" stroke="#2A1C3A" strokeWidth={1.8} fill="none" strokeLinecap="round" opacity={0.70} />

      {/* Left eye + lashes */}
      <ArtEye cx={59} cy={56} rx={9} ry={8.5} closed={closed} sw={2} />
      <Line x1={51}  y1={51}   x2={53}   y2={49}   stroke="#2A1C3A" strokeWidth={1.4} strokeLinecap="round" />
      <Line x1={56}  y1={48}   x2={57}   y2={46}   stroke="#2A1C3A" strokeWidth={1.4} strokeLinecap="round" />
      <Line x1={62}  y1={47.5} x2={62.5} y2={45.5} stroke="#2A1C3A" strokeWidth={1.4} strokeLinecap="round" />
      <Line x1={67}  y1={49}   x2={68}   y2={47}   stroke="#2A1C3A" strokeWidth={1.2} strokeLinecap="round" />

      {/* Right eye + lashes */}
      <ArtEye cx={81} cy={56} rx={9} ry={8.5} closed={closed} sw={2} />
      <Line x1={73}  y1={51}   x2={75}   y2={49}   stroke="#2A1C3A" strokeWidth={1.4} strokeLinecap="round" />
      <Line x1={78}  y1={48}   x2={79}   y2={46}   stroke="#2A1C3A" strokeWidth={1.4} strokeLinecap="round" />
      <Line x1={84}  y1={47.5} x2={84.5} y2={45.5} stroke="#2A1C3A" strokeWidth={1.4} strokeLinecap="round" />
      <Line x1={89}  y1={49}   x2={90}   y2={47}   stroke="#2A1C3A" strokeWidth={1.2} strokeLinecap="round" />

      {/* Big confident smile */}
      <Path d="M 56 69 Q 70 80.5 84 69" stroke="#2A1C3A" strokeWidth={2.5} fill="none" strokeLinecap="round" />
      <Path d="M 58 70 Q 70 79 82 70" fill="rgba(180,80,40,0.15)" />
    </G>
  );
}

// ── Transition (days 17–24) ───────────────────────────────────────────────────
const TPETAL_A = 'M 70 35 C 59 27 65 16 70 11 C 75 16 81 27 70 35 Z';
const TPETAL_B = 'M 70 35 C 59.5 27.5 65.5 15.5 70 11 C 74.5 15.5 80.5 27.5 70 35 Z';

function TransitionHead({ closed }) {
  return (
    <G>
      <ArtStem d="M 70 90 C 67 110 73 130 70 165" shadowColor="#6AAA6A" fillColor="#8AC882" />
      <Path d="M 69 110 C 61 104 55 99 52 97"   stroke="#2A1C3A" strokeWidth={1.2} strokeLinecap="round" fill="none" opacity={0.60} />
      <Path d="M 71 130 C 79 124 85 120 88 119" stroke="#2A1C3A" strokeWidth={1.2} strokeLinecap="round" fill="none" opacity={0.60} />

      {/* 8 petals — faded warm gold */}
      {Array.from({ length: 8 }, (_, i) => (
        <G key={`tpsw${i}`} transform={`rotate(${i * 45}, 70, 58)`}>
          <Path d={i % 2 === 0 ? TPETAL_A : TPETAL_B} fill="#8A7030" opacity={0.22} filter="url(#s3)" />
        </G>
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <G key={`tpcw${i}`} transform={`rotate(${i * 45}, 70, 58)`}>
          <Path d={i % 2 === 0 ? TPETAL_A : TPETAL_B} fill={i % 2 === 0 ? '#CDA840' : '#C8A035'} opacity={0.68} filter="url(#s1)" />
        </G>
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <G key={`tpink${i}`} transform={`rotate(${i * 45}, 70, 58)`}>
          <Path d={i % 2 === 0 ? TPETAL_A : TPETAL_B} stroke="#2A1C3A" strokeWidth={i % 2 === 0 ? 1.6 : 1.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </G>
      ))}

      {/* Face — muted amber, between flower gold and puff lavender */}
      <Circle cx={71} cy={58} r={22} fill="#A06820" opacity={0.25} filter="url(#s3)" />
      <Circle cx={70} cy={57} r={20} fill="#D09030" opacity={0.65} filter="url(#s2)" />
      <Circle cx={70} cy={57} r={19} fill="#DFA040" opacity={0.72} filter="url(#s1)" />
      <Ellipse cx={62} cy={49} rx={8} ry={7} fill="#EDBA70" opacity={0.40} filter="url(#s1)" />
      <Circle cx={70} cy={57} r={19.5} stroke="#2A1C3A" strokeWidth={2} fill="none" />

      {/* Blush */}
      <Ellipse cx={51} cy={64} rx={9} ry={6} fill="#E86850" opacity={0.20} filter="url(#s2)" />
      <Ellipse cx={89} cy={64} rx={9} ry={6} fill="#E86850" opacity={0.20} filter="url(#s2)" />

      {/* Brows — wistful, slightly inward */}
      <Path d="M 56 51 Q 62 49 67 50.5"   stroke="#2A1C3A" strokeWidth={1.7} fill="none" strokeLinecap="round" opacity={0.65} />
      <Path d="M 73 50.5 Q 78 49 84 51"   stroke="#2A1C3A" strokeWidth={1.7} fill="none" strokeLinecap="round" opacity={0.65} />

      {/* Left eye + lashes */}
      <ArtEye cx={60} cy={57} rx={7.5} ry={7} closed={closed} sw={1.9} />
      <Line x1={53}   y1={52.5} x2={55}   y2={50.5} stroke="#2A1C3A" strokeWidth={1.3} strokeLinecap="round" />
      <Line x1={58}   y1={49.5} x2={59}   y2={47.5} stroke="#2A1C3A" strokeWidth={1.3} strokeLinecap="round" />
      <Line x1={63.5} y1={49}   x2={64}   y2={47}   stroke="#2A1C3A" strokeWidth={1.2} strokeLinecap="round" />

      {/* Right eye + lashes */}
      <ArtEye cx={80} cy={57} rx={7.5} ry={7} closed={closed} sw={1.9} />
      <Line x1={73}   y1={52.5} x2={75}   y2={50.5} stroke="#2A1C3A" strokeWidth={1.3} strokeLinecap="round" />
      <Line x1={78}   y1={49.5} x2={79}   y2={47.5} stroke="#2A1C3A" strokeWidth={1.3} strokeLinecap="round" />
      <Line x1={83.5} y1={49}   x2={84}   y2={47}   stroke="#2A1C3A" strokeWidth={1.2} strokeLinecap="round" />

      {/* Contemplative smile */}
      <Path d="M 62 67 Q 70 73 78 67" stroke="#2A1C3A" strokeWidth={2} fill="none" strokeLinecap="round" />
    </G>
  );
}

// ── Puff (days 25–30) ─────────────────────────────────────────────────────────
function PuffHead({ closed }) {
  const FCX    = 70;
  const FCY    = 56;
  const faceR  = 13;
  const stalkL = 22;
  const tipR   = 4;
  const n      = 12;

  const seeds = Array.from({ length: n }, (_, i) => {
    const a  = (i / n) * 2 * Math.PI;
    const sx = FCX + faceR * Math.sin(a);
    const sy = FCY - faceR * Math.cos(a);
    const ex = FCX + (faceR + stalkL) * Math.sin(a);
    const ey = FCY - (faceR + stalkL) * Math.cos(a);
    const tx = FCX + (faceR + stalkL + tipR + 0.5) * Math.sin(a);
    const ty = FCY - (faceR + stalkL + tipR + 0.5) * Math.cos(a);
    return { sx, sy, ex, ey, tx, ty };
  });

  return (
    <G>
      <ArtStem d="M 70 83 C 67 103 73 123 70 162" shadowColor="#8AAA80" fillColor="#A0C490" />
      <Path d="M 69 106 C 61 100 55 95 52 93"   stroke="#2A1C3A" strokeWidth={1.2} strokeLinecap="round" fill="none" opacity={0.60} />
      <Path d="M 71 126 C 79 120 85 116 88 115" stroke="#2A1C3A" strokeWidth={1.2} strokeLinecap="round" fill="none" opacity={0.60} />

      {/* Shadow halo */}
      <Circle cx={70} cy={56} r={42} fill="#9090C0" opacity={0.06} filter="url(#s3)" />

      {/* Seeds: painted stalk + tip, ink on top */}
      {seeds.map((s, i) => (
        <G key={i}>
          <Line x1={s.sx} y1={s.sy} x2={s.ex} y2={s.ey} stroke="#B0B0D0" strokeWidth={3.5} strokeLinecap="round" opacity={0.35} filter="url(#s1)" />
          <Line x1={s.sx} y1={s.sy} x2={s.ex} y2={s.ey} stroke="#2A1C3A" strokeWidth={1.3} strokeLinecap="round" />
          <Circle cx={s.tx} cy={s.ty} r={tipR + 0.5} fill="#D8D8F0" opacity={0.70} filter="url(#s1)" />
          <Circle cx={s.tx} cy={s.ty} r={tipR}        fill="#E8E8FC" opacity={0.85} />
          <Circle cx={s.tx} cy={s.ty} r={tipR}        stroke="#2A1C3A" strokeWidth={1.1} fill="none" />
        </G>
      ))}

      {/* Face — silver-lavender gouache */}
      <Circle cx={71} cy={57} r={17} fill="#6868A0" opacity={0.22} filter="url(#s3)" />
      <Circle cx={70} cy={56} r={15} fill="#AEAECE" opacity={0.65} filter="url(#s2)" />
      <Circle cx={70} cy={56} r={14} fill="#C8C8E0" opacity={0.75} filter="url(#s1)" />
      <Ellipse cx={64} cy={49} rx={6} ry={5} fill="#E0E0F4" opacity={0.50} filter="url(#s1)" />
      <Circle cx={70} cy={56} r={14.5} stroke="#2A1C3A" strokeWidth={2} fill="none" />

      {/* Blush */}
      <Ellipse cx={54} cy={62} rx={9} ry={6} fill="#E87860" opacity={0.16} filter="url(#s2)" />
      <Ellipse cx={86} cy={62} rx={9} ry={6} fill="#E87860" opacity={0.16} filter="url(#s2)" />

      {/* Brows — relaxed, at peace */}
      <Path d="M 59 49 Q 64 47 69 48.5" stroke="#2A1C3A" strokeWidth={1.6} fill="none" strokeLinecap="round" opacity={0.55} />
      <Path d="M 71 48.5 Q 76 47 81 49" stroke="#2A1C3A" strokeWidth={1.6} fill="none" strokeLinecap="round" opacity={0.55} />

      {/* Left eye + lashes */}
      <ArtEye cx={62} cy={55} rx={6} ry={5.5} closed={closed} sw={1.8} />
      <Line x1={57}   y1={51}   x2={58.5} y2={49.5} stroke="#2A1C3A" strokeWidth={1.2} strokeLinecap="round" />
      <Line x1={61.5} y1={49.5} x2={62}   y2={48}   stroke="#2A1C3A" strokeWidth={1.2} strokeLinecap="round" />
      <Line x1={66}   y1={50}   x2={66.5} y2={48.5} stroke="#2A1C3A" strokeWidth={1.1} strokeLinecap="round" />

      {/* Right eye + lashes */}
      <ArtEye cx={78} cy={55} rx={6} ry={5.5} closed={closed} sw={1.8} />
      <Line x1={73}   y1={51}   x2={74.5} y2={49.5} stroke="#2A1C3A" strokeWidth={1.2} strokeLinecap="round" />
      <Line x1={77.5} y1={49.5} x2={78}   y2={48}   stroke="#2A1C3A" strokeWidth={1.2} strokeLinecap="round" />
      <Line x1={82}   y1={50}   x2={82.5} y2={48.5} stroke="#2A1C3A" strokeWidth={1.1} strokeLinecap="round" />

      {/* Peaceful mouth */}
      <Path d="M 64 63 Q 70 66.5 76 63" stroke="#2A1C3A" strokeWidth={1.8} fill="none" strokeLinecap="round" />
    </G>
  );
}

// ── Flying seed (animated overlay for release day) ────────────────────────────
function FlyingSeed({ x, y, opacity }) {
  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: RCX - 1,
        top:  RCY - 8,
        width: 2.5,
        height: 18,
        borderRadius: 2,
        backgroundColor: '#C8C8E8',
        opacity,
        transform: [{ translateX: x }, { translateY: y }],
      }}
    />
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
const SEED_COUNT = 14;

export function SeasonMascot({ day = 1, totalDays = 30, style }) {
  const stage = getStage(day);

  const bob   = useRef(new Animated.Value(0)).current;
  const sway  = useRef(new Animated.Value(0)).current;
  const shake = useRef(new Animated.Value(0)).current;
  const [eyesClosed, setEyesClosed] = useState(false);

  const flySeeds = useRef(
    Array.from({ length: SEED_COUNT }, () => ({
      x:       new Animated.Value(0),
      y:       new Animated.Value(0),
      opacity: new Animated.Value(0),
    }))
  ).current;

  // Bob
  useEffect(() => {
    const slow = stage === 'puff' || stage === 'release';
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: slow ? -3 : -7, duration: slow ? 3400 : 1900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(bob, { toValue: 0,              duration: slow ? 3400 : 1900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [stage]);

  // Sway — pivots at stem base via transformOrigin
  useEffect(() => {
    const canSway = stage === 'flower' || stage === 'transition';
    if (!canSway) { sway.setValue(0); return; }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(sway, { toValue:  3, duration: 2800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(sway, { toValue: -3, duration: 2800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(sway, { toValue:  0, duration: 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [stage]);

  // Blink
  useEffect(() => {
    let alive = true;
    const schedule = () => {
      if (!alive) return;
      setTimeout(() => {
        if (!alive) return;
        setEyesClosed(true);
        setTimeout(() => {
          if (!alive) return;
          setEyesClosed(false);
          schedule();
        }, 130);
      }, 2800 + Math.random() * 2600);
    };
    schedule();
    return () => { alive = false; };
  }, []);

  // Seed release
  const triggerRelease = useCallback((count = SEED_COUNT) => {
    flySeeds.slice(0, count).forEach((seed, i) => {
      const angle = (i / count) * 2 * Math.PI - Math.PI / 2 + (Math.random() - 0.5) * 0.5;
      const dist  = 42 + Math.random() * 28;
      Animated.sequence([
        Animated.delay(i * 48),
        Animated.parallel([
          Animated.timing(seed.opacity, { toValue: 1,                           duration: 80,   useNativeDriver: true }),
          Animated.timing(seed.x,       { toValue: Math.cos(angle) * dist,      duration: 1300, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(seed.y,       { toValue: Math.sin(angle) * dist - 14, duration: 1300, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        ]),
        Animated.timing(seed.opacity, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]).start(() => {
        seed.x.setValue(0);
        seed.y.setValue(0);
        seed.opacity.setValue(0);
      });
    });
  }, []);

  const releasedRef = useRef(false);
  useEffect(() => {
    if (stage === 'release' && !releasedRef.current) {
      releasedRef.current = true;
      setTimeout(() => triggerRelease(SEED_COUNT), 700);
    }
    if (stage !== 'release') releasedRef.current = false;
  }, [stage]);

  // Tap
  const handleTap = useCallback(() => {
    if (stage === 'puff' || stage === 'release') { triggerRelease(4); return; }
    Animated.sequence([
      Animated.timing(shake, { toValue:  10, duration: 55, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -10, duration: 55, useNativeDriver: true }),
      Animated.timing(shake, { toValue:   7, duration: 45, useNativeDriver: true }),
      Animated.timing(shake, { toValue:  -7, duration: 45, useNativeDriver: true }),
      Animated.timing(shake, { toValue:   0, duration: 40, useNativeDriver: true }),
    ]).start();
  }, [stage]);

  const swayDeg = sway.interpolate({ inputRange: [-10, 10], outputRange: ['-10deg', '10deg'] });

  return (
    <TouchableWithoutFeedback onPress={handleTap} accessibilityLabel="Dandie" accessibilityRole="button">
      <Animated.View style={[styles.root, style, { transform: [{ translateY: bob }, { translateX: shake }] }]}>

        <Animated.View style={{ transformOrigin: '50% 100%', transform: [{ rotate: swayDeg }] }}>
          <Svg width={W} height={H} viewBox={`0 0 ${VW} ${VH}`}>
            <SharedDefs />
            {stage === 'bud'        && <BudHead        closed={eyesClosed} />}
            {stage === 'flower'     && <FlowerHead      closed={eyesClosed} />}
            {stage === 'transition' && <TransitionHead  closed={eyesClosed} />}
            {(stage === 'puff' || stage === 'release') && <PuffHead closed={eyesClosed} />}
          </Svg>
        </Animated.View>

        {flySeeds.map((s, i) => (
          <FlyingSeed key={i} x={s.x} y={s.y} opacity={s.opacity} />
        ))}

      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  root: { width: W },
});
