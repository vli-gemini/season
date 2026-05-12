import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from '../components/Gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { contentPadding } from '../theme/layout';
import { TOTAL_DAYS } from '../config/season';
import { GROUP_MEMBERS } from '../config/members';
import { Embers } from '../components/Embers';

const { width: SW } = Dimensions.get('window');

const MEMBER_MADE_COUNTS = { '1': 26, '2': 24, '3': 19, '4': 14, '5': 21, '6': 17, '7': 23 };

const WRAP_DATA = {
  seasonName: 'the hideout',
  seasonNumber: 1,
  startDate: 'Apr 1',
  endDate: 'Apr 30',
  nextSeasonStart: 'May 15',
  madeCount: 22,
  daysShowed: 28,
  totalDays: 30,
  bestStreak: 12,
  topMoment: 'Day 14 — you posted your most personal video yet.',
  members: GROUP_MEMBERS
    .map((m) => ({ ...m, sharedCount: MEMBER_MADE_COUNTS[m.id] ?? 0 }))
    .sort((a, b) => b.sharedCount - a.sharedCount),
};

const GROUP_TOTAL = Object.values(MEMBER_MADE_COUNTS).reduce((s, n) => s + n, 0) + WRAP_DATA.madeCount;
const ATTENDANCE_PCT = Math.round((WRAP_DATA.daysShowed / WRAP_DATA.totalDays) * 100);
const MY_RANK = WRAP_DATA.members.filter((m) => m.sharedCount > WRAP_DATA.madeCount).length + 1;

// ─────────────────────────────────────────────────────────────────────────────
// Shared primitives
// ─────────────────────────────────────────────────────────────────────────────

function PageDots({ total, current }) {
  return (
    <View
      style={dotStyles.row}
      accessible
      accessibilityLabel={`Page ${current + 1} of ${total}`}
    >
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            dotStyles.dot,
            i === current && dotStyles.dotActive,
            i < current && dotStyles.dotDone,
          ]}
          accessibilityElementsHidden
          importantForAccessibility="no"
        />
      ))}
    </View>
  );
}

const dotStyles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.20)' },
  dotActive: { width: 18, backgroundColor: colors.accent },
  dotDone: { backgroundColor: 'rgba(255,255,255,0.40)' },
});

function MemberRow({ member, rank, highlight }) {
  return (
    <View style={[memberStyles.row, highlight && memberStyles.rowHighlight]}>
      <Text style={memberStyles.rank}>#{rank}</Text>
      <View style={[memberStyles.avatar, { backgroundColor: member.color + '33' }]}>
        <Text style={memberStyles.initials}>{member.initials}</Text>
      </View>
      <View style={memberStyles.info}>
        <Text style={memberStyles.name}>{member.name.split(' ')[0]}</Text>
        <Text style={memberStyles.count}>{member.sharedCount} things made</Text>
      </View>
      <View style={[memberStyles.bar, { width: `${Math.round((member.sharedCount / 30) * 100)}%`, backgroundColor: member.color + '66' }]} />
    </View>
  );
}

const memberStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 11,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    marginBottom: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  rowHighlight: {
    borderColor: colors.accent + '55',
    backgroundColor: colors.accent + '0D',
  },
  bar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 12,
    opacity: 0.25,
  },
  rank: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.45)',
    width: 22,
    textAlign: 'center',
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#fff',
  },
  info: { flex: 1 },
  name: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#fff',
    marginBottom: 1,
  },
  count: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.45)',
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Continued path — 5 pages
// ─────────────────────────────────────────────────────────────────────────────

