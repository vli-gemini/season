import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const PROVIDERS = {
  google: {
    label: 'Continue with Google',
    icon: 'logo-google',
    iconColor: '#DB4437',
    glass: true,
  },
  apple: {
    label: 'Continue with Apple',
    icon: 'logo-apple',
    iconColor: '#FFFFFF',
    glass: true,
  },
  facebook: {
    label: 'Continue with Facebook',
    icon: 'logo-facebook',
    iconColor: '#FFFFFF',
    glass: false,
    backgroundColor: '#1877F2',
    textColor: '#FFFFFF',
  },
  email: {
    label: 'Continue with Email',
    icon: 'mail-outline',
    iconColor: 'rgba(255,255,255,0.65)',
    glass: true,
    subtle: true,
  },
  youtube: {
    label: 'Connect YouTube',
    icon: 'logo-youtube',
    iconColor: '#FF0000',
    glass: true,
  },
  instagram: {
    label: 'Connect Instagram',
    icon: 'logo-instagram',
    iconColor: '#E1306C',
    glass: true,
  },
  tiktok: {
    label: 'Connect TikTok',
    icon: 'musical-notes',
    iconColor: '#FFFFFF',
    glass: false,
    backgroundColor: '#010101',
    textColor: '#FFFFFF',
  },
};

export function SocialAuthButton({ provider, onPress }) {
  const config = PROVIDERS[provider];

  if (!config.glass) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel={config.label}
        style={[styles.container, { backgroundColor: config.backgroundColor }]}
      >
        <View style={styles.iconWrapper}>
          <Ionicons name={config.icon} size={18} color={config.iconColor} />
        </View>
        <Text style={[styles.label, { color: config.textColor }]}>{config.label}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.82}
      accessibilityRole="button"
      accessibilityLabel={config.label}
      style={styles.glassContainer}
    >
      <BlurView intensity={18} tint="dark" style={StyleSheet.absoluteFill} />
      <View
        style={[
          StyleSheet.absoluteFill,
          styles.glassOverlay,
          config.subtle && styles.glassOverlaySubtle,
        ]}
      />
      <View style={styles.iconWrapper}>
        <Ionicons name={config.icon} size={18} color={config.iconColor} />
      </View>
      <Text style={[styles.label, config.subtle ? styles.labelSubtle : styles.labelGlass]}>
        {config.label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: 999,
    paddingHorizontal: 20,
  },
  glassContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: 999,
    paddingHorizontal: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  glassOverlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.09)',
    borderRadius: 999,
  },
  glassOverlaySubtle: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  iconWrapper: {
    width: 24,
    alignItems: 'center',
  },
  label: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    lineHeight: 20,
    marginRight: 24,
  },
  labelGlass: {
    color: '#FFFFFF',
  },
  labelSubtle: {
    color: colors.textSecondary,
  },
});
