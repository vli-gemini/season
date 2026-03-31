import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { ProgressBar } from '../components/ProgressBar';
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
      navigation.replace('Home');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.stepLabel}>
            {questionIndex + 1}/{total}
          </Text>
        </View>

        <View style={styles.progressWrap}>
          <ProgressBar current={questionIndex + 1} total={total} />
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Question */}
          <Text style={styles.question}>{question.question}</Text>
          {question.subtitle && (
            <Text style={styles.questionSub}>{question.subtitle}</Text>
          )}

          {/* Answer options */}
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
        </ScrollView>

        {/* Footer CTA */}
        <View style={styles.footer}>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backBtn: {
    padding: 4,
  },
  backIcon: {
    fontSize: 20,
    color: colors.textSecondary,
  },
  stepLabel: {
    fontSize: 12,
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  progressWrap: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  question: {
    fontSize: 22,
    fontWeight: '300',
    color: colors.textPrimary,
    lineHeight: 32,
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  questionSub: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 24,
  },
  options: {
    marginTop: 16,
  },
  handleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
    paddingHorizontal: 14,
    height: 52,
  },
  handleIcon: {
    width: 28,
    alignItems: 'center',
  },
  handleIconText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  handleInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    paddingLeft: 8,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 36,
    paddingTop: 12,
    backgroundColor: colors.background,
  },
});
