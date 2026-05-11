import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { contentPadding } from '../theme/layout';
import { Button } from '../components/Button';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function EmailScreen({ navigation, route }) {
  const answers = route.params?.answers ?? {};
  const [email, setEmail] = useState('');
  const [dirty, setDirty] = useState(false);

  const isValid = EMAIL_RE.test(email.trim());
  const canContinue = isValid;
  const showError = dirty && email.trim().length > 0 && !isValid;

  const handleContinue = () => {
    if (!isValid) return;
    navigation.replace('Waitlist', { answers, verifiedEmail: email.trim() });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Image
        source={require('../../assets/splash background.png')}
        style={[StyleSheet.absoluteFill, styles.bgImage]}
        resizeMode="cover"
      />
      <View style={[StyleSheet.absoluteFill, styles.bgOverlay]} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <View style={styles.container}>
          <View style={styles.questionFixed}>
            <Text style={styles.question}>One last thing... where should we reach you?</Text>
            <Text style={styles.questionSub}>
              We'll send your group match and updates here.
            </Text>
          </View>

          {/* Header — absolute, same as QuizScreen */}
          <View style={styles.headerBar} pointerEvents="box-none">
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.replace('Quiz', { questionIndex: 7, answers })}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="chevron-back" size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Email input pill */}
          <View style={[styles.inputRow, email.length > 0 && styles.inputRowActive, showError && styles.inputRowError]}>
            <Ionicons name="mail-outline" size={18} color="rgba(255,255,255,0.5)" />
            <TextInput
              style={[styles.input, Platform.OS === 'web' && styles.inputWeb]}
              value={email}
              onChangeText={(v) => { setEmail(v); setDirty(true); }}
              onBlur={() => setDirty(true)}
              placeholder="your@email.com"
              placeholderTextColor="rgba(255,255,255,0.35)"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
              selectionColor="#ffffff"
              cursorColor="#ffffff"
              underlineColorAndroid="transparent"
            />
            {isValid ? (
              <View style={styles.checkCircle}>
                <Ionicons name="checkmark" size={12} color="#fff" />
              </View>
            ) : email.length > 0 ? (
              <TouchableOpacity onPress={() => { setEmail(''); setDirty(false); }} accessibilityLabel="Clear email">
                <Ionicons name="close-circle" size={16} color="rgba(255,255,255,0.4)" />
              </TouchableOpacity>
            ) : null}
          </View>
          {showError && (
            <Text style={styles.errorText}>Please enter a valid email address</Text>
          )}

          <View style={styles.footer}>
            <Button
              label="Finish"
              onPress={handleContinue}
              disabled={!canContinue}
              variant="solid"
              color={canContinue ? '#000000' : 'rgba(255,255,255,0.15)'}
              textColor={canContinue ? '#FFFFFF' : 'rgba(255,255,255,0.35)'}
            />
            <Text style={styles.legal}>
              Your email is only used to notify you about your group. We never share it.
            </Text>
          </View>
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
  flex: {
    flex: 1,
  },
  bgImage: {
    width: '100%',
    height: '100%',
  },
  bgOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  container: {
    flex: 1,
    paddingHorizontal: contentPadding,
    paddingBottom: 40,
  },
  headerBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 48,
    paddingBottom: 28,
    paddingHorizontal: contentPadding,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  questionFixed: {
    paddingTop: 124,
    paddingBottom: 32,
    paddingLeft: 8,
  },
  question: {
    fontSize: 26,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#fff',
    lineHeight: 34,
    letterSpacing: -0.3,
  },
  questionSub: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 21,
    marginTop: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 64,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 24,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#fff',
  },
  inputWeb: {
    outlineStyle: 'none',
    caretColor: '#ffffff',
    accentColor: '#ffffff',
  },
  inputRowActive: {
    borderColor: '#777',
    backgroundColor: 'rgba(0,0,0,0.30)',
  },
  inputRowError: {
    borderColor: '#FF4D4D',
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#FF6B6B',
    paddingLeft: 4,
    marginTop: 6,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    marginTop: 'auto',
    gap: 16,
    paddingBottom: 8,
  },
  legal: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.35)',
    textAlign: 'center',
    lineHeight: 16,
  },
});
