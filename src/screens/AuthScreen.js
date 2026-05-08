import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { colors } from '../theme/colors';
import { LinearGradient } from '../components/Gradient';
import { SocialAuthButton } from '../components/SocialAuthButton';

export function AuthScreen({ navigation, route }) {
  const answers = route.params?.answers ?? {};

  const handleProvider = (provider) => {
    // YouTube uses Google OAuth, which returns the user's verified email address.
    // TikTok and Instagram do not expose email via their APIs.
    // Replace this stub with the real email from the OAuth token response.
    const verifiedEmail = provider === 'youtube' ? 'you@gmail.com' : null;

    navigation.replace('Waitlist', { answers, verifiedEmail, verifiedProvider: provider });
  };

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

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.wordmark}>Season</Text>
          <Text style={styles.subtitle}>Verify you're an active creator{'\n'}to join the waitlist.</Text>
        </View>

        <View style={styles.glassCard}>
          <BlurView intensity={22} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={[StyleSheet.absoluteFill, styles.cardOverlay]} />

          <View style={styles.authSection}>
            <SocialAuthButton provider="youtube"   onPress={() => handleProvider('youtube')} />
            <SocialAuthButton provider="instagram" onPress={() => handleProvider('instagram')} />
            <SocialAuthButton provider="tiktok"    onPress={() => handleProvider('tiktok')} />
          </View>
        </View>

        <Text style={styles.legalText}>
          We verify you're an active creator. We never post on your behalf.
        </Text>
      </ScrollView>
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
    top: -60,
    left: -40,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(176, 140, 220, 0.12)',
    shadowColor: '#B08CDC',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 80,
  },
  orbBottom: {
    position: 'absolute',
    bottom: 40,
    right: -60,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(100, 160, 180, 0.10)',
    shadowColor: '#64A0B4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 70,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 64,
    paddingBottom: 40,
    gap: 40,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    gap: 16,
  },
  wordmark: {
    fontSize: 54,
    fontFamily: 'DMSerifDisplay_400Regular',
    color: colors.textPrimary,
    lineHeight: 64,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 17,
    fontFamily: 'PlusJakartaSans_300Light',
    color: colors.textSecondary,
    lineHeight: 26,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  glassCard: {
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glassBorder,
    padding: 20,
  },
  cardOverlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  authSection: {
    gap: 10,
  },
  legalText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
});
