import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Line, Circle } from 'react-native-svg';
import { colors } from '../theme/colors';
import { contentPadding } from '../theme/layout';
import { Button } from '../components/Button';

// Dandelion seeds: angle (degrees), stem length, avatar radius
// Spread across a full circle with varied lengths for organic feel
const SEEDS = [
  { angle: -90, length: 88, r: 22 },   // top — "you"
  { angle: -45, length: 76, r: 18 },
  { angle: -15, length: 82, r: 18 },
  { angle:  20, length: 70, r: 18 },
  { angle:  55, length: 78, r: 18 },
  { angle:  90, length: 72, r: 18 },
  { angle: 130, length: 80, r: 18 },
  { angle: 165, length: 74, r: 18 },
  { angle: -155, length: 82, r: 18 },
  { angle: -120, length: 76, r: 18 },
];

const CANVAS = 280; // SVG canvas size
const CX = CANVAS / 2;
const CY = CANVAS / 2;

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

function DandelionSeed({ seed, index, stemProgress, avatarOpacity }) {
  const rad = toRad(seed.angle);
  const isYou = index === 0;

  const tipX = CX + Math.cos(rad) * seed.length;
  const tipY = CY + Math.sin(rad) * seed.length;

  // Animated stem end point via interpolation
  const animX = stemProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [CX, tipX],
  });
  const animY = stemProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [CY, tipY],
  });

  return (
    <>
      {/* Avatar circle at tip */}
      <Animated.View
        style={[
          styles.seedAvatar,
          isYou ? styles.seedAvatarYou : styles.seedAvatarLocked,
          {
            width: seed.r * 2,
            height: seed.r * 2,
            borderRadius: seed.r,
            left: tipX - seed.r,
            top: tipY - seed.r,
            opacity: avatarOpacity,
          },
        ]}
      >
        {isYou ? (
          <Text style={styles.youLabelText}>you</Text>
        ) : (
          <Ionicons name="lock-closed" size={10} color="rgba(255,255,255,0.30)" />
        )}
      </Animated.View>
    </>
  );
}

function DandelionSvg({ stemProgress }) {
  return (
    <Svg width={CANVAS} height={CANVAS}>
      {/* Center dot */}
      <Circle cx={CX} cy={CY} r={4} fill="rgba(255,255,255,0.25)" />
      {SEEDS.map((seed, i) => {
        const rad = toRad(seed.angle);
        const tipX = CX + Math.cos(rad) * seed.length;
        const tipY = CY + Math.sin(rad) * seed.length;
        return (
          <Line
            key={i}
            x1={CX}
            y1={CY}
            x2={tipX}
            y2={tipY}
            stroke="rgba(255,255,255,0.20)"
            strokeWidth={0.8}
          />
        );
      })}
    </Svg>
  );
}

export function MatchRevealScreen({ navigation }) {
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentY = useRef(new Animated.Value(12)).current;
  const stemProgress = useRef(new Animated.Value(0)).current;
  const avatarOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(stemProgress, { toValue: 1, duration: 800, delay: 100, useNativeDriver: false }),
      Animated.timing(avatarOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();

    Animated.parallel([
      Animated.timing(contentOpacity, { toValue: 1, duration: 700, delay: 1000, useNativeDriver: true }),
      Animated.timing(contentY, { toValue: 0, duration: 600, delay: 1000, useNativeDriver: true }),
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

      <View style={styles.container}>

        {/* Dandelion */}
        <View style={styles.dandelionWrap}>
          <View style={{ width: CANVAS, height: CANVAS }}>
            <DandelionSvg stemProgress={stemProgress} />
            {SEEDS.map((seed, i) => (
              <DandelionSeed
                key={i}
                seed={seed}
                index={i}
                stemProgress={stemProgress}
                avatarOpacity={avatarOpacity}
              />
            ))}
          </View>

          <View style={styles.cohortBadge}>
            <Ionicons name="people" size={12} color="rgba(255,255,255,0.45)" />
            <Text style={styles.cohortBadgeText}>A small group matched</Text>
          </View>
        </View>

        {/* Heading + body */}
        <Animated.View
          style={[styles.textBlock, { opacity: contentOpacity, transform: [{ translateY: contentY }] }]}
        >
          <Text style={styles.heading}>Your cohort{'\n'}is ready.</Text>
          <Text style={styles.body}>
            A small group of creators chosen for exactly where you are right now. Connect your creator account to meet them.
          </Text>
        </Animated.View>

        {/* CTA */}
        <Animated.View style={[styles.ctaBlock, { opacity: contentOpacity }]}>
          <Button
            label="Enter the season"
            onPress={() => navigation.replace('Home')}
          />
        </Animated.View>

      </View>
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
  container: {
    flex: 1,
    paddingHorizontal: contentPadding,
    paddingBottom: 48,
    gap: 28,
    justifyContent: 'center',
  },
  dandelionWrap: {
    alignItems: 'center',
    gap: 16,
  },
  seedAvatar: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  seedAvatarYou: {
    borderColor: 'rgba(255,255,255,0.50)',
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  seedAvatarLocked: {
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  youLabelText: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.70)',
    letterSpacing: 0.3,
  },
  cohortBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  cohortBadgeText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 0.2,
  },
  textBlock: {
    gap: 12,
  },
  heading: {
    fontSize: 36,
    fontFamily: 'PlusJakartaSans_300Light',
    color: '#ffffff',
    lineHeight: 46,
    letterSpacing: -0.5,
  },
  body: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.55)',
    lineHeight: 23,
  },
  ctaBlock: {
    alignItems: 'stretch',
  },
});
