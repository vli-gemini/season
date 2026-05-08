import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { LinearGradient } from '../components/Gradient';
import { Button } from '../components/Button';

const PROVIDER_LABELS = {
  youtube:   'YouTube',
  instagram: 'Instagram',
  tiktok:    'TikTok',
};

const PROVIDER_ICONS = {
  youtube:   'logo-youtube',
  instagram: 'logo-instagram',
  tiktok:    'musical-notes',
};

export function WaitlistScreen({ navigation, route }) {
  const {
    answers = {},
    verifiedEmail = null,
    verifiedProvider = null,
  } = route.params ?? {};

  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleJoin = () => {
    // TODO: POST { answers, email: verifiedEmail ?? email } to backend
    setSubmitted(true);
  };

  const canSubmit = verifiedEmail ? true : email.includes('@');

  if (submitted) {
    return (
      <SafeAreaView style={styles.safe}>
        <LinearGradient
          colors={colors.gradientBackground}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.orbCenter} />
        <View style={styles.content}>
          <View style={styles.letterCard}>
            {Array.from({ length: 8 }).map((_, i) => (
              <View key={i} style={[styles.letterLine, { top: 48 + i * 30 }]} pointerEvents="none" />
            ))}
            <View style={styles.letterMargin} pointerEvents="none" />
            <View style={styles.letterSeal} accessible accessibilityLabel="Success">
              <Ionicons name="checkmark" size={16} color="#fff" />
            </View>
            <Text style={styles.letterHeading}>You're on{'\n'}the list.</Text>
            <Text style={styles.letterBody}>
              We'll reach out to{'\n'}
              <Text style={styles.letterEmailHighlight}>
                {verifiedEmail ?? email}
              </Text>
              {'\n'}when your cohort is ready.
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.replace('MatchReveal')}
            style={styles.skipBtn}
          >
            <Text style={styles.skip}>Preview your match</Text>
            <Ionicons name="arrow-forward" size={14} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={colors.gradientBackground}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.orbCenter} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <View style={styles.content}>

          {verifiedEmail ? (
            // ── Path A: OAuth returned an email (YouTube / Google) ──────────
            <>
              <View style={styles.headingBlock}>
                <Text style={styles.heading}>Your season{'\n'}is coming.</Text>
                <Text style={styles.body}>
                  We'll email you when your cohort is ready.
                </Text>
              </View>

              {/* Verified email card */}
              <View style={styles.verifiedCard}>
                <BlurView intensity={22} tint="dark" style={StyleSheet.absoluteFill} />
                <View style={[StyleSheet.absoluteFill, styles.verifiedOverlay]} />
                <View style={styles.verifiedRow}>
                  <View style={styles.verifiedIconWrap}>
                    <Ionicons
                      name={PROVIDER_ICONS[verifiedProvider] ?? 'checkmark-circle'}
                      size={16}
                      color={colors.accent}
                    />
                  </View>
                  <View style={styles.verifiedTextBlock}>
                    <Text style={styles.verifiedLabel}>
                      Connected via {PROVIDER_LABELS[verifiedProvider] ?? 'your account'}
                    </Text>
                    <Text style={styles.verifiedEmail}>{verifiedEmail}</Text>
                  </View>
                  <Ionicons name="checkmark-circle" size={18} color={colors.accent} />
                </View>
              </View>

              <Button label="Join the waitlist" onPress={handleJoin} />
            </>
          ) : (
            // ── Path B: No email from OAuth (TikTok / Instagram) ────────────
            <>
              <View style={styles.headingBlock}>
                <Text style={styles.heading}>Your season{'\n'}is coming.</Text>
                <Text style={styles.body}>
                  {verifiedProvider
                    ? `${PROVIDER_LABELS[verifiedProvider] ?? 'That platform'} doesn't share your email with us — drop it here so we can reach you when your cohort is ready.`
                    : "We'll email you when your cohort is ready."}
                </Text>
              </View>

              {/* Connected badge */}
              {verifiedProvider && (
                <View style={styles.connectedBadge}>
                  <BlurView intensity={14} tint="dark" style={StyleSheet.absoluteFill} />
                  <View style={[StyleSheet.absoluteFill, styles.connectedOverlay]} />
                  <Ionicons
                    name={PROVIDER_ICONS[verifiedProvider] ?? 'checkmark-circle'}
                    size={14}
                    color={colors.accent}
                  />
                  <Text style={styles.connectedText}>
                    {PROVIDER_LABELS[verifiedProvider]} verified
                  </Text>
                  <Ionicons name="checkmark-circle" size={14} color={colors.accent} />
                </View>
              )}

              {/* Email input */}
              <View style={styles.inputGlass}>
                <BlurView intensity={22} tint="dark" style={StyleSheet.absoluteFill} />
                <View style={[StyleSheet.absoluteFill, styles.inputOverlay]} />
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    placeholder="Email address"
                    placeholderTextColor={colors.textMuted}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    accessibilityLabel="Email address"
                    onSubmitEditing={canSubmit ? handleJoin : undefined}
                    returnKeyType="send"
                  />
                  <TouchableOpacity
                    style={[styles.arrowBtn, canSubmit && styles.arrowBtnActive]}
                    onPress={handleJoin}
                    disabled={!canSubmit}
                    accessibilityRole="button"
                    accessibilityLabel="Submit email"
                  >
                    <Ionicons name="arrow-up" size={16} color="rgba(255,255,255,0.9)" />
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  orbCenter: {
    position: 'absolute',
    top: '25%',
    alignSelf: 'center',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(123, 111, 255, 0.07)',
  },
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 24,
  },
  headingBlock: {
    alignItems: 'center',
    gap: 12,
  },
  heading: {
    fontSize: 40,
    fontFamily: 'DMSerifDisplay_400Regular',
    color: '#EDD9FF',
    lineHeight: 50,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  body: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
    lineHeight: 23,
    textAlign: 'center',
  },

  // ── Verified email card (Path A) ─────────────────────────────────────────
  verifiedCard: {
    width: '100%',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  verifiedOverlay: {
    backgroundColor: 'rgba(123, 111, 255, 0.08)',
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 16,
    gap: 12,
  },
  verifiedIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(123, 111, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedTextBlock: {
    flex: 1,
    gap: 2,
  },
  verifiedLabel: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.textMuted,
    letterSpacing: 0.3,
  },
  verifiedEmail: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.textPrimary,
  },

  // ── Connected badge (Path B, when provider is known) ─────────────────────
  connectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  connectedOverlay: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  connectedText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.textSecondary,
  },

  // ── Email input (Path B) ──────────────────────────────────────────────────
  inputGlass: {
    width: '100%',
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  inputOverlay: {
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    paddingLeft: 22,
    paddingRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textPrimary,
  },
  arrowBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowBtnActive: {
    backgroundColor: colors.accentVibrant,
    borderColor: colors.accent,
  },

  // ── Submitted state (shared) ──────────────────────────────────────────────
  letterCard: {
    width: '100%',
    backgroundColor: '#F0EBE1',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#DDD5C8',
    paddingTop: 28,
    paddingBottom: 32,
    paddingLeft: 52,
    paddingRight: 24,
    overflow: 'hidden',
    position: 'relative',
    transform: [{ rotate: '-1.5deg' }],
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 9,
    minHeight: 220,
  },
  letterLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(176, 163, 148, 0.45)',
  },
  letterMargin: {
    position: 'absolute',
    left: 42,
    top: 0,
    bottom: 0,
    width: 1.5,
    backgroundColor: 'rgba(200, 65, 65, 0.28)',
  },
  letterSeal: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#7B6FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    shadowColor: '#7B6FFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 6,
  },
  letterHeading: {
    fontSize: 38,
    fontFamily: 'DMSerifDisplay_400Regular',
    color: '#2A231E',
    lineHeight: 46,
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  letterBody: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6B5E55',
    lineHeight: 23,
  },
  letterEmailHighlight: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#2A231E',
  },
  skipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    opacity: 0.7,
  },
  skip: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textMuted,
  },
});
