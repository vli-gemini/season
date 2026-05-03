import React from 'react';
import { View, StyleSheet } from 'react-native';

export function ProgressBar({ current, total }) {
  const progress = current / total;

  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${progress * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.70)',
    borderRadius: 2,
  },
});
