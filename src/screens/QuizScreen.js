import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SvgXml } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { colors } from '../theme/colors';
import { contentPadding } from '../theme/layout';
import { LinearGradient } from '../components/Gradient';
import { RadioOption } from '../components/RadioOption';
import { Button } from '../components/Button';
import { quizQuestions, PLATFORM_META } from '../data/quizQuestions';
import { SOCIAL_ICONS } from '../data/socialIcons';


const PLATFORM_IMAGE_OVERRIDES = {
  youtube:   { source: require('../../assets/social-icons-svg/youtube.png'),   resizeMode: 'contain' },
  tiktok:    { source: require('../../assets/social-icons-svg/tiktok.avif'),   resizeMode: 'cover' },
  instagram: { source: require('../../assets/social-icons-svg/Instagram.png'), resizeMode: 'cover' },
  twitter:   { source: require('../../assets/social-icons-svg/x.png'),         resizeMode: 'cover' },
  facebook:  { source: require('../../assets/social-icons-svg/facebook.png'),  resizeMode: 'cover' },
  linkedin:  { source: require('../../assets/social-icons-svg/linkedin.png'),  resizeMode: 'cover' },
  pinterest: { source: require('../../assets/social-icons-svg/pinterest.png'), resizeMode: 'cover' },
  rednote:   { source: require('../../assets/social-icons-svg/rednote.png'),   resizeMode: 'cover' },
  snapchat:  { source: require('../../assets/social-icons-svg/snapchat.jpg'),  resizeMode: 'cover' },
  twitch:    { source: require('../../assets/social-icons-svg/twitch.png'),   resizeMode: 'cover' },
  spotify:   { source: require('../../assets/social-icons-svg/spotify.png'),   resizeMode: 'cover' },
  substack:  { source: require('../../assets/social-icons-svg/substack.png'),  resizeMode: 'cover' },
  threads:   { source: require('../../assets/social-icons-svg/threads.png'),   resizeMode: 'cover' },
};

function PlatformIcon({ id, size = 38 }) {
  const override = PLATFORM_IMAGE_OVERRIDES[id];
  if (override) {
    return <Image source={override.source} style={{ width: size, height: size }} resizeMode={override.resizeMode} />;
  }
  const entry = SOCIAL_ICONS[id];
  if (!entry) return <Ionicons name="globe-outline" size={size} color="#fff" />;
  return <SvgXml xml={entry.svg} width={size} height={size} />;
}

// Questions 0–5 (stage → region) carry all matching signal.
// Questions 6–7 (platforms, handles) are operational and only shown
// during initial onboarding — not re-asked in the "more questions" flow.
const MATCHING_QUESTION_COUNT = 6;