function PageClose({ onNext }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.pageScroll}>
      <LinearGradient
        colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.5)']}
        style={styles.heroBlock}
      >
        <Text style={styles.eyebrow}>Season Complete</Text>
        <Text style={styles.heroName}>{WRAP_DATA.seasonName}</Text>
        <Text style={styles.heroDates}>{WRAP_DATA.startDate} — {WRAP_DATA.endDate}</Text>
      </LinearGradient>

      <View style={styles.section}>
        <View style={styles.closeCard}>
          <Ionicons name="ribbon-outline" size={28} color={colors.accent} style={{ marginBottom: 16 }} />
          <Text style={styles.closeHeadline}>You made it.</Text>
          <Text style={styles.closeBody}>
            Thirty days. Some of them were hard. Some of them surprised you. But you stayed in the room — and that's the whole point.
          </Text>
          <Text style={styles.closeBody2}>
            Here's what this season looked like.
          </Text>
        </View>
      </View>

      <View style={styles.quickStats}>
        <View style={styles.quickStat}>
          <Text style={styles.quickStatNum}>{WRAP_DATA.madeCount}</Text>
          <Text style={styles.quickStatLabel}>things{'\n'}made</Text>
        </View>
        <View style={styles.quickStatDivider} />
        <View style={styles.quickStat}>
          <Text style={styles.quickStatNum}>{WRAP_DATA.daysShowed}</Text>
          <Text style={styles.quickStatLabel}>days you{'\n'}showed up</Text>
        </View>
        <View style={styles.quickStatDivider} />
        <View style={styles.quickStat}>
          <Text style={styles.quickStatNum}>{WRAP_DATA.bestStreak}</Text>
          <Text style={styles.quickStatLabel}>day best{'\n'}streak</Text>
        </View>
      </View>

      <View style={styles.ctaWrap}>
        <TouchableOpacity style={styles.primaryBtn} onPress={onNext}>
          <Text style={styles.primaryBtnText}>See your wrap</Text>
          <Ionicons name="arrow-forward" size={15} color="#fff" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function PageNumbers({ onNext }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.pageScroll}>
      <View style={styles.pageHero}>
        <Text style={styles.eyebrow}>Your Season</Text>
        <Text style={styles.pageTitle}>By the numbers</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.bigStatCard}>
          <Text style={styles.bigStatNum}>{WRAP_DATA.madeCount}</Text>
          <Text style={styles.bigStatLabel}>things made this season</Text>
          <View style={styles.bigStatBar}>
            <View style={[styles.bigStatFill, { width: `${Math.round((WRAP_DATA.madeCount / 30) * 100)}%` }]} />
          </View>
          <Text style={styles.bigStatSub}>out of 30 days</Text>
        </View>
      </View>

      <View style={[styles.section, { gap: 10 }]}>
        <View style={styles.statRow}>
          <View style={styles.statRowCard}>
            <Text style={styles.statRowNum}>{WRAP_DATA.daysShowed}</Text>
            <Text style={styles.statRowLabel}>days showed up</Text>
          </View>
          <View style={styles.statRowCard}>
            <Text style={styles.statRowNum}>{ATTENDANCE_PCT}%</Text>
            <Text style={styles.statRowLabel}>attendance</Text>
          </View>
        </View>
        <View style={styles.statRow}>
          <View style={styles.statRowCard}>
            <Text style={styles.statRowNum}>{WRAP_DATA.bestStreak}</Text>
            <Text style={styles.statRowLabel}>day best streak</Text>
          </View>
          <View style={[styles.statRowCard, styles.statRowCardAccent]}>
            <Text style={[styles.statRowNum, { color: colors.accent }]}>#{MY_RANK}</Text>
            <Text style={styles.statRowLabel}>in your group</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.insightCard}>
          <Ionicons name="trending-up-outline" size={16} color={colors.accent} />
          <Text style={styles.insightText}>
            You showed up <Text style={styles.insightEm}>{ATTENDANCE_PCT}% of this season</Text> — more than most people ever do.
          </Text>
        </View>
      </View>

      <View style={styles.ctaWrap}>
        <TouchableOpacity style={styles.primaryBtn} onPress={onNext}>
          <Text style={styles.primaryBtnText}>Your people</Text>
          <Ionicons name="arrow-forward" size={15} color="#fff" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function PagePeople({ onNext, keptMemberIds = [] }) {
  const keptSet = new Set(keptMemberIds);
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.pageScroll}>
      <View style={styles.pageHero}>
        <Text style={styles.eyebrow}>The Group</Text>
        <Text style={styles.pageTitle}>Your people</Text>
        <Text style={styles.pageSubtitle}>
          Together, your group made {GROUP_TOTAL} things this season.
        </Text>
      </View>

      <View style={styles.section}>
        {WRAP_DATA.members.map((m, i) => (
          <MemberRow key={m.id} member={m} rank={i + 1} highlight={keptSet.has(m.id)} />
        ))}
      </View>

      {keptMemberIds.length > 0 && (
        <View style={styles.section}>
          <View style={styles.keptCard}>
            <Ionicons name="heart-outline" size={15} color={colors.accent} />
            <Text style={styles.keptText}>
              You asked to continue with{' '}
              <Text style={styles.keptNames}>
                {WRAP_DATA.members
                  .filter((m) => keptSet.has(m.id))
                  .map((m) => m.name.split(' ')[0])
                  .join(', ')}
              </Text>
              . We'll do our best.
            </Text>
          </View>
        </View>
      )}

      <View style={styles.ctaWrap}>
        <TouchableOpacity style={styles.primaryBtn} onPress={onNext}>
          <Text style={styles.primaryBtnText}>Your moment</Text>
          <Ionicons name="arrow-forward" size={15} color="#fff" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function PageMoment({ onNext }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.pageScroll}>
      <View style={styles.pageHero}>
        <Text style={styles.eyebrow}>A Moment</Text>
        <Text style={styles.pageTitle}>Worth keeping</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.momentCard}>
          <Ionicons name="star-outline" size={18} color={colors.accent} style={{ marginBottom: 12 }} />
          <Text style={styles.momentQuote}>"{WRAP_DATA.topMoment}"</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.reflectionCard}>
          <Text style={styles.reflectionTitle}>What changed</Text>
          <Text style={styles.reflectionBody}>
            A season isn't just about output. Something shifted for you in those 30 days — in how you work, what you make, or what you're willing to share.
          </Text>
          <Text style={[styles.reflectionBody, { marginTop: 12 }]}>
            That's worth more than any number.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.achieveRow}>
          <View
            style={[styles.achieveBadge, { transform: [{ rotate: '-4deg' }], borderColor: colors.accent + '70' }]}
            accessible
            accessibilityLabel="Season Complete badge"
          >
            <View style={[styles.achieveBadgeInner, { borderColor: colors.accent + '40' }]}>
              <Ionicons name="trophy-outline" size={22} color={colors.accent} />
              <Text style={[styles.achieveLabel, { color: colors.accent }]}>SEASON{'\n'}COMPLETE</Text>
            </View>
          </View>
          <View
            style={[styles.achieveBadge, { transform: [{ rotate: '3deg' }], borderColor: '#FF8C40' + '70' }]}
            accessible
            accessibilityLabel={`${WRAP_DATA.bestStreak}-Day Streak badge`}
          >
            <View style={[styles.achieveBadgeInner, { borderColor: '#FF8C40' + '40' }]}>
              <Ionicons name="flame-outline" size={22} color="#FF8C40" />
              <Text style={[styles.achieveLabel, { color: '#FF8C40' }]}>{WRAP_DATA.bestStreak}-DAY{'\n'}STREAK</Text>
            </View>
          </View>
          <View
            style={[styles.achieveBadge, { transform: [{ rotate: '-2deg' }], borderColor: colors.accent + '70' }]}
            accessible
            accessibilityLabel="Group Finisher badge"
          >
            <View style={[styles.achieveBadgeInner, { borderColor: colors.accent + '40' }]}>
              <Ionicons name="people-outline" size={22} color={colors.accent} />
              <Text style={[styles.achieveLabel, { color: colors.accent }]}>GROUP{'\n'}FINISHER</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.ctaWrap}>
        <TouchableOpacity style={styles.primaryBtn} onPress={onNext}>
          <Text style={styles.primaryBtnText}>What's next</Text>
          <Ionicons name="arrow-forward" size={15} color="#fff" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function PageNext({ navigation, freshStart, keptMemberIds = [] }) {
  const keptSet = new Set(keptMemberIds);
  const keptMembers = WRAP_DATA.members.filter((m) => keptSet.has(m.id));

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.pageScroll}>
      <View style={styles.pageHero}>
        <Text style={styles.eyebrow}>Season {WRAP_DATA.seasonNumber + 1}</Text>
        <Text style={styles.pageTitle}>A new season{'\n'}is coming.</Text>
        <Text style={styles.nextDate}>{WRAP_DATA.nextSeasonStart}</Text>
      </View>

      <View style={styles.section}>
        {/* Postcard */}
        <View style={styles.postcard}>
          {/* Header: postmark + stamp */}
          <View style={styles.postcardHeader}>
            <View style={styles.postmark}>
              <Text style={styles.postmarkWord}>SEASON</Text>
              <View style={styles.postmarkRule} />
              <Text style={styles.postmarkNum}>{WRAP_DATA.seasonNumber + 1}</Text>
            </View>
            <View style={{ flex: 1 }} />
            <View style={styles.postcardStamp}>
              <Ionicons name="compass-outline" size={15} color={colors.accent} />
              <Text style={styles.postcardStampLabel}>NEXT</Text>
            </View>
          </View>

          <View style={styles.postcardRule} />

          {/* Body: conditional content */}
          <View style={styles.postcardBody}>
            {freshStart ? (
              <>
                <Ionicons name="shuffle-outline" size={20} color="#8B6A3A" style={{ marginBottom: 10 }} />
                <Text style={styles.postcardTitle}>Fresh slate. New faces.</Text>
                <Text style={styles.postcardText}>
                  You asked for a completely new group. We're finding people who match where you are right now — not where you were.
                </Text>
              </>
            ) : keptMembers.length > 0 ? (
              <>
                <View style={[styles.nextAvatarRow, { marginBottom: 14 }]}>
                  {keptMembers.map((m) => (
                    <View key={m.id} style={[styles.nextAvatar, { backgroundColor: m.color + '33', borderColor: m.color + '66' }]}>
                      <Text style={styles.nextAvatarText}>{m.initials}</Text>
                    </View>
                  ))}
                </View>
                <Text style={styles.postcardTitle}>We'll try to keep you together.</Text>
                <Text style={styles.postcardText}>
                  We noted who you want to continue with. No guarantees — but we'll do everything we can to build the right room.
                </Text>
              </>
            ) : (
              <>
                <Ionicons name="compass-outline" size={20} color="#8B6A3A" style={{ marginBottom: 10 }} />
                <Text style={styles.postcardTitle}>A new group is coming.</Text>
                <Text style={styles.postcardText}>
                  We'll find the right people for where you are now. New season, same commitment.
                </Text>
              </>
            )}
          </View>

          <View style={styles.postcardRule} />

          {/* Address strip */}
          <View style={styles.postcardAddress}>
            <Text style={styles.postcardToLabel}>DELIVERED TO</Text>
            <Text style={styles.postcardToName}>{freshStart ? 'Your New Group' : 'Your Next Season'}</Text>
            <Text style={styles.postcardDate}>{WRAP_DATA.nextSeasonStart}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.hopeCard}>
          <Text style={styles.hopeText}>
            "The point was never to be ready. The point was to show up anyway."
          </Text>
          <Text style={styles.hopeSub}>See you in Season {WRAP_DATA.seasonNumber + 1}.</Text>
        </View>
      </View>

      <View style={styles.ctaWrap}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="checkmark" size={15} color="#fff" />
          <Text style={styles.primaryBtnText}>I'm ready</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate('Quiz', { questionIndex: 0, isMoreQuestions: true })}
        >
          <Text style={styles.secondaryBtnText}>Answer more matching questions</Text>
          <Ionicons name="chevron-forward" size={14} color="rgba(255,255,255,0.65)" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.ghostBtn} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.ghostBtnText}>Back to home</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Non-continued path — 2 pages
