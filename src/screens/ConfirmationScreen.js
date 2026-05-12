import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Image,
  TouchableOpacity,
} from 'react-native';
import ReAnimated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing as REasing,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Circle } from 'react-native-svg';
import { colors } from '../theme/colors';
import { contentPadding } from '../theme/layout';

const DW = 210;
const DH = 220;
const PCX = 104;
const PCY = 128;
const DCOLOR = 'rgba(255,255,255,0.55)';
const DSW = 0.9;

function rad(deg) { return (deg * Math.PI) / 180; }

function spokeAndUmbrella(cx, cy, angleDeg, spokeLen = 16, tineLen = 4, tines = 5, halfSpread = 55) {
  const a = rad(angleDeg);
  const tx = cx + Math.cos(a) * spokeLen;
  const ty = cy + Math.sin(a) * spokeLen;
  let d = `M${cx.toFixed(1)},${cy.toFixed(1)}L${tx.toFixed(1)},${ty.toFixed(1)}`;
  for (let i = 0; i < tines; i++) {
    const ta = rad(angleDeg - halfSpread + (i / (tines - 1)) * halfSpread * 2);
    const ex = tx + Math.cos(ta) * tineLen;
    const ey = ty + Math.sin(ta) * tineLen;
    d += ` M${tx.toFixed(1)},${ty.toFixed(1)}L${ex.toFixed(1)},${ey.toFixed(1)}`;
  }
  return d;
}

const SPOKE_COUNT = 18;
const SPOKE_ANGLES = Array.from({ length: SPOKE_COUNT }, (_, i) => -90 + (i / SPOKE_COUNT) * 360);

// Each seed: [base_x, base_y, stalk_angle, puff_spoke_index]
const FLOAT_SEEDS = [
  [109, 122, -10, 4],
  [104, 112, -30, 3],
  [ 97, 103, -50, 2],
  [ 88,  98, -70, 1],
];

const DEPARTING_SPOKE_INDICES = new Set(FLOAT_SEEDS.map(s => s[3]));

// Physics keyframes per seed — t stops shared, x/y/rot differ per seed.
// Seeds accelerate off the puff, arc upward (lift from parachute), gravity
// gradually pulls them into a lazy float, then they drift and fade.
// Y is screen coords: negative = up.
const T = [0, 0.04, 0.12, 0.25, 0.45, 0.68, 0.85, 1];

const PHYSICS = [
  // seed 0 — mostly rightward, low arc (outer spoke, wind catches it flat)
  {
    x:   [0,  0,   4,  12,  22,  30,  34,  36],
    y:   [0,  0,  -3,  -9, -14, -14, -12, -11],
    rot: [0,  0,   4,  10,  14,  12,  10,   9],
    dur: 2600,
    delay: 0,
  },
  // seed 1 — diagonal up-right, medium arc
  {
    x:   [0,  0,   5,  13,  22,  30,  34,  36],
    y:   [0,  0,  -5, -14, -22, -23, -21, -20],
    rot: [0,  0,  -3,  -8, -10,  -7,  -5,  -4],
    dur: 2800,
    delay: 550,
  },
  // seed 2 — steeper initial burst, floats higher
  {
    x:   [0,  0,   4,  11,  19,  27,  31,  33],
    y:   [0,  0,  -7, -17, -28, -30, -28, -27],
    rot: [0,  0,   6,  14,  18,  14,  11,  10],
    dur: 3000,
    delay: 1150,
  },
  // seed 3 — steepest, catches an updraft then drifts right
  {
    x:   [0,  0,   3,   9,  16,  24,  29,  31],
    y:   [0,  0,  -9, -21, -34, -37, -35, -33],
    rot: [0,  0,  -5, -12, -16, -12,  -9,  -8],
    dur: 3200,
    delay: 1750,
  },
];

// Total cycle long enough that all seeds finish before looping
const CYCLE = 5400;