export function QuizScreen({ navigation, route }) {
  const {
    questionIndex = 0,
    isMoreQuestions = false,
    answers = {},
  } = route.params || {};

  const questions = isMoreQuestions
    ? quizQuestions.slice(0, MATCHING_QUESTION_COUNT)
    : quizQuestions;

  const question = questions[questionIndex];
  const total = questions.length;

  const isSocialHandles = question.type === 'social_handles';
  const isVerifyPlatforms = question.type === 'verify_platforms';
  const isTimezone = question.type === 'timezone';
  const activePlatforms = (isSocialHandles || isVerifyPlatforms)
    ? (answers.platforms || []).map((id) => ({
        id,
        ...(PLATFORM_META[id] ?? { label: id, icon: '·', placeholder: 'username' }),
      }))
    : [];
  const isMultiSelect = question.multiSelect === true;
  const hasOtherOption = question.options?.some((o) => o.allowCustom);
  const otherOption = question.options?.find((o) => o.allowCustom);
  const otherPlaceholder = otherOption?.customPlaceholder ?? 'Tell us in your own words...';

  const [selected, setSelected] = useState([]);
  const [handles, setHandles] = useState({});
  const [verified, setVerified] = useState(answers.handles ?? {});
  const [otherText, setOtherText] = useState('');
  const [tzModalOpen, setTzModalOpen] = useState(false);
  const otherSelected = selected.includes('other');

  const otherOnly = otherSelected && selected.filter((x) => x !== 'other').length === 0;
  const canAdvance = isVerifyPlatforms
    ? Object.values(verified).some((v) => typeof v === 'string' && v.length > 0)
    : isSocialHandles
    ? Object.values(handles).some((v) => v.trim().length > 0)
    : otherOnly
    ? otherText.trim().length > 0
    : selected.length > 0;

  const handleSelect = (id) => {
    if (isMultiSelect) {
      setSelected((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      );
    } else {
      setSelected((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  const advance = (updatedAnswers) => {
    const nextIndex = questionIndex + 1;
    if (nextIndex < total) {
      navigation.push('Quiz', {
        questionIndex: nextIndex,
        isMoreQuestions,
        answers: updatedAnswers,
      });
    } else if (isMoreQuestions) {
      navigation.navigate('Home');
    } else {
      navigation.replace('Name', { answers: updatedAnswers });
    }
  };

  const handleNext = () => {
    let value;
    if (isVerifyPlatforms) {
      value = Object.entries(verified)
        .filter(([, v]) => typeof v === 'string' && v.length > 0)
        .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
    } else if (isSocialHandles) {
      value = { ...handles };
    } else if (isTimezone) {
      value = selected[0];
    } else if (isMultiSelect) {
      const choices = selected.filter((x) => x !== 'other');
      if (otherSelected && otherText.trim()) choices.push(otherText.trim());
      else if (otherSelected) choices.push('other');
      value = choices;
    } else {
      value = selected[0];
    }
    advance({ ...answers, [question.id]: value });
  };

  const handleSkip = () => {
    advance({ ...answers });
  };

  const progress = (questionIndex + 1) / total;

  // Group timezone options for section display
  const tzGroups = isTimezone
    ? question.options.reduce((acc, opt) => {
        if (!acc[opt.group]) acc[opt.group] = [];
        acc[opt.group].push(opt);
        return acc;
      }, {})
    : null;

  const tzFlatList = isTimezone
    ? Object.entries(tzGroups).flatMap(([group, items]) => [
        { type: 'header', group },
        ...items.map((item) => ({ type: 'item', ...item })),
      ])
    : [];

  const selectedTzLabel = isTimezone && selected.length > 0
    ? question.options.find((o) => o.id === selected[0])?.label
    : null;

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
        {/* Question — fixed, never scrolls */}
        <View style={styles.questionFixed}>
          {isMoreQuestions && questionIndex === 0 && (
            <Text style={styles.questionContext}>Helping us find a better match</Text>
          )}
          <Text style={styles.question}>{question.question}</Text>
          {question.subtitle && (
            <Text style={styles.questionSub}>{question.subtitle}</Text>
          )}
        </View>

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Options only */}
          <View style={styles.options}>
            {isVerifyPlatforms ? (
              activePlatforms.map((platform) => {
                const isConnected = typeof verified[platform.id] === 'string' && verified[platform.id].length > 0;
                return (
                  <View
                    key={platform.id}
                    style={[styles.connectRow, isConnected && styles.connectRowActive]}
                  >
                    <View style={styles.connectIconWrap}>
                      <PlatformIcon id={platform.id} size={28} />
                    </View>
                    <Text style={[styles.connectLabel, isConnected && styles.connectLabelActive]}>
                      {platform.label}
                    </Text>
                    <Text style={styles.connectAt}>@</Text>
                    <TextInput
                      style={[styles.connectInput, isConnected && styles.connectInputActive, styles.connectInputWeb]}
                      placeholder="username"
                      placeholderTextColor="rgba(255,255,255,0.35)"
                      value={verified[platform.id] || ''}
                      onChangeText={(v) =>
                        setVerified((prev) => ({ ...prev, [platform.id]: v }))
                      }
                      autoCapitalize="none"
                      autoCorrect={false}
                      selectionColor="#ffffff"
                      cursorColor="#ffffff"
                      underlineColorAndroid="transparent"
                      accessibilityLabel={`${platform.label} handle`}
                    />
                    <View style={[styles.connectIndicator, isConnected && styles.connectIndicatorActive]}>
                      {isConnected && <Ionicons name="checkmark" size={12} color="#fff" />}
                    </View>
                  </View>
                );
              })
            ) : isSocialHandles ? (
              <View style={styles.notebookPaper}>
                <View style={styles.notebookMargin} pointerEvents="none" />
                {activePlatforms.map((platform, i) => (
                  <View
                    key={platform.id}
                    style={[
                      styles.notebookRow,
                      i < activePlatforms.length - 1 && styles.notebookRowBorder,
                    ]}
                  >
                    <Text style={styles.notebookIcon}>{platform.icon}</Text>
                    <TextInput
                      style={[styles.notebookInput, styles.connectInputWeb]}
                      placeholder={`${platform.label} — ${platform.placeholder}`}
                      placeholderTextColor={colors.textMuted}
                      value={handles[platform.id] || ''}
                      onChangeText={(v) =>
                        setHandles((prev) => ({ ...prev, [platform.id]: v }))
                      }
                      autoCapitalize="none"
                      autoCorrect={false}
                      selectionColor="#ffffff"
                      cursorColor="#ffffff"
                      underlineColorAndroid="transparent"
                      accessibilityLabel={`${platform.label} handle`}
                    />
                  </View>
                ))}
              </View>
            ) : isTimezone ? (
              <TouchableOpacity
                style={styles.tzSelector}
                onPress={() => setTzModalOpen(true)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Select timezone"
              >
                <Text style={[styles.tzSelectorText, !selectedTzLabel && styles.tzPlaceholder]}>
                  {selectedTzLabel || 'Select your timezone'}
                </Text>
                <Ionicons name="chevron-down" size={18} color="rgba(255,255,255,0.6)" />
              </TouchableOpacity>
            ) : (
              question.options.map((opt) => (
                <RadioOption
                  key={opt.id}
                  label={opt.label}
                  selected={selected.includes(opt.id)}
                  onPress={() => handleSelect(opt.id)}
                  multiSelect={isMultiSelect}
                />
              ))
            )}

            {/* Other text input */}
            {hasOtherOption && otherSelected && (
              <View style={styles.otherInputWrapper}>
                <TextInput
                  style={[styles.otherInput, styles.connectInputWeb]}
                  placeholder={otherPlaceholder}
                  placeholderTextColor="rgba(255,255,255,0.35)"
                  value={otherText}
                  onChangeText={setOtherText}
                  autoCapitalize="sentences"
                  autoCorrect
                  multiline
                  selectionColor="#ffffff"
                  cursorColor="#ffffff"
                  underlineColorAndroid="transparent"
                  accessibilityLabel="Other description"
                />
              </View>
            )}
          </View>
        </ScrollView>


        {/* Header — always visible on top */}
        <View style={styles.headerBar} pointerEvents="box-none">
          <View style={styles.progressRow}>
            <TouchableOpacity
              onPress={questionIndex === 0
                ? () => navigation.navigate('Onboarding')
                : () => navigation.goBack()}
              style={styles.backBtn}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="chevron-back" size={22} color="#fff" />
            </TouchableOpacity>
            <View style={styles.progressTrack}>
              <LinearGradient
                colors={['#fff', '#fff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressFill, { width: `${progress * 100}%` }]}
              />
            </View>
            <View style={styles.stepPill}>
              <Text style={styles.stepLabel}>{questionIndex + 1}/{total}</Text>
            </View>
          </View>
        </View>

        <View style={styles.footerBar}>
          <Button
            label={
              questionIndex === total - 1
                ? isMoreQuestions ? 'Save & next' : 'Next'
                : 'Next'
            }
            onPress={handleNext}
            disabled={!canAdvance}
            variant="solid"
            color="#000000"
            textColor="#FFFFFF"
          />
        </View>
      </KeyboardAvoidingView>

      {/* Timezone picker modal */}
      <Modal
        visible={tzModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setTzModalOpen(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setTzModalOpen(false)}
          />
          <View style={styles.modalSheet}>
            <BlurView intensity={80} tint="dark" style={[StyleSheet.absoluteFill, styles.modalBlur]} />
            <View style={styles.modalSheetOverlay} />

          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>Select your timezone</Text>

          <FlatList
            data={tzFlatList}
            keyExtractor={(item, i) => item.type === 'header' ? `h-${item.group}` : item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.tzList}
            renderItem={({ item }) => {
              if (item.type === 'header') {
                return <Text style={styles.tzGroupHeader}>{item.group}</Text>;
              }
              const isChosen = selected.includes(item.id);
              return (
                <TouchableOpacity
                  style={[styles.tzRow, isChosen && styles.tzRowSelected]}
                  onPress={() => {
                    handleSelect(item.id);
                    setTzModalOpen(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.tzRowLabel, isChosen && styles.tzRowLabelSelected]}>
                    {item.label}
                  </Text>
                  {isChosen && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </TouchableOpacity>
              );
            }}
          />
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  bgImage: {
    width: '100%',
    height: '100%',
  },
  bgOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  flex: {
    flex: 1,
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
  footerBar: {
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: contentPadding,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  progressTrack: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(28, 26, 46, 0.10)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  stepPill: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  stepLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#fff',
    letterSpacing: 0.3,
  },
  scrollArea: {
    flex: 1,
  },
  questionFixed: {
    paddingTop: 124,
    paddingBottom: 20,
    paddingHorizontal: contentPadding,
    paddingLeft: contentPadding + 8,
  },
  scrollContent: {
    paddingTop: 4,
    paddingBottom: 16,
    paddingHorizontal: contentPadding,
  },
  questionContext: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.accent,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 14,
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
    color: 'rgba(255, 255, 255, 0.75)',
    lineHeight: 21,
    marginTop: 10,
  },
  options: {
    gap: 12,
  },
  notebookPaper: {
    backgroundColor: 'rgba(240, 234, 220, 0.07)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(240, 234, 220, 0.15)',
    paddingLeft: 52,
    overflow: 'hidden',
    position: 'relative',
  },
  notebookMargin: {
    position: 'absolute',
    left: 44,
    top: 0,
    bottom: 0,
    width: 1.5,
    backgroundColor: 'rgba(210, 70, 70, 0.30)',
  },
  notebookRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 62,
    paddingRight: 20,
    gap: 14,
  },
  notebookRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  notebookIcon: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textMuted,
    width: 20,
    textAlign: 'center',
  },
  notebookInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.textPrimary,
  },
  // Timezone selector
  tzSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    height: 64,
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  tzSelectorText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#fff',
  },
  tzPlaceholder: {
    color: 'rgba(255,255,255,0.6)',
  },
  // Other text input
  otherInputWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 20,
    paddingVertical: 14,
    minHeight: 72,
  },
  otherInput: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#fff',
    lineHeight: 22,
  },
  // Timezone modal
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalSheet: {
    height: '70%',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  modalBlur: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  modalSheetOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,8,20,0.55)',
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#fff',
    textAlign: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  tzList: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  tzGroupHeader: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 24,
    marginBottom: 8,
    paddingLeft: 4,
  },
  tzRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 4,
  },
  tzRowSelected: {
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  tzRowLabel: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.8)',
  },
  tzRowLabelSelected: {
    color: '#fff',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  // Verify & connect — matches RadioOption style
  connectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    height: 64,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(255,255,255,0.08)',
    gap: 10,
  },
  connectRowActive: {
    borderColor: '#777',
    backgroundColor: 'rgba(0,0,0,0.30)',
  },
  connectIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  connectLabel: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: 'rgba(255,255,255,0.8)',
    width: 90,
  },
  connectAt: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: 'rgba(255,255,255,0.4)',
  },
  connectInputWeb: Platform.select({
    web: {
      outlineStyle: 'none',
      caretColor: '#ffffff',
      accentColor: '#ffffff',
    },
  }),
  connectLabelActive: {
    color: '#fff',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  connectInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: 'rgba(255,255,255,0.8)',
    paddingRight: 12,
  },
  connectInputActive: {
    color: '#fff',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  connectIndicator: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(28,26,46,0.06)',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectIndicatorActive: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderColor: 'rgba(255,255,255,0.4)',
  },
});