// ─────────────────────────────────────────────────────────────────────────────

function PageSeason({ onNext }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.pageScroll}>
      <LinearGradient
        colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.5)']}
        style={styles.heroBlock}
      >
        <Text style={styles.eyebrow}>Season Complete</Text>
        <Text style={styles.heroName}>{WRAP_DATA.seasonName}</Text>
        <Text style={styles.heroDates}>{WRAP_DATA.startDate} — {WRAP_DATA.endDate}</Text>
      </LinearGradient>

      <View style={styles.section}>
        <View style={styles.closeCard}>
          <Ionicons name="moon-outline" size={24} color="rgba(255,255,255,0.50)" style={{ marginBottom: 14 }} />
          <Text style={[styles.closeHeadline, { color: 'rgba(255,255,255,0.65)' }]}>This season is over.</Text>
          <Text style={styles.closeBody}>
            You didn't make it to the next round — that's okay. Life moves. Timing is everything. Season {WRAP_DATA.seasonNumber} is done, but here's what happened while it ran.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>The group made</Text>
        <View style={styles.groupStatCard}>
          <Text style={styles.groupStatNum}>{GROUP_TOTAL}</Text>
          <Text style={styles.groupStatLabel}>things together across {WRAP_DATA.totalDays} days</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>The people</Text>
        {WRAP_DATA.members.slice(0, 4).map((m, i) => (
          <MemberRow key={m.id} member={m} rank={i + 1} />
        ))}
        <Text style={styles.moreMembers}>+ {WRAP_DATA.members.length - 4} more</Text>
      </View>

      <View style={styles.ctaWrap}>
        <TouchableOpacity style={styles.primaryBtn} onPress={onNext}>
          <Text style={styles.primaryBtnText}>See what's next</Text>
          <Ionicons name="arrow-forward" size={15} color="#fff" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function PageRejoin({ navigation }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.pageScroll}>
      <View style={styles.pageHero}>
        <Text style={styles.eyebrow}>Season {WRAP_DATA.seasonNumber + 1}</Text>
        <Text style={styles.pageTitle}>The door is open.</Text>
        <Text style={styles.pageSubtitle}>
          Whenever you're ready, there's a group for you.
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.rejoinCard}>
          <LinearGradient
            colors={['rgba(168,155,255,0.10)', 'rgba(168,155,255,0.03)']}
            style={styles.rejoinCardGradient}
          >
            <Text style={styles.rejoinTitle}>Season {WRAP_DATA.seasonNumber + 1} opens {WRAP_DATA.nextSeasonStart}.</Text>
            <Text style={styles.rejoinBody}>
              A new group. A fresh 30 days. The same simple ask — just show up and make something.
            </Text>

            <View style={styles.rejoinFeatureList}>
              {[
                ['people-outline', 'A matched group of 8 creatives'],
                ['calendar-outline', '30 days, one thing at a time'],
                ['chatbubble-ellipses-outline', 'A private group to share work'],
                ['sparkles-outline', 'Better matching based on who you are now'],
              ].map(([icon, label]) => (
                <View key={label} style={styles.rejoinFeatureRow}>
                  <Ionicons name={icon} size={15} color={colors.accent} />
                  <Text style={styles.rejoinFeatureLabel}>{label}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.hopeCard}>
          <Text style={styles.hopeText}>
            "There's no perfect time to start. There's only the next season."
          </Text>
        </View>
      </View>

      <View style={styles.ctaWrap}>
        <TouchableOpacity
          style={[styles.primaryBtn, styles.primaryBtnAccent]}
          onPress={() => navigation.navigate('Quiz', { questionIndex: 0 })}
        >
          <Ionicons name="arrow-forward-circle-outline" size={18} color="#fff" />
          <Text style={styles.primaryBtnText}>Join Season {WRAP_DATA.seasonNumber + 1}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate('Waitlist')}
        >
          <Text style={styles.secondaryBtnText}>Remind me when it opens</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.ghostBtn} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.ghostBtnText}>Not right now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Root screen
