import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, G, Defs, ClipPath, Mask, Image as SvgImage, Text as SvgText } from 'react-native-svg';
import { colors } from '../theme/colors';
import { contentPadding } from '../theme/layout';
import { Button } from '../components/Button';
import { ME, GROUP_MEMBERS } from '../config/members';

// ─── geometry ────────────────────────────────────────────────────────────────

const CANVAS       = 420;
const CX           = 210;
const CY           = 170;
const STEM_Y       = 378;
const PIVOT_OFFSET = STEM_Y - CANVAS / 2;

const YOU_R = 23;
const MBR_R = 19;

// SEEDS[0] = you (ME), SEEDS[1–7] = GROUP_MEMBERS[0–6]
const AVATARS = [ME, ...GROUP_MEMBERS];

// 8 seeds — golden-angle spacing (~137.5°)
const SEEDS = [
  { angle:  -90, length: 68, isYou: true  },  // top — you
  { angle:  -42, length: 55               },  // upper right
  { angle:    8, length: 72, unknown: true },  // right
  { angle:   58, length: 48               },  // lower right
  { angle:  110, length: 65, unknown: true },  // lower
  { angle:  155, length: 52               },  // lower left
  { angle: -168, length: 78, unknown: true },  // left
  { angle: -128, length: 44               },  // upper left
];

const toRad = d => (d * Math.PI) / 180;

function tip(s) {
  const a = toRad(s.angle);
  return { x: CX + Math.cos(a) * s.length, y: CY + Math.sin(a) * s.length };
}

// Straight spoke from centre to profile tip
function filamentD(s) {
  const { x: tx, y: ty } = tip(s);
  return `M${CX},${CY}L${tx.toFixed(1)},${ty.toFixed(1)}`;
}

// Main plant stem — gentle S-curve
function mainStemD() {
  const midY = (CY + STEM_Y) / 2;
  return `M${CX} ${CY} C${CX + 9} ${midY - 24} ${CX - 7} ${midY + 22} ${CX} ${STEM_Y}`;
}

// Small elongated seed body (cypsela) just inside the avatar circle
function seedBodyD(s) {
  const { x: cx, y: cy } = tip(s);
  const a   = toRad(s.angle);
  const r   = s.isYou ? YOU_R : MBR_R;
  const len = 13;
  const wid = 3.2;
  const x1  = cx - Math.cos(a) * (r + 0.5);
  const y1  = cy - Math.sin(a) * (r + 0.5);
  const x2  = cx - Math.cos(a) * (r + len);
  const y2  = cy - Math.sin(a) * (r + len);
  const px  = -Math.sin(a) * wid;
  const py  =  Math.cos(a) * wid;
  return (
    `M${(x1 + px).toFixed(1)} ${(y1 + py).toFixed(1)} ` +
    `Q${(x2 + px * 0.5).toFixed(1)} ${(y2 + py * 0.5).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)} ` +
    `Q${(x2 - px * 0.5).toFixed(1)} ${(y2 - py * 0.5).toFixed(1)} ${(x1 - px).toFixed(1)} ${(y1 - py).toFixed(1)} Z`
  );
}

// Outer fluff layer — long spokes with wide airy pappus fans
function innerFluffD() {
  let d = '';
  const count = 80;
  for (let i = 0; i < count; i++) {
    const angleDeg = (360 / count) * i + Math.sin(i * 2.4) * 7 + Math.cos(i * 1.1) * 3;
    const a        = toRad(angleDeg);
    const spokeLen = 82 + Math.sin(i * 2.1) * 28 + Math.cos(i * 0.9) * 10;
    const tx = CX + Math.cos(a) * spokeLen;
    const ty = CY + Math.sin(a) * spokeLen;
    d += `M${CX},${CY}L${tx.toFixed(1)},${ty.toFixed(1)} `;
    const hairLen = 15 + Math.sin(i * 1.7) * 4;
    const spread  = 85;
    const hairN   = 10;
    for (let j = 0; j < hairN; j++) {
      const ta = toRad(angleDeg - spread + (j / (hairN - 1)) * spread * 2);
      d += `M${tx.toFixed(1)},${ty.toFixed(1)}L${(tx + Math.cos(ta) * hairLen).toFixed(1)},${(ty + Math.sin(ta) * hairLen).toFixed(1)} `;
    }
  }
  return d.trim();
}

