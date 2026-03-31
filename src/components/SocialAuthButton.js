import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const PROVIDERS = {
  google: { label: 'Continue with Google', icon: 'logo-google', color: '#DB4437' },
  apple: { label: 'Continue with Apple', icon: 'logo-apple', color: '#FFFFFF' },
  facebook: { label: 'Continue with Facebook', icon: 'logo-facebook', color: '#1877F2' },
  email: { label: 'Continue with Email', icon: 'mail-outline', color: colors.textSecondary },
};

export function SocialAuthButton({ provider, onPress }) {
  const config = PROVIDERS[provider];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.container}
    >
      <View style={[styles.iconWrapper, { borderColor: config.color === '#FFFFFF' ? colors.border : 'transparent' }]}>
        <Ionicons name={config.icon} size={18} color={config.color} />
      </View>
      <Text style={styles.label}>{config.label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderRadius: 12,
    backgroundColor: colors.backgroundCard,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  iconWrapper: {
    width: 24,
    alignItems: 'center',
  },
  label: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    marginRight: 24,
  },
});
