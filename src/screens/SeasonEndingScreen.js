import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from '../components/Gradient';
import { colors } from '../theme/colors';
import { contentPadding } from '../theme/layout';

const CARD_GAP = 10;
const CARD_WIDTH = (Dimensions.get('window').width - contentPadding * 2 - CARD_GAP) / 2;
import { CURRENT_DAY, TOTAL_DAYS } from '../config/season';
import { GROUP_MEMBERS } from '../config/members';
import { Embers } from '../components/Embers';

const MEMBERS = GROUP_MEMBERS;
const POLAROID_ROTATIONS = ['-2.5deg', '1.8deg', '-1.2deg', '2.2deg', '-2deg', '1.5deg', '-1.8deg'];

const SEASON_STATS = {
  madeCount: 22,
  daysShowed: 28,
  startDate: 'Apr 1',
  endDate: 'Apr 30',
  name: 'the hideout',
};

const PREV_QUESTIONNAIRE = [
  { id: 'q1', question: 'What kind of creative work do you focus on?', answer: 'Writing — mostly essays and short fiction' },
  { id: 'q2', question: 'How often do you want to share your work with the group?', answer: 'A few times a week' },
  { id: 'q3', question: 'What do you value most in a group?', answer: 'Honest, direct feedback' },
  { id: 'q4', question: 'What\'s your timezone?', answer: 'EST (UTC−5)' },
];

const MORE_QUESTIONS = [
  { id: 'mq1', question: 'What time of day do you usually create?' },
  { id: 'mq2', question: 'Do you prefer async feedback or live sessions?' },
  { id: 'mq3', question: 'What\'s one thing you struggled with this season?' },
  { id: 'mq4', question: 'Is there a skill or discipline you\'d like to learn from others?' },
];

// view states: 'main' | 'confirmed' | 'optout-reason' | 'optout-confirm' | 'optout-done'
//              | 'review-prefs' | 'edit-prefs' | 'more-questions'

function Avatar({ member, size = 48, selected }) {
  return (
    <View style={styles.memberAvatarWrap}>
      <View
        style={[
          styles.avatar,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: member.color + (selected ? '55' : '22'),
            borderWidth: selected ? 2 : 1,
            borderColor: selected ? member.color : 'rgba(255,255,255,0.18)',
          },
        ]}
      >
        <Text style={[styles.avatarText, { fontSize: size * 0.28 }]}>
          {member.initials}
        </Text>
      </View>
      {selected && (
        <View style={[styles.checkBadge, { backgroundColor: member.color }]}>
          <Ionicons name="checkmark" size={10} color="#fff" />
        </View>
      )}
    </View>
  );
}

