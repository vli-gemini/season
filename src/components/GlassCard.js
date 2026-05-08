import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';

export function GlassCard({
  children,
  style,
  intensity = 40,
  borderRadius = 22,
  borderColor = 'rgba(255, 255, 255, 0.60)',
  overlay = 'rgba(255, 255, 255, 0.30)',
  shadow = true,
}) {
  return (
    <View style={[styles.outer, shadow && styles.shadow, { borderRadius }, style]}>
      <View style={[styles.wrapper, { borderRadius, borderColor }]}>
        <BlurView intensity={intensity} tint="light" style={StyleSheet.absoluteFill} />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: overlay }]} />
        {/* Top highlight shimmer */}
        <View style={[styles.highlight, { borderRadius }]} />
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    borderRadius: 22,
  },
  shadow: {
    shadowColor: 'rgba(160, 130, 200, 0.25)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
  },
  wrapper: {
    overflow: 'hidden',
    borderWidth: 1,
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
});
