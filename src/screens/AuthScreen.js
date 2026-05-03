import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { LinearGradient } from '../components/Gradient';
import { SocialAuthButton } from '../components/SocialAuthButton';

export function AuthScreen({ navigation }) {
  const handleProvider = (provider) => {
    navigation.navigate('Quiz', { questionIndex: 0 });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={colors.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.wordmark}>Season</Text>
          <Text style={styles.subtitle}>Your season starts now.</Text>
        </View>

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
    paddingHorizontal: 32,
    paddingVertical: 196,
    gap: 80,
  },
  header: {
    alignItems: 'center',
    gap: 32,
  },
  wordmark: {
    fontSize: 48,
    fontFamily: 'DMSerifDisplay_400Regular',
    color: '#F7DCB9',
    lineHeight: 58,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 17,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.textPrimary,
    lineHeight: 22,
    textAlign: 'center',
  },
  authSection: {
    gap: 12,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dividerText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#98989D',
    lineHeight: 16,
  },
});
