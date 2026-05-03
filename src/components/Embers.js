import { useEffect, useRef, useMemo } from 'react';
import { View, Animated, Dimensions, StyleSheet } from 'react-native';
import { TOTAL_DAYS } from '../config/season';

const { width: SW, height: SH } = Dimensions.get('window');

const EMBER_START_DAY = 24;
const COLORS = ['#FF8C40', '#FFA855', '#FFD070', '#FF6020', '#FFEDE0'];

function getCount(day, total) {
  if (day < EMBER_START_DAY) return 0;
  const t = (day - EMBER_START_DAY) / (total - EMBER_START_DAY);
  return Math.round(4 + t * 16);
}

function Ember({ x, startY, size, color, duration, delay }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: 1, duration, useNativeDriver: false }),
        Animated.timing(anim, { toValue: 0, duration: 1, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  // Starts within the viewport (bottom portion) and floats up off the top
  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -(startY + 80)],
  });
  const translateX = anim.interpolate({
    inputRange: [0, 0.3, 0.6, 1],
    outputRange: [0, 14, -10, 8],
  });
  const opacity = anim.interpolate({
    inputRange: [0, 0.06, 0.8, 1],
    outputRange: [0, 0.9, 0.6, 0],
  });
  const scale = anim.interpolate({
    inputRange: [0, 0.6, 1],
    outputRange: [1, 0.75, 0.2],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top: startY,
        left: x,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity,
        transform: [{ translateY }, { translateX }, { scale }],
      }}
    />
  );
}

export function Embers({ currentDay }) {
  const day = currentDay ?? TOTAL_DAYS;
  const count = getCount(day, TOTAL_DAYS);

  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * SW,
        // Start in bottom 40% of screen so they're visible right away
        startY: SH * 0.6 + Math.random() * (SH * 0.4),
        size: 2.5 + Math.random() * 2.5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        duration: 5000 + Math.random() * 4000,
        delay: Math.random() * 4000,
      })),
    [day]
  );

  if (!count) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map(p => (
        <Ember key={p.id} {...p} />
      ))}
    </View>
  );
}