// Mid layer
function innerMidD() {
  let d = '';
  const count = 56;
  for (let i = 0; i < count; i++) {
    const angleDeg = (360 / count) * i + Math.sin(i * 1.7) * 9 + Math.cos(i * 2.3) * 4;
    const a        = toRad(angleDeg);
    const spokeLen = 54 + Math.sin(i * 2.9) * 18 + Math.cos(i * 1.5) * 6;
    const tx = CX + Math.cos(a) * spokeLen;
    const ty = CY + Math.sin(a) * spokeLen;
    d += `M${CX},${CY}L${tx.toFixed(1)},${ty.toFixed(1)} `;
    const hairLen = 10 + Math.sin(i * 1.9) * 2.5;
    const spread  = 78;
    const hairN   = 8;
    for (let j = 0; j < hairN; j++) {
      const ta = toRad(angleDeg - spread + (j / (hairN - 1)) * spread * 2);
      d += `M${tx.toFixed(1)},${ty.toFixed(1)}L${(tx + Math.cos(ta) * hairLen).toFixed(1)},${(ty + Math.sin(ta) * hairLen).toFixed(1)} `;
    }
  }
  return d.trim();
}

// Inner core layer
function innerCoreD() {
  let d = '';
  const count = 52;
  for (let i = 0; i < count; i++) {
    const angleDeg = (360 / count) * i + Math.sin(i * 3.1) * 8 + Math.cos(i * 1.9) * 4;
    const a        = toRad(angleDeg);
    const spokeLen = 30 + Math.sin(i * 2.7) * 12 + Math.cos(i * 1.3) * 5;
    const tx = CX + Math.cos(a) * spokeLen;
    const ty = CY + Math.sin(a) * spokeLen;
    d += `M${CX},${CY}L${tx.toFixed(1)},${ty.toFixed(1)} `;
    const hairLen = 6 + Math.sin(i * 2.1) * 1.5;
    const spread  = 65;
    const hairN   = 6;
    for (let j = 0; j < hairN; j++) {
      const ta = toRad(angleDeg - spread + (j / (hairN - 1)) * spread * 2);
      d += `M${tx.toFixed(1)},${ty.toFixed(1)}L${(tx + Math.cos(ta) * hairLen).toFixed(1)},${(ty + Math.sin(ta) * hairLen).toFixed(1)} `;
    }
  }
  return d.trim();
}

// Spoke + umbrella tines shape (matches ConfirmationScreen flying seeds)
function spokeAndUmbrella(cx, cy, angleDeg, spokeLen = 15, tineLen = 6, tines = 5, halfSpread = 55) {
  const a  = toRad(angleDeg);
  const tx = cx + Math.cos(a) * spokeLen;
  const ty = cy + Math.sin(a) * spokeLen;
  let d = `M${cx.toFixed(1)},${cy.toFixed(1)}L${tx.toFixed(1)},${ty.toFixed(1)}`;
  for (let i = 0; i < tines; i++) {
    const ta = toRad(angleDeg - halfSpread + (i / (tines - 1)) * halfSpread * 2);
    const ex = tx + Math.cos(ta) * tineLen;
    const ey = ty + Math.sin(ta) * tineLen;
    d += ` M${tx.toFixed(1)},${ty.toFixed(1)}L${ex.toFixed(1)},${ey.toFixed(1)}`;
  }
  return d;
}

// ─── drifting seed ────────────────────────────────────────────────────────────
function DrifterSeed({ left, top, windDx, windDy, angle, delay, maxOpacity, size = 44 }) {
  const tx = useRef(new Animated.Value(0)).current;
  const ty = useRef(new Animated.Value(0)).current;
  const op = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(tx, { toValue: windDx, duration: 3400, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(ty, { toValue: windDy, duration: 3400, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.sequence([
            Animated.timing(op, { toValue: maxOpacity, duration: 500, useNativeDriver: true }),
            Animated.timing(op, { toValue: 0, duration: 1100, delay: 1400, useNativeDriver: true }),
          ]),
        ]),
        Animated.parallel([
          Animated.timing(tx, { toValue: 0, duration: 0, useNativeDriver: true }),
          Animated.timing(ty, { toValue: 0, duration: 0, useNativeDriver: true }),
          Animated.timing(op, { toValue: 0, duration: 0, useNativeDriver: true }),
        ]),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const c        = size / 2;
  const spokeLen = size * 0.42;
  const tineLen  = size * 0.20;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: left - c,
        top: top - c,
        width: size,
        height: size,
        opacity: op,
        transform: [{ translateX: tx }, { translateY: ty }],
      }}
    >
      <Svg width={size} height={size}>
        <Path
          d={spokeAndUmbrella(c, c, angle, spokeLen, tineLen, 10, 85)}
          stroke="rgba(255,255,255,0.65)"
          strokeWidth={0.7}
          fill="none"
          strokeLinecap="round"
        />
      </Svg>
    </Animated.View>
  );
}

