import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from '../components/Gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { contentPadding } from '../theme/layout';

const WRAP_DATA = {
  seasonName: 'the hideout',
  startDate: 'Apr 1',
  endDate: 'Apr 30',
  madeCount: 22,
  daysShowed: 28,
  totalDays: 30,
  topMoment: 'Day 14 — you posted your most personal video yet.',
  members: [
    { id: '1', name: 'Sarah Liao', initials: 'SL', color: '#8B7FF5', sharedCount: 26 },
    { id: '2', name: 'Mark Smith', initials: 'MS', color: '#5ECA8A', sharedCount: 24 },
    { id: '3', name: 'Jordan Lee', initials: 'JL', color: '#C4A97D', sharedCount: 19 },
  ],
  nextSeasonOpen: true,
};

function MemberCard({ member, rank }) {
  return (
    <View style={styles.memberCard}>
      <Text style={styles.rank}>#{rank}</Text>
      <View style={[styles.memberAvatar, { backgroundColor: member.color + '33' }]}>
        <Text style={styles.memberInitials}>{member.initials}</Text>
      </View>
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{member.name}</Text>
        <Text style={styles.memberShared}>{member.sharedCount} things made</Text>
      </View>
    </View>
  );
}

export function SeasonWrapScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Hero */}
        <LinearGradient
          colors={['#1A1729', '#0D0B14']}
          style={styles.hero}
        >
          <Text style={styles.eyebrow}>Season Complete</Text>
          <Text style={styles.heroTitle}>{WRAP_DATA.seasonName}</Text>
          <Text style={styles.heroDates}>
            {WRAP_DATA.startDate} — {WRAP_DATA.endDate}
          </Text>
        </LinearGradient>

        {/* Big stats */}
        <View style={styles.bigStats}>
          <View style={styles.bigStatItem}>
            <Text style={styles.bigStatNumber}>{WRAP_DATA.madeCount}</Text>
            <Text style={styles.bigStatLabel}>things made</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.bigStatItem}>
            <Text style={styles.bigStatNumber}>{WRAP_DATA.daysShowed}</Text>
            <Text style={styles.bigStatLabel}>days you showed up</Text>
          </View>
        </View>

        {/* Top moment */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your moment</Text>
          <View style={styles.momentCard}>
            <Ionicons name="star-outline" size={18} color={colors.accent} style={{ marginBottom: 8 }} />
            <Text style={styles.momentText}>{WRAP_DATA.topMoment}</Text>
          </View>
        </View>

        {/* Season members */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your people</Text>
          {WRAP_DATA.members.map((m, i) => (
            <MemberCard key={m.id} member={m} rank={i + 1} />
          ))}
        </View>

        {/* New questions teaser */}
        <View style={styles.section}>
          <View style={styles.nextSeasonCard}>
            <Text style={styles.nextSeasonTitle}>A better match is coming.</Text>
            <Text style={styles.nextSeasonBody}>
              Based on this season, we have 3 new questions to help us find your next group.
            </Text>
            <TouchableOpacity
              style={styles.nextSeasonBtn}
              onPress={() => navigation.navigate('Quiz', { questionIndex: 0 })}
            >
              <Text style={styles.nextSeasonBtnText}>Answer them</Text>
              <Ionicons name="arrow-forward" size={14} color={colors.background} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Share */}
        <View style={[styles.section, { paddingBottom: 40 }]}>
          <TouchableOpacity style={styles.shareBtn}>
            <Ionicons name="share-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.shareBtnText}>Share your season</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: 20 },
  hero: {
    paddingTop: 48,
    paddingBottom: 36,
    paddingHorizontal: contentPadding,
    alignItems: 'center',
  },
  eyebrow: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 34,
    fontFamily: 'PlusJakartaSans_300Light',
    color: colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  heroDates: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
  },
  bigStats: {
    flexDirection: 'row',
    marginHorizontal: contentPadding,
    marginTop: 4,
    marginBottom: 28,
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
  },
  bigStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  bigStatNumber: {
    fontSize: 40,
    fontFamily: 'PlusJakartaSans_300Light',
    color: colors.textPrimary,
    letterSpacing: -1,
  },
  bigStatLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 12,
  },
  section: {
    paddingHorizontal: contentPadding,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  momentCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
  },
  momentText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_300Light',
    color: colors.textPrimary,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 8,
    gap: 12,
  },
  rank: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textMuted,
    width: 20,
    textAlign: 'center',
  },
  memberAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberInitials: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.textPrimary,
  },
  memberInfo: { flex: 1 },
  memberName: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  memberShared: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textMuted,
  },
  nextSeasonCard: {
    backgroundColor: colors.accentSoft,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(155,143,255,0.25)',
    padding: 20,
  },
  nextSeasonTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  nextSeasonBody: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  nextSeasonBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.textPrimary,
    borderRadius: 10,
    height: 44,
    gap: 6,
  },
  nextSeasonBtnText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.background,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  shareBtnText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
  },
});
