import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from './Gradient';
import { colors } from '../theme/colors';

export function RadioOption({ label, selected, onPress, multiSelect = false }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      accessibilityRole={multiSelect ? 'checkbox' : 'radio'}
      accessibilityState={{ checked: selected }}
      accessibilityLabel={label}
      style={[styles.container, selected && styles.containerSelected]}
    >
      <BlurView intensity={60} tint="light" style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, styles.overlay, selected && styles.overlaySelected]} />

      {selected && (
        <LinearGradient
          colors={['rgba(0,0,0,0.06)', 'rgba(0,0,0,0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.insetShadow}
        />
      )}

      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
      <View style={[styles.indicator, selected && styles.indicatorSelected]}>
        {selected && <Ionicons name="checkmark" size={12} color="#fff" />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    height: 64,
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  containerSelected: {
    borderColor: '#777',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.10)',
  },
  overlaySelected: {
    backgroundColor: 'rgba(0, 0, 0, 0.40)',
  },
  insetShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 8,
  },
  label: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
    paddingRight: 12,
  },
  labelSelected: {
    color: '#fff',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  indicator: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(28, 26, 46, 0.06)',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorSelected: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
});