// ─── screen ───────────────────────────────────────────────────────────────────

export function MatchRevealScreen({ navigation }) {
  const bloom       = useRef(new Animated.Value(0)).current;
  const fade        = useRef(new Animated.Value(0)).current;
  const txtOp       = useRef(new Animated.Value(0)).current;
  const txtY        = useRef(new Animated.Value(14)).current;
  const sway        = useRef(new Animated.Value(0)).current;
  const swayAnimRef = useRef(null);

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(bloom, { toValue: 1, delay: 200, tension: 36, friction: 7, useNativeDriver: true }),
        Animated.timing(fade,  { toValue: 1, duration: 500, delay: 200, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(txtOp, { toValue: 1, duration: 600, delay: 80, useNativeDriver: true }),
        Animated.timing(txtY,  { toValue: 0, duration: 500, delay: 80, useNativeDriver: true }),
      ]),
    ]).start(() => {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(sway, { toValue: 1,    duration: 2600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(sway, { toValue: -0.5, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(sway, { toValue: 0.8,  duration: 2400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(sway, { toValue: -0.3, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(sway, { toValue: 0.6,  duration: 2200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(sway, { toValue: 0,    duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ])
      );
      swayAnimRef.current = loop;
      loop.start();
    });
  }, []);

  const handleEnterSeason = () => {
    swayAnimRef.current?.stop();
    navigation.replace('Home');
  };

  const swayRotation = sway.interpolate({ inputRange: [-1, 1], outputRange: ['-5deg', '5deg'] });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Image
        source={require('../../assets/splash background.png')}
        style={[StyleSheet.absoluteFill, styles.bgImage]}
        resizeMode="cover"
      />
      <View style={[StyleSheet.absoluteFill, styles.bgOverlay]} />

      <View style={styles.container}>
        <View style={styles.content}>

          {/* ── dandelion canvas ── */}
          <View style={{ width: CANVAS, height: CANVAS }}>

            <Animated.View style={{
              width: CANVAS, height: CANVAS,
              opacity: fade,
              transform: [
                { scale: bloom },
                { translateY:  PIVOT_OFFSET },
                { rotate: swayRotation },
                { translateY: -PIVOT_OFFSET },
              ],
            }}>
                <Svg width={CANVAS} height={CANVAS} style={StyleSheet.absoluteFill}>
                  <Defs>
                    {SEEDS.filter(s => !s.unknown).map((s) => {
                      const i = SEEDS.indexOf(s);
                      const { x: px, y: py } = tip(s);
                      const ro = s.isYou ? 18 : 15;
                      return (
                        <ClipPath key={'cp' + i} id={'cp' + i}>
                          <Circle cx={px} cy={py} r={ro} />
                        </ClipPath>
                      );
                    })}
                    {SEEDS.filter(s => s.unknown).map((s) => {
                      const i = SEEDS.indexOf(s);
                      const { x: px, y: py } = tip(s);
                      const ro = 15;
                      return (
                        <Mask key={'qm' + i} id={'qm' + i}>
                          <Circle cx={px} cy={py} r={ro} fill="white" />
                          <SvgText
                            x={px}
                            y={py + ro * 0.38}
                            textAnchor="middle"
                            fontSize={ro * 1.15}
                            fontWeight="400"
                            fontFamily="System"
                            fill="black"
                          >?</SvgText>
                        </Mask>
                      );
                    })}
                  </Defs>
                  <Path d={mainStemD()} stroke="rgba(255,255,255,0.40)" strokeWidth={1.5} fill="none" strokeLinecap="round" />
                  <Path d={innerCoreD()}  stroke="rgba(255,255,255,0.15)" strokeWidth={0.5}  fill="none" strokeLinecap="round" />
                  <Path d={innerMidD()}   stroke="rgba(255,255,255,0.22)" strokeWidth={0.55} fill="none" strokeLinecap="round" />
                  <Path d={innerFluffD()} stroke="rgba(255,255,255,0.30)" strokeWidth={0.6}  fill="none" strokeLinecap="round" />
                  {SEEDS.map((s, i) => (
                    <Path key={'fi' + i} d={filamentD(s)} stroke="rgba(255,255,255,0.60)" strokeWidth={0.9} fill="none" strokeLinecap="round" />
                  ))}
                  {SEEDS.map((s, i) => (
                    <Path key={'sb' + i} d={seedBodyD(s)} fill="rgba(255,255,255,0.28)" stroke="rgba(255,255,255,0.40)" strokeWidth={0.5} />
                  ))}
                  <Circle cx={CX} cy={CY} r={26} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={0.7} />
                  <Circle cx={CX} cy={CY} r={18} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth={0.7} />
                  <Circle cx={CX} cy={CY} r={11} fill="rgba(255,255,255,0.20)" />
                  <Circle cx={CX} cy={CY} r={5}  fill="rgba(255,255,255,0.40)" />
                  {SEEDS.map((s, i) => {
                    const { x: px, y: py } = tip(s);
                    const ro  = s.isYou ? 18 : 15;
                    const uri = !s.unknown && AVATARS[i]?.avatar?.uri;
                    return (
                      <G key={'prf' + i}>
                        {uri ? (
                          <SvgImage
                            href={uri}
                            x={px - ro}
                            y={py - ro}
                            width={ro * 2}
                            height={ro * 2}
                            clipPath={`url(#cp${i})`}
                            preserveAspectRatio="xMidYMid slice"
                          />
                        ) : (
                          <Circle cx={px} cy={py} r={ro} fill="rgba(255,255,255,0.55)" mask={`url(#qm${i})`} />
                        )}
                        <Circle
                          cx={px} cy={py} r={ro}
                          fill="none"
                          stroke={s.isYou ? 'rgba(255,255,255,0.70)' : 'rgba(255,255,255,0.35)'}
                          strokeWidth={s.isYou ? 1.8 : 1.2}
                        />
                      </G>
                    );
                  })}
                </Svg>
            </Animated.View>

            {/* Ambient drifting seeds */}
            <DrifterSeed left={CX + 86}  top={CY - 75}  windDx={80}  windDy={-68} angle={-30} delay={1000} maxOpacity={0.62} size={88} />
            <DrifterSeed left={CX - 64}  top={CY - 90}  windDx={60}  windDy={-84} angle={-55} delay={2600} maxOpacity={0.55} size={76} />
            <DrifterSeed left={CX + 116} top={CY + 23}  windDx={96}  windDy={-48} angle={-10} delay={4200} maxOpacity={0.52} size={96} />
            <DrifterSeed left={CX - 102} top={CY - 32}  windDx={50}  windDy={-92} angle={-70} delay={5800} maxOpacity={0.48} size={72} />
            <DrifterSeed left={CX + 52}  top={CY - 108} windDx={66}  windDy={-96} angle={-45} delay={3400} maxOpacity={0.54} size={84} />
            <DrifterSeed left={CX - 30}  top={CY + 62}  windDx={86}  windDy={-58} angle={-18} delay={700}  maxOpacity={0.46} size={70} />
            <DrifterSeed left={CX + 148} top={CY - 50}  windDx={104} windDy={-50} angle={-8}  delay={4900} maxOpacity={0.44} size={80} />
            <DrifterSeed left={CX - 80}  top={CY - 112} windDx={48}  windDy={-78} angle={-62} delay={1800} maxOpacity={0.50} size={68} />
            <DrifterSeed left={CX + 22}  top={CY - 96}  windDx={72}  windDy={-90} angle={-40} delay={6400} maxOpacity={0.42} size={60} />
            <DrifterSeed left={CX - 44}  top={CY + 40}  windDx={90}  windDy={-44} angle={-22} delay={3000} maxOpacity={0.40} size={64} />

          </View>

          {/* ── text ── */}
          <Animated.View style={[styles.textBlock, {
            opacity: txtOp,
            transform: [{ translateY: txtY }],
          }]}>
            <Text style={styles.heading}>Your cohort is ready.</Text>
            <Text style={styles.body}>
              A small group of creators chosen for exactly where you are right now. Connect your creator account to meet them.
            </Text>
          </Animated.View>

        </View>

        {/* ── CTA ── */}
        <Animated.View style={[styles.footerBar, { opacity: txtOp }]}>
          <Button label="Enter the season" variant="solid" color="#000000" textColor="#ffffff" onPress={handleEnterSeason} />
        </Animated.View>

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: '#0D0B14' },
  bgImage:   { width: '100%', height: '100%' },
  bgOverlay: { backgroundColor: 'rgba(0,0,0,0.35)' },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    paddingHorizontal: contentPadding,
    gap: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBlock: { gap: 12, alignItems: 'center' },
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
  footerBar: {
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: contentPadding,
  },
});
