import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { Button } from '../components/Button';

export function WaitlistScreen() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (email.includes('@')) {
      setSubmitted(true);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View style={styles.content}>
          <Text style={styles.heading}>Animation</Text>
          {submitted ? (
            <View style={styles.confirmedBox}>
              <Text style={styles.confirmedText}>You're on the list.</Text>
              <Text style={styles.confirmedSub}>We'll email you when your cohort is ready.</Text>
            </View>
          ) : (
            <>
              <Text style={styles.body}>
                Your season is coming.{'\n'}We'll email you when your cohort is ready.
              </Text>
              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Button
                label="Notify me"
                onPress={handleSubmit}
                disabled={!email.includes('@')}
                style={styles.btn}
              />
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
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 80,
  },
  heading: {
    fontSize: 34,
    fontWeight: '300',
    color: colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 16,
  },
  body: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 32,
  },
  input: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundCard,
    paddingHorizontal: 16,
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  btn: {
    marginTop: 4,
  },
  confirmedBox: {
    marginTop: 12,
  },
  confirmedText: {
    fontSize: 22,
    fontWeight: '300',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  confirmedSub: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
});