function PixelDandelion() {
  const anims = useRef(FLOAT_SEEDS.map(() => new Animated.Value(0))).current;

  // Stem base — the ground pivot point in SVG coords.
  const stemPX = PCX - 24; // 80
  const stemPY = PCY + 58; // 186

  // Reanimated shared value drives the wind sway (degrees).
  const windDeg = useSharedValue(0);

  useEffect(() => {
    const loops = anims.map((anim, i) => {
      const { dur, delay } = PHYSICS[i];
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: dur,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
          Animated.timing(anim, { toValue: 0, duration: 0, useNativeDriver: false }),
          Animated.delay(CYCLE - dur - delay),
        ])
      );
    });

    windDeg.value = withRepeat(
      withSequence(
        withTiming( 9,   { duration: 2400, easing: REasing.inOut(REasing.sin) }),
        withTiming( 3,   { duration: 1800, easing: REasing.inOut(REasing.sin) }),
        withTiming( 8,   { duration: 2000, easing: REasing.inOut(REasing.sin) }),
        withTiming(-5,   { duration: 2600, easing: REasing.inOut(REasing.sin) }),
        withTiming( 0,   { duration: 1600, easing: REasing.inOut(REasing.sin) }),
      ),
      -1,
      false,
    );

    loops.forEach(l => l.start());
    return () => { loops.forEach(l => l.stop()); };
  }, []);

  const windStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${windDeg.value}deg` }],
    transformOrigin: `${stemPX}px ${stemPY}px`,
  }));

  // Anchor-pivot: a zero-size Animated.View sits at the stem base.
  // The dandelion content is offset back so it draws at its original position.
  // Rotating the anchor rotates everything around the stem base.
  return (
    <ReAnimated.View style={[{ width: DW, height: DH }, windStyle]}>
      <View style={{ position: 'absolute', left: 0, top: 0, width: DW, height: DH }}>
          {/* Static puff: stem + center dot + permanently attached spokes */}
          <Svg width={DW} height={DH} style={{ position: 'absolute', top: 0, left: 0 }}>
            <Path
              d={`M${PCX},${PCY + 4} C${PCX - 5},${PCY + 26} ${PCX - 14},${PCY + 48} ${PCX - 24},${PCY + 58}`}
              stroke={DCOLOR}
              strokeWidth={DSW}
              fill="none"
            />
            <Circle cx={PCX} cy={PCY} r={1.8} fill={DCOLOR} />
            {SPOKE_ANGLES.map((angle, i) =>
              DEPARTING_SPOKE_INDICES.has(i) ? null : (
                <Path
                  key={i}
                  d={spokeAndUmbrella(PCX, PCY, angle)}
                  stroke={DCOLOR}
                  strokeWidth={DSW}
                  fill="none"
                  strokeLinecap="round"
                />
              )
            )}
          </Svg>

          {/* Departing spokes — fade out as their seed lifts off, fade back as it resets */}
          {FLOAT_SEEDS.map(([, , , spokeIdx], i) => {
            const spokeOp = anims[i].interpolate({
              inputRange: [0,  0.04, 0.15, 0.75, 0.92, 1],
              outputRange: [1,  0.9,  0,    0,    0.6,  1],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={`sp${i}`}
                style={{ position: 'absolute', top: 0, left: 0, width: DW, height: DH, opacity: spokeOp }}
                pointerEvents="none"
              >
                <Svg width={DW} height={DH}>
                  <Path
                    d={spokeAndUmbrella(PCX, PCY, SPOKE_ANGLES[spokeIdx])}
                    stroke={DCOLOR}
                    strokeWidth={DSW}
                    fill="none"
                    strokeLinecap="round"
                  />
                </Svg>
              </Animated.View>
            );
          })}

          {/* Floating seeds — curved trajectory, tumble rotation, natural fade */}
          {FLOAT_SEEDS.map(([bx, by, angle], i) => {
            const { x: xStops, y: yStops, rot: rotStops } = PHYSICS[i];
            const tx  = anims[i].interpolate({ inputRange: T, outputRange: xStops });
            const ty  = anims[i].interpolate({ inputRange: T, outputRange: yStops });
            const rot = anims[i].interpolate({
              inputRange: T,
              outputRange: rotStops.map(r => `${r}deg`),
            });
            const op = anims[i].interpolate({
              inputRange: [0,  0.05, 0.60, 0.82, 1],
              outputRange: [0,  1,   0.88,  0.1,  0],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={`seed${i}`}
                style={{
                  position: 'absolute',
                  left: bx - 22,
                  top: by - 26,
                  width: 44,
                  height: 52,
                  opacity: op,
                  transform: [{ translateX: tx }, { translateY: ty }, { rotate: rot }],
                }}
              >
                <Svg width={44} height={52}>
                  <Path
                    d={spokeAndUmbrella(22, 26, angle, 15, 6, 5, 55)}
                    stroke={DCOLOR}
                    strokeWidth={DSW}
                    fill="none"
                    strokeLinecap="round"
                  />
                </Svg>
              </Animated.View>
            );
          })}
      </View>
    </ReAnimated.View>
  );
}

export function ConfirmationScreen({ navigation, route }) {
  const headingOpacity = useRef(new Animated.Value(0)).current;
  const headingY = useRef(new Animated.Value(14)).current;
  const bodyOpacity = useRef(new Animated.Value(0)).current;
  const bodyY = useRef(new Animated.Value(10)).current;
  const demoOpacity = useRef(new Animated.Value(0)).current;
  const dandelionOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(dandelionOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(headingOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(headingY, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(bodyOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(bodyY, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
      Animated.timing(demoOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Image
        source={require('../../assets/splash background.png')}
        style={[StyleSheet.absoluteFill, styles.bgImage]}
        resizeMode="cover"
      />
      <View style={[StyleSheet.absoluteFill, styles.bgOverlay]} />

      <View style={styles.center}>
        <View style={styles.block}>
          <Animated.View style={{ opacity: dandelionOpacity, alignItems: 'center' }}>
            <PixelDandelion />
          </Animated.View>
          <Animated.Text
            style={[styles.heading, { opacity: headingOpacity, transform: [{ translateY: headingY }], marginTop: -14 }]}
          >
            You're on the list.
          </Animated.Text>
          <Animated.Text
            style={[styles.body, { opacity: bodyOpacity, transform: [{ translateY: bodyY }], marginTop: -16 }]}
          >
            We'll email you when your cohort is ready.
          </Animated.Text>
        </View>
      </View>

      <Animated.View style={[styles.demoWrap, { opacity: demoOpacity }]}>
        <TouchableOpacity
          style={styles.demoBtn}
          onPress={() => navigation.replace('MatchReveal')}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel="Preview demo"
        >
          <Text style={styles.demoLabel}>demo</Text>
          <Ionicons name="arrow-forward" size={13} color="rgba(255,255,255,0.55)" />
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  bgImage: {
    width: '100%',
    height: '100%',
  },
  bgOverlay: {
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: contentPadding,
    paddingBottom: 160,
  },
  block: {
    gap: 24,
    alignItems: 'center',
  },
  heading: {
    fontSize: 36,
    fontFamily: 'PlusJakartaSans_300Light',
    color: '#ffffff',
    lineHeight: 46,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  body: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.55)',
    lineHeight: 23,
    textAlign: 'center',
  },
  demoWrap: {
    position: 'absolute',
    bottom: 24,
    right: contentPadding,
  },
  demoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  demoLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 0.3,
    textDecorationLine: 'underline',
    textDecorationColor: 'rgba(255,255,255,0.30)',
  },
});
