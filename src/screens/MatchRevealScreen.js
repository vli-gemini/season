import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from '../components/Gradient';
import { colors } from '../theme/colors';
import { contentPadding } from '../theme/layout';
import { Button } from '../components/Button';

const AVATAR_COLORS = [
  'rgba(176, 140, 220, 0.50)',
  'rgba(138, 173, 160, 0.50)',
  'rgba(130, 180, 210, 0.50)',
  'rgba(210, 150, 180, 0.50)',
  'rgba(120, 185, 195, 0.50)',
  'rgba(195, 155, 225, 0.50)',
  'rgba(175, 195, 155, 0.50)',
];

function LockedAvatar({ color, delay }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 600,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.avatarSlot, { opacity }]}>
      <View style={[styles.avatarCircle, { backgroundColor: color }]} />
      <BlurView intensity={28} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.avatarLockOverlay}>
        <Ionicons name="lock-closed" size={13} color="rgba(255,255,255,0.5)" />
      </View>
    </Animated.View>
  );
}

function YouAvatar({ delay }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 700, delay, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, delay, useNativeDriver: true, tension: 60 }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.avatarSlot, { opacity, transform: [{ scale }] }]}>
      <LinearGradient
        colors={colors.gradientAccent}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.youCircle}
      />
      <View style={styles.youLabel}>
        <Text style={styles.youLabelText}>You</Text>
      </View>
    </Animated.View>
  );
}

export function MatchRevealScreen({ navigation }) {
  const headingOpacity = useRef(new Animated.Value(0)).current;
  const headingY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headingOpacity, { toValue: 1, duration: 700, delay: 700, useNativeDriver: true }),
      Animated.timing(headingY, { toValue: 0, duration: 600, delay: 700, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={colors.gradientBackground}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.orbTop} />
      <View style={styles.orbBottom} />

      <View style={styles.container}>
        <Text style={styles.wordmark}>Season</Text>

        {/* Cohort grid */}
        <View style={styles.gridWrap}>
          <View style={styles.grid}>
            <YouAvatar delay={100} />
            {AVATAR_COLORS.map((color, i) => (
              <LockedAvatar key={i} color={color} delay={150 + i * 60} />
            ))}
          </View>

          {/* Glass overlay label */}
          <View style={styles.cohortBadge}>
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={[StyleSheet.absoluteFill, styles.cohortBadgeOverlay]} />
            <Ionicons name="people" size={13} color={colors.accent} />
            <Text style={styles.cohortBadgeText}>A small group matched</Text>
          </View>
        </View>

        {/* Heading */}
        <Animated.View
          style={[styles.textBlock, { opacity: headingOpacity, transform: [{ translateY: headingY }] }]}
        >
          <Text style={styles.heading}>Your cohort{'\n'}is ready.</Text>
          <Text style={styles.body}>
            A small group of creators chosen for exactly where you are right now. Connect your creator account to meet them.
          </Text>
        </Animated.View>

        {/* CTA */}
        <Animated.View style={[styles.ctaBlock, { opacity: headingOpacity }]}>
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
  orbTop: {
    position: 'absolute',
    top: -40,
    left: -60,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(123, 111, 255, 0.13)',
  },
  orbBottom: {
    position: 'absolute',
    bottom: 60,
    right: -60,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(138, 173, 160, 0.10)',
  },
  container: {
    flex: 1,
    paddingHorizontal: contentPadding,
    paddingTop: 20,
    paddingBottom: 48,
    gap: 36,
    justifyContent: 'center',
  },
  wordmark: {
    fontSize: 17,
    fontFamily: 'PlusJakartaSans_300Light',
    color: colors.textPrimary,
    letterSpacing: 0.5,
    opacity: 0.8,
    textAlign: 'center',
  },
  gridWrap: {
    alignItems: 'center',
    gap: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    width: 240,
  },
  avatarSlot: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  avatarCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 26,
  },
  avatarLockOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  youCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 26,
  },
  youLabel: {
    position: 'absolute',
    bottom: -18,
    alignSelf: 'center',
  },
  youLabelText: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.textSecondary,
    letterSpacing: 0.3,
  },
  cohortBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  cohortBadgeOverlay: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  cohortBadgeText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.textSecondary,
    letterSpacing: 0.2,
  },
  textBlock: {
    gap: 14,
  },
  heading: {
    fontSize: 40,
    fontFamily: 'DMSerifDisplay_400Regular',
    color: '#EDD9FF',
    lineHeight: 50,
    letterSpacing: -0.5,
  },
  body: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
    lineHeight: 23,
  },
  ctaBlock: {
    gap: 18,
    alignItems: 'center',
  },
  laterText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textMuted,
  },
});
