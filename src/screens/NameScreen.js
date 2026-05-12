import React, { useState, useRef } from 'react';
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

export function NameScreen({ navigation, route }) {
  const answers = route.params?.answers ?? {};
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const lastNameRef = useRef(null);

  const canContinue = firstName.trim().length > 0 && lastName.trim().length > 0;

  const handleContinue = () => {
    if (!canContinue) return;
    navigation.replace('Email', {
      answers,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    });
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
            <Text style={styles.question}>How should we call you?</Text>
            <Text style={styles.questionSub}>
              This is how you'll appear to your group.
            </Text>
          </View>

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

          <View style={styles.inputsCol}>
            <View style={[styles.inputRow, firstName.length > 0 && styles.inputRowActive]}>
              <TextInput
                style={[styles.input, Platform.OS === 'web' && styles.inputWeb]}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="First name"
                placeholderTextColor="rgba(255,255,255,0.35)"
                autoCapitalize="words"
                autoCorrect={false}
                autoFocus
                returnKeyType="next"
                onSubmitEditing={() => lastNameRef.current?.focus()}
                selectionColor="#ffffff"
                cursorColor="#ffffff"
                underlineColorAndroid="transparent"
              />
              {firstName.length > 0 && (
                <View style={styles.checkCircle}>
                  <Ionicons name="checkmark" size={12} color="#fff" />
                </View>
              )}
            </View>

            <View style={[styles.inputRow, lastName.length > 0 && styles.inputRowActive]}>
              <TextInput
                ref={lastNameRef}
                style={[styles.input, Platform.OS === 'web' && styles.inputWeb]}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Last name"
                placeholderTextColor="rgba(255,255,255,0.35)"
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleContinue}
                selectionColor="#ffffff"
                cursorColor="#ffffff"
                underlineColorAndroid="transparent"
              />
              {lastName.length > 0 && (
                <View style={styles.checkCircle}>
                  <Ionicons name="checkmark" size={12} color="#fff" />
                </View>
              )}
            </View>
          </View>

          <View style={styles.footer}>
            <Button
              label="Next"
              onPress={handleContinue}
              disabled={!canContinue}
              variant="solid"
              color={canContinue ? '#000000' : 'rgba(255,255,255,0.15)'}
              textColor={canContinue ? '#FFFFFF' : 'rgba(255,255,255,0.35)'}
            />
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
  inputsCol: {
    gap: 12,
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
  inputRowActive: {
    borderColor: '#777',
    backgroundColor: 'rgba(0,0,0,0.30)',
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
  footer: {
    marginTop: 'auto',
    paddingTop: 24,
    paddingBottom: 24,
  },
});
