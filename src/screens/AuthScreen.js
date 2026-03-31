import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { SocialAuthButton } from '../components/SocialAuthButton';

export function AuthScreen({ navigation }) {
  const handleProvider = (provider) => {
    // TODO: integrate OAuth
    navigation.navigate('Quiz', { questionIndex: 0 });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.wordmark}>Season</Text>
          <Text style={styles.subtitle}>Your season starts now.</Text>
        </View>

        {/* Auth options */}
        <View style={styles.authSection}>
          <SocialAuthButton provider="google" onPress={() => handleProvider('google')} />
          <SocialAuthButton provider="apple" onPress={() => handleProvider('apple')} />
          <SocialAuthButton provider="facebook" onPress={() => handleProvider('facebook')} />

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <SocialAuthButton provider="email" onPress={() => handleProvider('email')} />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our{' '}
            <Text style={styles.footerLink}>Terms</Text>
            {' & '}
            <Text style={styles.footerLink}>Privacy Policy</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 48,
    paddingBottom: 32,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    paddingBottom: 48,
  },
  wordmark: {
    fontSize: 36,
    fontWeight: '300',
    color: colors.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    letterSpacing: 0.2,
  },
  authSection: {
    flex: 1,
    justifyContent: 'center',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 12,
    color: colors.textMuted,
  },
  footer: {
    paddingTop: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  footerLink: {
    color: colors.textSecondary,
    textDecorationLine: 'underline',
  },
});