// ─────────────────────────────────────────────────────────────────────────────

export function SeasonWrapScreen({ navigation, route }) {
  const continued = route?.params?.continued ?? true;
  const freshStart = route?.params?.freshStart ?? false;
  const keptMemberIds = route?.params?.keptMemberIds ?? [];

  const totalPages = continued ? 5 : 2;
  const [page, setPage] = useState(
    Platform.OS === 'web'
      ? parseInt(new URLSearchParams(window.location.search).get('page') ?? '0', 10)
      : 0
  );
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const changePage = (next) => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 120, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 180, useNativeDriver: true }),
    ]).start();
    setPage(next);
  };

  const goNext = () => changePage(Math.min(page + 1, totalPages - 1));
  const goBack = () => {
    if (page > 0) return changePage(page - 1);
    navigation.goBack();
  };

  const showBack = page > 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Image
        source={require('../../assets/splash background.png')}
        style={[StyleSheet.absoluteFill, styles.bgImage]}
        resizeMode="cover"
      />
      <View style={[StyleSheet.absoluteFill, styles.bgOverlay]} />
      <Embers />

      {/* Header */}
      <View style={styles.header}>
        <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.20)' }]} />
        {showBack ? (
          <TouchableOpacity
            onPress={goBack}
            style={styles.backBtn}
            accessibilityLabel="Back"
            accessibilityRole="button"
          >
            <Ionicons name="chevron-back" size={22} color="rgba(255,255,255,0.70)" />
          </TouchableOpacity>
        ) : (
          <View style={styles.backBtn} />
        )}
        <PageDots total={totalPages} current={page} />
        <View style={styles.backBtn} />
      </View>

      {/* Pages */}
      <Animated.View style={[styles.flex, { opacity: fadeAnim }]}>
        {continued ? (
          <>
            {page === 0 && <PageClose onNext={goNext} />}
            {page === 1 && <PageNumbers onNext={goNext} />}
            {page === 2 && <PagePeople onNext={goNext} keptMemberIds={keptMemberIds} />}
            {page === 3 && <PageMoment onNext={goNext} />}
            {page === 4 && (
              <PageNext
                navigation={navigation}
                freshStart={freshStart}
                keptMemberIds={keptMemberIds}
              />
            )}
          </>
        ) : (
          <>
            {page === 0 && <PageSeason onNext={goNext} />}
            {page === 1 && <PageRejoin navigation={navigation} />}
          </>
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

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
    paddingVertical: 14,
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.12)',
  },
  backBtn: { width: 38, padding: 4 },

  pageScroll: { paddingBottom: 40 },

  // ── Hero variants ──────────────────────────────
  heroBlock: {
    paddingTop: 40,
    paddingBottom: 32,
    paddingHorizontal: contentPadding,
    alignItems: 'center',
    marginBottom: 8,
  },
  eyebrow: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  heroName: {
    fontSize: 38,
    fontFamily: 'PlusJakartaSans_300Light',
    color: '#fff',
    letterSpacing: -0.5,
    marginBottom: 8,
    textShadowColor: 'rgba(176, 140, 220, 0.32)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 16,
  },
  heroDates: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.55)',
  },

  pageHero: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 28,
    paddingHorizontal: contentPadding,
  },
  pageTitle: {
    fontSize: 30,
    fontFamily: 'PlusJakartaSans_300Light',
    color: '#fff',
    letterSpacing: -0.4,
    textAlign: 'center',
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
    lineHeight: 21,
    paddingHorizontal: 8,
  },
  nextDate: {
    marginTop: 6,
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.accent,
    letterSpacing: 0.5,
  },

  // ── Section ──────────────────────────────────
  section: {
    paddingHorizontal: contentPadding,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 10,
  },

  // ── Page 0: Close ────────────────────────────
  closeCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  closeHeadline: {
    fontSize: 22,
    fontFamily: 'PlusJakartaSans_300Light',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  closeBody: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 24,
    textAlign: 'center',
  },
  closeBody2: {
    marginTop: 14,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
  },

  quickStats: {
    flexDirection: 'row',
    marginHorizontal: contentPadding,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    paddingVertical: 20,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 7,
  },
  quickStat: { flex: 1, alignItems: 'center' },
  quickStatNum: {
    fontSize: 34,
    fontFamily: 'PlusJakartaSans_300Light',
    color: '#fff',
    letterSpacing: -1,
    marginBottom: 4,
  },
  quickStatLabel: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
    lineHeight: 16,
  },
  quickStatDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },

  // ── Page 1: Numbers ──────────────────────────
  bigStatCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    padding: 24,
    alignItems: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 8,
  },
  bigStatNum: {
    fontSize: 72,
    fontFamily: 'PlusJakartaSans_300Light',
    color: '#fff',
    letterSpacing: -3,
    lineHeight: 78,
    textShadowColor: 'rgba(176, 140, 220, 0.28)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 18,
  },
  bigStatLabel: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.65)',
    marginBottom: 16,
    marginTop: 4,
  },
  bigStatBar: {
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 2,
    marginBottom: 8,
    overflow: 'hidden',
  },
  bigStatFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 2,
  },
  bigStatSub: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.45)',
  },

  statRow: { flexDirection: 'row', gap: 10 },
  statRowCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    padding: 16,
    alignItems: 'center',
  },
  statRowCardAccent: {
    borderColor: colors.accent + '44',
    backgroundColor: colors.accent + '0A',
  },
  statRowNum: {
    fontSize: 32,
    fontFamily: 'PlusJakartaSans_300Light',
    color: '#fff',
    letterSpacing: -1,
    marginBottom: 4,
  },
  statRowLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
  },

  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: colors.accent + '12',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.accent + '33',
    padding: 14,
  },
  insightText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 20,
  },
  insightEm: {
    color: colors.accent,
    fontFamily: 'PlusJakartaSans_500Medium',
  },

  // ── Page 2: People ───────────────────────────
  keptCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: colors.accent + '10',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.accent + '30',
    padding: 14,
    marginTop: -8,
  },
  keptText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 20,
  },
  keptNames: {
    color: colors.accent,
    fontFamily: 'PlusJakartaSans_500Medium',
  },

  // ── Page 3: Moment ───────────────────────────
  momentCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    padding: 24,
    alignItems: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 8,
  },
  momentQuote: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_300Light',
    color: '#fff',
    lineHeight: 26,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  reflectionCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    padding: 20,
  },
  reflectionTitle: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: 'rgba(255,255,255,0.65)',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  reflectionBody: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 22,
  },
  achieveRow: {
    flexDirection: 'row',
    gap: 14,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  achieveBadge: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: 'rgba(20,14,38,0.92)',
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  achieveBadgeInner: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  achieveLabel: {
    fontSize: 9,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(255,255,255,0.60)',
    textAlign: 'center',
    lineHeight: 13,
    letterSpacing: 0.8,
  },

  // ── Page 4: Next — postcard ───────────────────
  postcard: {
    backgroundColor: '#F0EBE1',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#DDD5C8',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 8,
  },
  postcardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
  },
  postmark: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 2,
    borderColor: 'rgba(120, 40, 40, 0.50)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  postmarkWord: {
    fontSize: 7,
    letterSpacing: 1.8,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(120, 40, 40, 0.70)',
  },
  postmarkRule: {
    width: 38,
    height: 1,
    backgroundColor: 'rgba(120, 40, 40, 0.50)',
    marginVertical: 3,
  },
  postmarkNum: {
    fontSize: 17,
    fontFamily: 'PlusJakartaSans_300Light',
    color: 'rgba(120, 40, 40, 0.70)',
    letterSpacing: -0.5,
  },
  postcardStamp: {
    width: 48,
    height: 60,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#C0B4A6',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#E6DDD0',
  },
  postcardStampLabel: {
    fontSize: 7,
    letterSpacing: 1.5,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#8B7A6A',
  },
  postcardRule: {
    height: 1,
    backgroundColor: '#DDD5C8',
    marginHorizontal: 14,
  },
  postcardBody: {
    padding: 18,
    alignItems: 'center',
  },
  postcardTitle: {
    fontSize: 17,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#2A231E',
    marginBottom: 8,
    textAlign: 'center',
    lineHeight: 24,
  },
  postcardText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6B5E55',
    lineHeight: 21,
    textAlign: 'center',
  },
  postcardAddress: {
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  postcardToLabel: {
    fontSize: 8,
    letterSpacing: 1.8,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#9B8E83',
    marginBottom: 3,
  },
  postcardToName: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#2A231E',
    marginBottom: 2,
  },
  postcardDate: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#9B8E83',
  },
  nextAvatarRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  nextAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextAvatarText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#fff',
  },

  hopeCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    padding: 20,
    alignItems: 'center',
  },
  hopeText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_300Light',
    color: '#fff',
    lineHeight: 24,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  hopeSub: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.accent,
    textAlign: 'center',
  },

  // ── Non-continued path ────────────────────────
  groupStatCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    padding: 24,
    alignItems: 'center',
  },
  groupStatNum: {
    fontSize: 56,
    fontFamily: 'PlusJakartaSans_300Light',
    color: '#fff',
    letterSpacing: -2,
    marginBottom: 4,
  },
  groupStatLabel: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
    lineHeight: 20,
  },
  moreMembers: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
    marginTop: 4,
  },

  rejoinCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(168,155,255,0.25)',
    overflow: 'hidden',
  },
  rejoinCardGradient: {
    padding: 22,
  },
  rejoinTitle: {
    fontSize: 17,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#fff',
    marginBottom: 10,
  },
  rejoinBody: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 22,
    marginBottom: 18,
  },
  rejoinFeatureList: { gap: 12 },
  rejoinFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rejoinFeatureLabel: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.65)',
  },

  // ── CTA buttons ──────────────────────────────
  ctaWrap: {
    paddingHorizontal: contentPadding,
    gap: 12,
    marginTop: 4,
    marginBottom: 8,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentVibrant,
    borderRadius: 14,
    height: 52,
    gap: 8,
  },
  primaryBtnAccent: {
    backgroundColor: colors.accent,
  },
  primaryBtnText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#fff',
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    height: 48,
    gap: 6,
  },
  secondaryBtnText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.70)',
  },
  ghostBtn: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  ghostBtnText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.50)',
  },
});
