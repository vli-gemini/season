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
import { colors } from '../theme/colors';
import { contentPadding } from '../theme/layout';
import { LinearGradient } from '../components/Gradient';
import { RadioOption } from '../components/RadioOption';
import { Button } from '../components/Button';
import { quizQuestions } from '../data/quizQuestions';

export function QuizScreen({ navigation, route }) {
  const { questionIndex = 0 } = route.params || {};
  const question = quizQuestions[questionIndex];
  const total = quizQuestions.length;

  const [selected, setSelected] = useState([]);
  const [handles, setHandles] = useState({});

  const isSocialHandles = question.type === 'social_handles';
  const isMultiSelect = question.multiSelect;

  const canAdvance = isSocialHandles
    ? Object.values(handles).some((v) => v.trim().length > 0)
    : selected.length > 0;

  const handleSelect = (id) => {
    if (isMultiSelect) {
      setSelected((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      );
    } else {
      setSelected([id]);
    }
  };

  const handleNext = () => {
    const nextIndex = questionIndex + 1;
    if (nextIndex < total) {
      navigation.push('Quiz', { questionIndex: nextIndex });
    } else {
      navigation.replace('Waitlist');
    }
  };

  const progress = (questionIndex + 1) / total;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
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
        <View style={styles.layout}>

          {/* Top content */}
          <View>
            {/* Progress bar + step counter */}
            <View style={styles.progressRow}>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
              </View>
              <TouchableOpacity
                onPress={questionIndex > 0 ? () => navigation.goBack() : undefined}
                disabled={questionIndex === 0}
                style={[styles.backBtn, questionIndex === 0 && styles.backBtnHidden]}
                accessibilityRole="button"
                accessibilityLabel="Go back"
                accessible={questionIndex > 0}
              >
                <Text style={styles.backIcon}>←</Text>
              </TouchableOpacity>
              <Text style={styles.stepLabel}>{questionIndex + 1}/{total}</Text>
            </View>

            {/* Question */}
            <Text style={styles.question}>{question.question}</Text>
            {question.subtitle && (
              <Text style={styles.questionSub}>{question.subtitle}</Text>
            )}

            {/* Options */}
            <View style={styles.options}>
              {isSocialHandles
                ? question.platforms.map((platform) => (
                    <View key={platform.id} style={styles.handleRow}>
                      <View style={styles.handleIcon}>
                        <Text style={styles.handleIconText}>
                          {platform.id === 'youtube' ? '▶' : '♪'}
                        </Text>
                      </View>
                      <TextInput
                        style={styles.handleInput}
                        placeholder={`${platform.label} @${platform.placeholder}`}
                        placeholderTextColor={colors.textMuted}
                        value={handles[platform.id] || ''}
                        onChangeText={(v) =>
                          setHandles((prev) => ({ ...prev, [platform.id]: v }))
                        }
                        autoCapitalize="none"
                        autoCorrect={false}
                        accessibilityLabel={`${platform.label} username`}
                      />
                    </View>
                  ))
                : question.options.map((opt) => (
                    <RadioOption
                      key={opt.id}
                      label={opt.label}
                      selected={selected.includes(opt.id)}
                      onPress={() => handleSelect(opt.id)}
                      multiSelect={isMultiSelect}
                    />
                  ))}
            </View>
          </View>

          {/* Button */}
          <Button
            label={questionIndex === total - 1 ? 'Finish' : 'Next'}
            onPress={handleNext}
            disabled={!canAdvance}
          />
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
  layout: {
    flex: 1,
    paddingHorizontal: contentPadding,
    paddingTop: 48,
    paddingBottom: 48,
    justifyContent: 'space-between',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 48,
  },
  progressTrack: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#D9D9D9',
    borderRadius: 8,
  },
  backBtn: {
    padding: 4,
  },
  backBtnHidden: {
    opacity: 0,
  },
  stepLabel: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.textPrimary,
    letterSpacing: 0,
  },
  question: {
    fontSize: 22,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.textPrimary,
    lineHeight: 28,
    marginBottom: 48,
    letterSpacing: 0,
  },
  questionSub: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 24,
    marginTop: -36,
  },
  options: {
    gap: 24,
  },
  handleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundCard,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(148,148,148,0.5)',
    paddingHorizontal: 24,
    height: 72,
  },
  handleIcon: {
    width: 28,
    alignItems: 'center',
  },
  handleIconText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
  },
  handleInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.textPrimary,
    paddingLeft: 8,
  },
});
