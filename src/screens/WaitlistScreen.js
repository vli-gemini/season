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
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { LinearGradient } from '../components/Gradient';

export function WaitlistScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (email.includes('@')) setSubmitted(true);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={colors.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <View style={styles.content}>
          {submitted ? (
            <>
              <Text style={styles.heading}>You're on the list.</Text>
              <Text style={styles.body}>We'll email you when your cohort is ready.</Text>
              <TouchableOpacity onPress={() => navigation.replace('Home')}>
                <Text style={styles.skip}>Skip to app →</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.heading}>Animation</Text>
              <Text style={styles.body}>
                Your season is coming.{'\n'}We'll email you when your cohort is ready.
              </Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="Email address"
                  placeholderTextColor="#545454"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  accessibilityLabel="Email address"
                  onSubmitEditing={handleSubmit}
                  returnKeyType="send"
                />
                <TouchableOpacity
                  style={[styles.arrowBtn, email.includes('@') && styles.arrowBtnActive]}
                  onPress={handleSubmit}
                  disabled={!email.includes('@')}
                  accessibilityRole="button"
                  accessibilityLabel="Submit email"
                >
                  <Ionicons name="arrow-up" size={16} color="rgba(255,255,255,0.9)" />
                </TouchableOpacity>
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
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 34,
    gap: 32,
  },
  heading: {
    fontSize: 48,
    fontFamily: 'DMSerifDisplay_400Regular',
    color: '#F7DCB9',
    lineHeight: 58,
    textAlign: 'center',
  },
  body: {
    fontSize: 17,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.textPrimary,
    lineHeight: 22,
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 100,
    backgroundColor: 'rgba(0,0,0,0.25)',
    paddingLeft: 20,
    paddingRight: 8,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  input: {
    flex: 1,
    fontSize: 17,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textPrimary,
    height: '100%',
  },
  arrowBtn: {
    width: 28,
    height: 28,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowBtnActive: {
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  skip: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textMuted,
  },
});
