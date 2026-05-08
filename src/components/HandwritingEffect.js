import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const STROKES = [
  { d: 'M 36,14 C 26,5 10,7 12,18 C 14,29 28,29 30,40 C 32,51 18,55 10,48', len: 76 },
  { d: 'M 40,46 C 40,33 50,27 60,32 C 68,37 67,48 58,52 C 49,54 38,50 39,44 L 67,41', len: 70 },
  { d: 'M 92,52 C 92,34 80,28 72,35 C 64,42 66,54 76,56 C 86,58 92,50 92,36 L 92,56', len: 68 },
  { d: 'M 100,36 C 92,28 84,31 88,39 C 92,46 104,44 106,52 C 108,59 98,62 90,57', len: 62 },
  { d: 'M 126,50 C 126,34 114,30 110,39 C 106,48 110,60 120,61 C 130,62 134,50 126,50', len: 66 },
  { d: 'M 136,61 L 136,38 C 136,30 143,27 150,32 C 157,37 158,46 158,61', len: 60 },
];

const COLORS = ['#5A3278', '#A882BE', '#DBBCE8', '#6D4D98', '#A882BE', '#EBD8F4'];
const LETTER_DUR = 1200 / STROKES.length;

export function HandwritingEffect({ onFinish }) {
  // 6 strokes × 3 layers = 18 animated values, all defined at top level
  const anims = useRef(
    Array.from({ length: STROKES.length * 3 }, (_, i) =>
      new Animated.Value(STROKES[i % STROKES.length].len)
    )
  ).current;

  useEffect(() => {
    const animations = anims.map((anim, i) => {
      const strokeIndex = i % STROKES.length;
      const layerOffset = Math.floor(i / STROKES.length) * 30;
      return Animated.delay(
        strokeIndex * LETTER_DUR + layerOffset,
        Animated.timing(anim, {
          toValue: 0,
          duration: LETTER_DUR * 1.3,
          useNativeDriver: false,
        })
      );
    });

    Animated.parallel(animations).start();

    const t = setTimeout(onFinish, 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <Svg width={200} height={80} viewBox="0 0 170 75">
      {STROKES.map((stroke, i) =>
        [0, 1, 2].map(layer => (
          <AnimatedPath
            key={`${i}-${layer}`}
            d={stroke.d}
            fill="none"
            stroke={COLORS[(i + layer * 2) % COLORS.length]}
            strokeWidth={8}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={stroke.len}
            strokeDashoffset={anims[layer * STROKES.length + i]}
          />
        ))
      )}
    </Svg>
  );
}
