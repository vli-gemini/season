import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PROVIDERS = {
  google: {
    label: 'Continue with Google',
    icon: 'logo-google',
    iconColor: '#DB4437',
    backgroundColor: '#FFFFFF',
    textColor: '#000000',
  },
  apple: {
    label: 'Continue with Apple',
    icon: 'logo-apple',
    iconColor: '#FFFFFF',
    backgroundColor: '#000000',
    textColor: '#FEFEFE',
  },
  facebook: {
    label: 'Continue with Facebook',
    icon: 'logo-facebook',
    iconColor: '#FFFFFF',
    backgroundColor: '#3C5898',
    textColor: '#FEFEFE',
  },
  email: {
    label: 'Continue with Email',
    icon: 'mail-outline',
    iconColor: '#FFFFFF',
    backgroundColor: '#9A8365',
    textColor: '#FEFEFE',
  },
};

export function SocialAuthButton({ provider, onPress }) {
  const config = PROVIDERS[provider];

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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 100,
    paddingHorizontal: 20,
  },
  iconWrapper: {
    width: 20,
    alignItems: 'center',
  },
  label: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    lineHeight: 20,
    marginRight: 20,
  },
});
