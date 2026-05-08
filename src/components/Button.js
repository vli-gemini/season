import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors } from '../theme/colors';

export function Button({ label, onPress, variant = 'primary', color, textColor, loading = false, disabled = false, style }) {
  const isDisabled = disabled || loading;

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.82}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled }}
        style={[styles.touchable, styles.primaryBg, isDisabled && styles.disabled, style]}
      >
        {loading ? (
          <ActivityIndicator color={colors.textPrimary} size="small" />
        ) : (
          <Text style={styles.labelPrimary}>{label}</Text>
        )}
      </TouchableOpacity>
    );
  }

  if (variant === 'solid') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.82}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled }}
        style={[styles.touchable, { backgroundColor: color }, isDisabled && styles.disabled, style]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={[styles.labelSolid, textColor && { color: textColor }]}>{label}</Text>
        )}
      </TouchableOpacity>
    );
  }

  if (variant === 'outline') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.75}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled }}
        style={[styles.touchable, styles.outlineBorder, isDisabled && styles.disabled, style]}
      >
        <BlurView intensity={14} tint="light" style={StyleSheet.absoluteFill} />
        <View style={[StyleSheet.absoluteFill, styles.glassOverlay]} />
        {loading ? (
          <ActivityIndicator color={colors.textPrimary} size="small" />
        ) : (
          <Text style={[styles.label, styles.label_outline]}>{label}</Text>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      style={[styles.base, isDisabled && styles.disabled, style]}
    >
      {loading ? (
        <ActivityIndicator color={colors.textPrimary} size="small" />
      ) : (
        <Text style={[styles.label, styles[`label_${variant}`]]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: {
    height: 56,
    borderRadius: 999,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  primaryBg: {
    backgroundColor: 'rgba(255, 255, 255, 0.80)',
  },
  outlineBorder: {
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  glassOverlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 999,
  },
  labelSolid: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#1C1A2E',
    letterSpacing: 0.2,
  },
  labelPrimary: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#000000',
    letterSpacing: 0.2,
  },
  base: {
    height: 52,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  disabled: {
    opacity: 0.38,
  },
  label: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    letterSpacing: 0.2,
  },
  label_outline: {
    color: colors.textPrimary,
  },
  label_ghost: {
    color: colors.textSecondary,
  },
});