function Hero({ isEnded, daysLeft, day }) {
  const daysLeftLabel = daysLeft === 1 ? '1 day left' : `${daysLeft} days left`;
  return (
    <View style={styles.hero}>
      {isEnded ? (
        <>
          <Text style={styles.eyebrow}>Season Complete</Text>
          <Text style={styles.heroTitle}>{SEASON_STATS.name}</Text>
          <Text style={styles.heroDates}>
            {SEASON_STATS.startDate} — {SEASON_STATS.endDate}
          </Text>
        </>
      ) : (
        <>
          <Text style={styles.eyebrow}>Season Ending Soon</Text>
          <Text style={styles.heroCountdown}>{daysLeftLabel}</Text>
          <Text style={styles.heroTitle}>{SEASON_STATS.name}</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${(day / TOTAL_DAYS) * 100}%` }]} />
          </View>
          <Text style={styles.progressCaption}>Day {day} of {TOTAL_DAYS}</Text>
        </>
      )}
    </View>
  );
}

function StatsRow() {
  return (
    <View style={styles.statsRow}>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{SEASON_STATS.madeCount}</Text>
        <Text style={styles.statLabel}>things made</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{SEASON_STATS.daysShowed}</Text>
        <Text style={styles.statLabel}>days you showed up</Text>
      </View>
    </View>
  );
}

export function SeasonEndingScreen({ navigation, route }) {
  const day = route?.params?.day ?? CURRENT_DAY;
  const daysLeft = TOTAL_DAYS - day;
  const isEnded = daysLeft <= 0;

  const [view, setView] = useState(() => {
    if (Platform.OS !== 'web') return 'main';
    const v = new URLSearchParams(window.location.search).get('view');
    const valid = ['main','confirmed','optout-reason','optout-confirm','optout-done','review-prefs','edit-prefs','more-questions'];
    return valid.includes(v) ? v : 'main';
  });
  const [selected, setSelected] = useState(new Set());
  const [freshStart, setFreshStart] = useState(false);
  const [optoutReason, setOptoutReason] = useState('');
  const [editedAnswers, setEditedAnswers] = useState(
    Object.fromEntries(PREV_QUESTIONNAIRE.map((q) => [q.id, q.answer]))
  );
  const [moreAnswers, setMoreAnswers] = useState(
    Object.fromEntries(MORE_QUESTIONS.map((q) => [q.id, '']))
  );

  const toggleMember = (id) => {
    setFreshStart(false);
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleFreshStart = () => {
    const next = !freshStart;
    setFreshStart(next);
    if (next) setSelected(new Set());
  };

  const selectedMembers = MEMBERS.filter((m) => selected.has(m.id));

  const handleBack = () => {
    if (view === 'optout-reason') return setView('main');
    if (view === 'optout-confirm') return setView('optout-reason');
    if (view === 'review-prefs') return setView('main');
    if (view === 'edit-prefs') return setView('review-prefs');
    if (view === 'more-questions') return setView('main');
    navigation.goBack();
  };

  const showBack = view !== 'confirmed' && view !== 'optout-done';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Image
        source={require('../../assets/splash background.png')}
        style={[StyleSheet.absoluteFill, styles.bgImage]}
        resizeMode="cover"
      />
      <View style={[StyleSheet.absoluteFill, styles.bgOverlay]} />
      <Embers />

      <View style={styles.header}>
        <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.20)' }]} />
        {showBack ? (
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backBtn}
            accessibilityLabel="Back"
            accessibilityRole="button"
          >
            <Ionicons name="chevron-back" size={22} color="rgba(255,255,255,0.70)" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 38 }} />
        )}
        <View style={{ width: 38 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >

          {/* ════════════════════════════════════
              VIEW: main — member selection
          ════════════════════════════════════ */}
          {view === 'main' && (
            <>
              <Hero isEnded={isEnded} daysLeft={daysLeft} day={day} />
              <StatsRow />

              <View style={styles.section}>
                <View style={styles.contextCard}>
                  <Ionicons
                    name={isEnded ? 'ribbon-outline' : 'time-outline'}
                    size={20}
                    color={colors.accent}
                    style={{ marginBottom: 10 }}
                  />
                  <Text style={styles.contextTitle}>
                    {isEnded
                      ? 'You made it through.'
                      : daysLeft === 1 ? 'One more day. Make it count.' : `${daysLeft} more days. Make them count.`}
                  </Text>
                  <Text style={styles.contextBody}>
                    {isEnded
                      ? "This season is done. Before we match you with a new group, you can tell us who you'd like to keep going with — or just let us find you a fresh batch."
                      : "Before this season closes, you can tell us who you'd like in your next group. We'll do our best — it's not guaranteed, but it matters."}
                  </Text>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Who would you like to continue with?</Text>
                <Text style={styles.sectionSubtitle}>
                  Select anyone you'd like to see in your next season, or choose a fresh start below.
                </Text>

                {/* Fresh start option */}
                <TouchableOpacity
                  style={[styles.freshStartCard, freshStart && styles.freshStartCardActive]}
                  activeOpacity={0.75}
                  onPress={toggleFreshStart}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: freshStart }}
                  accessibilityLabel="Continue with a fresh batch — match me with a new group"
                >
                  <View style={[styles.freshStartIcon, freshStart && styles.freshStartIconActive]}>
                    <Ionicons
                      name="shuffle-outline"
                      size={18}
                      color={freshStart ? '#fff' : 'rgba(255,255,255,0.55)'}
                    />
                  </View>
                  <View style={styles.freshStartTextWrap}>
                    <Text style={[styles.freshStartTitle, freshStart && styles.freshStartTitleActive]}>
                      Continue with a fresh batch
                    </Text>
                    <Text style={styles.freshStartSub}>
                      Don't carry anyone over — match me with a new group
                    </Text>
                  </View>
                  {freshStart && (
                    <Ionicons name="checkmark-circle" size={20} color={colors.accent} />
                  )}
                </TouchableOpacity>

                <Text style={styles.orDivider}>or pick specific people</Text>

                <View style={[styles.membersGrid, freshStart && styles.membersGridDimmed]}>
                  {MEMBERS.map((member, i) => {
                    const isSelected = selected.has(member.id);
                    return (
                      <TouchableOpacity
                        key={member.id}
                        style={[
                          styles.memberCard,
                          { transform: [{ rotate: POLAROID_ROTATIONS[i % POLAROID_ROTATIONS.length] }] },
                          isSelected && styles.memberCardSelected,
                        ]}
                        activeOpacity={0.85}
                        onPress={() => toggleMember(member.id)}
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: isSelected }}
                        accessibilityLabel={`Continue with ${member.name}`}
                      >
                        {/* Photo area */}
                        <View style={[styles.polaroidPhoto, { backgroundColor: member.color + '28' }]}>
                          <View style={[styles.polaroidAvatarRing, { borderColor: member.color + '70' }]}>
                            <View style={[styles.polaroidAvatarInner, { backgroundColor: member.color + '40' }]}>
                              <Text style={styles.polaroidInitials}>{member.initials}</Text>
                            </View>
                          </View>
                          {isSelected && (
                            <View style={[styles.polaroidCheckmark, { backgroundColor: member.color }]}>
                              <Ionicons name="checkmark" size={11} color="#fff" />
                            </View>
                          )}
                        </View>
                        {/* Caption strip */}
                        <Text style={styles.polaroidName}>{member.name.split(' ')[0]}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={styles.disclaimerWrap}>
                <Ionicons name="information-circle-outline" size={15} color="rgba(255,255,255,0.40)" style={{ marginTop: 1 }} />
                <Text style={styles.disclaimerText}>
                  Your preferences help us, but we can't guarantee your next group will include these people. We'll do our best.
                </Text>
              </View>

              {/* Matching preferences section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Improve your matching</Text>
                <Text style={styles.sectionSubtitle}>
                  Optional — the more we know, the better the fit.
                </Text>
                <View style={styles.prefsCard}>
                  <TouchableOpacity
                    style={styles.prefsRow}
                    activeOpacity={0.7}
                    onPress={() => setView('review-prefs')}
                  >
                    <View style={styles.prefsRowIcon}>
                      <Ionicons name="document-text-outline" size={16} color="rgba(255,255,255,0.65)" />
                    </View>
                    <View style={styles.prefsRowText}>
                      <Text style={styles.prefsRowTitle}>Review your preferences</Text>
                      <Text style={styles.prefsRowSub}>See what you told us last time, and edit if anything's changed</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.40)" />
                  </TouchableOpacity>

                  <View style={styles.prefsDivider} />

                  <TouchableOpacity
                    style={styles.prefsRow}
                    activeOpacity={0.7}
                    onPress={() => setView('more-questions')}
                  >
                    <View style={styles.prefsRowIcon}>
                      <Ionicons name="add-circle-outline" size={16} color="rgba(255,255,255,0.65)" />
                    </View>
                    <View style={styles.prefsRowText}>
                      <Text style={styles.prefsRowTitle}>Answer more questions</Text>
                      <Text style={styles.prefsRowSub}>Help us find people who are a better fit for how you work</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.40)" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.ctaWrap}>
                <TouchableOpacity
                  style={[styles.ctaBtn, (selected.size === 0 && !freshStart) && styles.ctaBtnNeutral]}
                  onPress={() => setView('confirmed')}
                >
                  <Text style={styles.ctaBtnText}>
                    {isEnded ? "I'm in for another season" : 'Save my preferences'}
                  </Text>
                  <Ionicons name="arrow-forward" size={16} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.skipBtn} onPress={() => navigation.navigate('Home')}>
                  <Text style={styles.skipText}>
                    {isEnded ? "I'll sit this one out for now" : 'Remind me later'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.leaveBtn}
                  onPress={() => setView('optout-reason')}
                >
                  <Text style={styles.leaveText}>Leave Season</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* ════════════════════════════════════
              VIEW: review-prefs — questionnaire
          ════════════════════════════════════ */}
          {view === 'review-prefs' && (
            <>
              <View style={styles.hero}>
                <Text style={styles.eyebrow}>Your Preferences</Text>
                <Text style={styles.heroTitle}>From your last questionnaire</Text>
              </View>

              <View style={styles.section}>
                <View style={styles.contextCard}>
                  <Ionicons name="document-text-outline" size={20} color="rgba(255,255,255,0.50)" style={{ marginBottom: 10 }} />
                  <Text style={styles.contextBody}>
                    These are the answers you submitted when you joined. They help us find the right group for you. Nothing here is mandatory to change — only update what no longer feels true.
                  </Text>
                </View>
              </View>

              <View style={styles.section}>
                {PREV_QUESTIONNAIRE.map((q, i) => (
                  <View key={q.id} style={[styles.qnaItem, i < PREV_QUESTIONNAIRE.length - 1 && styles.qnaItemBorder]}>
                    <Text style={styles.qnaQuestion}>{q.question}</Text>
                    <Text style={styles.qnaAnswer}>{q.answer}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.ctaWrap}>
                <TouchableOpacity
                  style={styles.ctaBtn}
                  onPress={() => setView('edit-prefs')}
                >
                  <Ionicons name="pencil-outline" size={16} color="#fff" />
                  <Text style={styles.ctaBtnText}>Edit my preferences</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.skipBtn} onPress={() => setView('main')}>
                  <Text style={styles.skipText}>Looks good — go back</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* ════════════════════════════════════
              VIEW: edit-prefs — editable form
          ════════════════════════════════════ */}
          {view === 'edit-prefs' && (
            <>
              <View style={styles.hero}>
                <Text style={styles.eyebrow}>Edit Preferences</Text>
                <Text style={styles.heroTitle}>Update what's changed</Text>
              </View>

              <View style={styles.section}>
                <View style={styles.contextCard}>
                  <Text style={styles.contextBody}>
                    Only change what no longer applies. These answers help us find the right group for you next season.
                  </Text>
                </View>
              </View>

              {PREV_QUESTIONNAIRE.map((q) => (
                <View key={q.id} style={styles.section}>
                  <Text style={styles.editQuestionLabel}>{q.question}</Text>
                  <TextInput
                    style={styles.editInput}
                    value={editedAnswers[q.id]}
                    onChangeText={(text) =>
                      setEditedAnswers((prev) => ({ ...prev, [q.id]: text }))
                    }
                    placeholder="Your answer…"
                    placeholderTextColor="rgba(255,255,255,0.30)"
                    multiline
                    textAlignVertical="top"
                  />
                </View>
              ))}

              <View style={styles.ctaWrap}>
                <TouchableOpacity
                  style={styles.ctaBtn}
                  onPress={() => setView('review-prefs')}
                >
                  <Ionicons name="checkmark" size={16} color="#fff" />
                  <Text style={styles.ctaBtnText}>Save changes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.skipBtn} onPress={() => setView('review-prefs')}>
                  <Text style={styles.skipText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* ════════════════════════════════════
              VIEW: more-questions — extra matching
          ════════════════════════════════════ */}
          {view === 'more-questions' && (
            <>
              <View style={styles.hero}>
                <Text style={styles.eyebrow}>More About You</Text>
                <Text style={styles.heroTitle}>Help us find your people</Text>
              </View>

              <View style={styles.section}>
                <View style={styles.contextCard}>
                  <Ionicons name="people-outline" size={20} color={colors.accent} style={{ marginBottom: 10 }} />
                  <Text style={styles.contextBody}>
                    These are optional — answer as many or as few as you'd like. The more context you give us, the better we can match you next season.
                  </Text>
                </View>
              </View>

              {MORE_QUESTIONS.map((q) => (
                <View key={q.id} style={styles.section}>
                  <Text style={styles.editQuestionLabel}>{q.question}</Text>
                  <TextInput
                    style={styles.editInput}
                    value={moreAnswers[q.id]}
                    onChangeText={(text) =>
                      setMoreAnswers((prev) => ({ ...prev, [q.id]: text }))
                    }
                    placeholder="Your answer…"
                    placeholderTextColor="rgba(255,255,255,0.30)"
                    multiline
                    textAlignVertical="top"
                  />
                </View>
              ))}

              <View style={styles.ctaWrap}>
                <TouchableOpacity
                  style={styles.ctaBtn}
                  onPress={() => setView('main')}
                >
                  <Ionicons name="checkmark" size={16} color="#fff" />
                  <Text style={styles.ctaBtnText}>Save and go back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.skipBtn} onPress={() => setView('main')}>
                  <Text style={styles.skipText}>Skip for now</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* ════════════════════════════════════
              VIEW: confirmed — preferences saved
          ════════════════════════════════════ */}
          {view === 'confirmed' && (
            <>
              <Hero isEnded={isEnded} daysLeft={daysLeft} day={day} />
              <StatsRow />
              <View style={styles.section}>
                <View style={styles.confirmCard}>
                  <View style={styles.confirmIconWrap}>
                    <Ionicons name="checkmark-circle" size={40} color={colors.accent} />
                  </View>
                  <Text style={styles.confirmTitle}>You're on the list.</Text>
                  <Text style={styles.confirmBody}>
                    {freshStart
                      ? "We'll find you a great new group next season. Fresh start incoming."
                      : selected.size > 0
                      ? "We noted your preferences. We'll try our best to keep your group feeling right."
                      : "We'll find you a great new group. See you next season."}
                  </Text>
                  {selectedMembers.length > 0 && (
                    <View style={styles.confirmAvatarRow}>
                      {selectedMembers.map((m) => (
                        <View
                          key={m.id}
                          style={[styles.confirmAvatar, { backgroundColor: m.color + '33', borderColor: m.color + '66' }]}
                        >
                          <Text style={styles.confirmAvatarText}>{m.initials}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                  {isEnded && (
                    <TouchableOpacity
                      style={[styles.confirmHomeBtn, styles.confirmWrapBtn]}
                      onPress={() =>
                        navigation.navigate('SeasonWrap', {
                          continued: true,
                          freshStart,
                          keptMemberIds: [...selected],
                        })
                      }
                    >
                      <Text style={[styles.confirmHomeBtnText, { color: colors.accent }]}>
                        See your season wrap
                      </Text>
                      <Ionicons name="arrow-forward" size={14} color={colors.accent} />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.confirmHomeBtn}
                    onPress={() => navigation.navigate('Home')}
                  >
                    <Text style={styles.confirmHomeBtnText}>Back to home</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.changeNudge}>
                <Ionicons name="refresh-outline" size={14} color="rgba(255,255,255,0.40)" />
                <Text style={styles.changeNudgeText}>
                  Changed your mind about who you'd like to continue with?{' '}
                  <Text
                    style={styles.changeNudgeLink}
                    onPress={() => navigation.navigate('Profile')}
                  >
                    Update anytime in Profile → Next Season.
                  </Text>
                </Text>
              </View>
            </>
          )}

          {/* ════════════════════════════════════
              VIEW: optout-reason — why leaving
          ════════════════════════════════════ */}
          {view === 'optout-reason' && (
            <>
              <View style={styles.hero}>
                <Text style={styles.eyebrow}>Leaving Season</Text>
                <Text style={styles.heroTitle}>We're sorry to hear that.</Text>
              </View>

              <View style={styles.section}>
                <View style={styles.contextCard}>
                  <Ionicons name="chatbubble-ellipses-outline" size={20} color="rgba(255,255,255,0.50)" style={{ marginBottom: 10 }} />
                  <Text style={styles.contextTitle}>What's not working for you?</Text>
                  <Text style={styles.contextBody}>
                    You don't have to answer — but if something isn't right, we'd genuinely like to know.
                  </Text>
                </View>
              </View>

              <View style={styles.section}>
                <TextInput
                  style={styles.reasonInput}
                  placeholder="Tell us what's not working…"
                  placeholderTextColor="rgba(255,255,255,0.30)"
                  value={optoutReason}
                  onChangeText={setOptoutReason}
                  multiline
                  maxLength={500}
                  textAlignVertical="top"
                />
                <Text style={styles.charCount}>{optoutReason.length}/500</Text>
              </View>

              <View style={styles.ctaWrap}>
                <TouchableOpacity
                  style={styles.ctaBtn}
                  onPress={() => setView('optout-confirm')}
                >
                  <Text style={styles.ctaBtnText}>Continue</Text>
                  <Ionicons name="arrow-forward" size={16} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.skipBtn} onPress={() => setView('main')}>
                  <Text style={styles.skipText}>Actually, never mind</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* ════════════════════════════════════
              VIEW: optout-confirm — persuade to stay
          ════════════════════════════════════ */}
          {view === 'optout-confirm' && (
            <>
              <View style={styles.hero}>
                <Text style={styles.eyebrow}>Hold on a moment</Text>
                <Text style={styles.heroTitle}>You've shown up {SEASON_STATS.daysShowed} times.</Text>
                <Text style={[styles.heroDates, { textAlign: 'center', marginTop: 0 }]}>
                  That's not nothing.
                </Text>
              </View>

              <StatsRow />

              <View style={styles.section}>
                <View style={styles.contextCard}>
                  <Ionicons name="heart-outline" size={20} color={colors.accent} style={{ marginBottom: 10 }} />
                  <Text style={styles.contextTitle}>
                    We built Season for people exactly like you.
                  </Text>
                  <Text style={styles.contextBody}>
                    Creative blocks, inconsistency, the feeling that it's not worth it — that's what this group is for. You don't have to be "on" right now. You just have to stay in the room.{'\n\n'}
                    A new season is a fresh start. Different energy, same commitment. Give it one more try before you go.
                  </Text>
                </View>
              </View>

              <View style={styles.ctaWrap}>
                <TouchableOpacity
                  style={styles.ctaBtn}
                  onPress={() => setView('main')}
                >
                  <Ionicons name="refresh-outline" size={16} color="#fff" />
                  <Text style={styles.ctaBtnText}>Give it another try</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.skipBtn}
                  onPress={() => setView('optout-done')}
                >
                  <Text style={[styles.skipText, { color: colors.error + 'CC' }]}>
                    No, I've made up my mind
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* ════════════════════════════════════
              VIEW: optout-done — farewell
          ════════════════════════════════════ */}
          {view === 'optout-done' && (
            <>
              <View style={styles.hero}>
                <Text style={styles.eyebrow}>Until next time</Text>
                <Text style={styles.heroTitle}>We hope to see you again.</Text>
              </View>

              <View style={styles.section}>
                <View style={styles.confirmCard}>
                  <View style={styles.confirmIconWrap}>
                    <Ionicons name="moon-outline" size={36} color="rgba(255,255,255,0.50)" />
                  </View>

                  <View style={styles.optoutDetailRow}>
                    <Ionicons name="notifications-off-outline" size={16} color="rgba(255,255,255,0.50)" />
                    <Text style={styles.optoutDetailText}>
                      Notifications have been turned off for your account.
                    </Text>
                  </View>

                  <View style={styles.optoutDetailRow}>
                    <Ionicons name="refresh-circle-outline" size={16} color="rgba(255,255,255,0.50)" />
                    <Text style={styles.optoutDetailText}>
                      Changed your mind? You can always rejoin and re-enable notifications from your Profile.
                    </Text>
                  </View>

                  <View style={styles.optoutBtnGroup}>
                    <TouchableOpacity
                      style={styles.optoutProfileBtn}
                      onPress={() => navigation.navigate('Profile')}
                    >
                      <Text style={styles.optoutProfileBtnText}>Go to Profile</Text>
                      <Ionicons name="person-outline" size={14} color="rgba(255,255,255,0.65)" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.confirmHomeBtn}
                      onPress={() => navigation.navigate('Home')}
                    >
                      <Text style={styles.confirmHomeBtnText}>Back to home</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#000' },
  flex: { flex: 1 },
  bgImage: { width: '100%', height: '100%' },
  bgOverlay: { backgroundColor: 'rgba(0,0,0,0.52)' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: contentPadding,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
  },
  backBtn: { padding: 4, width: 38 },
  scroll: { paddingBottom: 20 },

  hero: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 32,
    paddingHorizontal: contentPadding,
  },
  eyebrow: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  heroCountdown: {
    fontSize: 42,
    fontFamily: 'PlusJakartaSans_300Light',
    color: colors.accent,
    letterSpacing: -1,
    marginBottom: 6,
    textShadowColor: 'rgba(143, 191, 176, 0.45)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 16,
  },
  heroTitle: {
    fontSize: 26,
    fontFamily: 'PlusJakartaSans_300Light',
    color: '#fff',
    marginBottom: 16,
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  heroDates: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.55)',
    marginTop: -8,
  },
  progressTrack: {
    width: '100%',
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 2,
  },
  progressCaption: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.45)',
  },

  statsRow: {
    flexDirection: 'row',
    marginHorizontal: contentPadding,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.30,
    shadowRadius: 18,
    elevation: 8,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statNumber: {
    fontSize: 36,
    fontFamily: 'PlusJakartaSans_300Light',
    color: '#fff',
    letterSpacing: -1,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginHorizontal: 12,
  },

  section: {
    paddingHorizontal: contentPadding,
    marginBottom: 24,
  },
  contextCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 6,
  },
  contextTitle: {
    fontSize: 17,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#fff',
    marginBottom: 8,
    lineHeight: 24,
  },
  contextBody: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 22,
  },

  sectionTitle: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#fff',
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.50)',
    lineHeight: 20,
    marginBottom: 16,
  },

  freshStartCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 4,
  },
  freshStartCardActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accent + '20',
  },
  freshStartIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  freshStartIconActive: {
    backgroundColor: colors.accent,
  },
  freshStartTextWrap: { flex: 1 },
  freshStartTitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#fff',
    marginBottom: 2,
  },
  freshStartTitleActive: {
    color: colors.accent,
  },
  freshStartSub: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.45)',
    lineHeight: 17,
  },

  orDivider: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.40)',
    textAlign: 'center',
    letterSpacing: 0.5,
    marginVertical: 14,
  },

  membersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP + 4,
    paddingVertical: 8,
  },
  membersGridDimmed: {
    opacity: 0.35,
  },
  memberCard: {
    width: CARD_WIDTH,
    backgroundColor: '#EDE8DF',
    borderRadius: 2,
    padding: 7,
    paddingBottom: 26,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 5 },
    shadowOpacity: 0.32,
    shadowRadius: 8,
    elevation: 7,
  },
  memberCardSelected: {
    shadowColor: '#9A80B5',
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 10,
  },
  polaroidPhoto: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  polaroidAvatarRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  polaroidAvatarInner: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  polaroidInitials: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(255,255,255,0.9)',
  },
  polaroidCheckmark: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#EDE8DF',
  },
  polaroidName: {
    position: 'absolute',
    bottom: 7,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#3A3330',
    letterSpacing: 0.2,
  },

  disclaimerWrap: {
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: contentPadding,
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.45)',
    lineHeight: 18,
  },

  prefsCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    overflow: 'hidden',
  },
  prefsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  prefsRowIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  prefsRowText: { flex: 1 },
  prefsRowTitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#fff',
    marginBottom: 2,
  },
  prefsRowSub: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.45)',
    lineHeight: 17,
  },
  prefsDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginHorizontal: 16,
  },

  qnaItem: {
    paddingVertical: 16,
  },
  qnaItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.12)',
  },
  qnaQuestion: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: 'rgba(255,255,255,0.50)',
    marginBottom: 6,
    lineHeight: 18,
  },
  qnaAnswer: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#fff',
    lineHeight: 22,
  },

  editQuestionLabel: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: 'rgba(255,255,255,0.65)',
    marginBottom: 8,
    lineHeight: 20,
  },
  editInput: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#fff',
    minHeight: 80,
    lineHeight: 22,
  },

  ctaWrap: {
    paddingHorizontal: contentPadding,
    gap: 12,
    marginBottom: 8,
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentVibrant,
    borderRadius: 14,
    height: 52,
    gap: 8,
  },
  ctaBtnNeutral: {
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  ctaBtnText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#fff',
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  skipText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.50)',
  },
  leaveBtn: {
    alignItems: 'center',
    paddingVertical: 6,
    marginTop: -4,
  },
  leaveText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.35)',
    textDecorationLine: 'underline',
  },

  confirmCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    padding: 28,
    alignItems: 'center',
  },
  confirmIconWrap: { marginBottom: 16 },
  confirmTitle: {
    fontSize: 22,
    fontFamily: 'PlusJakartaSans_300Light',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  confirmBody: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 20,
  },
  confirmAvatarRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 24,
  },
  confirmAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmAvatarText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#fff',
  },
  confirmHomeBtn: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  confirmWrapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderColor: colors.accent + '55',
    backgroundColor: colors.accent + '18',
    marginBottom: 10,
  },
  confirmHomeBtnText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: 'rgba(255,255,255,0.70)',
  },

  changeNudge: {
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: contentPadding,
    marginTop: -8,
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  changeNudgeText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.45)',
    lineHeight: 18,
  },
  changeNudgeLink: {
    color: colors.accent,
    textDecorationLine: 'underline',
  },

  reasonInput: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#fff',
    minHeight: 120,
  },
  charCount: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.40)',
    textAlign: 'right',
    marginTop: 6,
  },

  optoutDetailRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    marginBottom: 14,
    width: '100%',
  },
  optoutDetailText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 20,
  },
  optoutBtnGroup: {
    width: '100%',
    gap: 10,
    marginTop: 8,
  },
  optoutProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  optoutProfileBtnText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: 'rgba(255,255,255,0.70)',
  },
});
