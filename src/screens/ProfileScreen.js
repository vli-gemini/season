import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { contentPadding } from '../theme/layout';
import { LinearGradient } from '../components/Gradient';
import { getSeasonGradient } from '../theme/seasonGradient';
import { CURRENT_DAY, TOTAL_DAYS } from '../config/season';
import { GROUP_MEMBERS } from '../config/members';
import { Embers } from '../components/Embers';

// Simulated enrollment state — in a real app this would come from app-level state/context
// 'enrolled' | 'skipped' | 'opted-out'
const DEMO_ENROLLMENT = 'enrolled';
const DEMO_SELECTED_IDS = new Set(['1', '3']); // Sarah, Priya saved as preferences

const MOCK_USER = {
  name: 'Your Name',
  handle: '@yourhandle',
  platforms: [
    { id: 'youtube', label: 'YouTube', username: '@yourchannel' },
    { id: 'tiktok', label: 'TikTok', username: '@yourhandle' },
  ],
  streak: 10,
  madeCount: 7,
  season: {
    name: 'the hideout',
    day: 10,
    total: 30,
    endDate: 'Apr 30',
  },
};

function StatCard({ label, value }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function PlatformRow({ platform }) {
  return (
    <View style={styles.platformRow}>
      <View style={styles.platformIcon}>
        <Ionicons
          name={platform.id === 'youtube' ? 'logo-youtube' : 'musical-notes-outline'}
          size={16}
          color={platform.id === 'youtube' ? '#FF0000' : colors.textSecondary}
        />
      </View>
      <View>
        <Text style={styles.platformLabel}>{platform.label}</Text>
        <Text style={styles.platformHandle}>{platform.username}</Text>
      </View>
    </View>
  );
}

export function ProfileScreen({ navigation }) {
  const [enrollment, setEnrollment] = useState(DEMO_ENROLLMENT);
  const [notificationsOn, setNotificationsOn] = useState(enrollment !== 'opted-out');
  const selectedMembers = GROUP_MEMBERS.filter((m) => DEMO_SELECTED_IDS.has(m.id));

  const handleRejoin = () => {
    setEnrollment('enrolled');
    setNotificationsOn(true);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <LinearGradient colors={getSeasonGradient(CURRENT_DAY, TOTAL_DAYS)} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      <Embers />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity
          style={styles.settingsBtn}
          onPress={() => navigation.navigate('GroupSettings')}
        >
          <Ionicons name="settings-outline" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Avatar + name */}
        <View style={styles.identity}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarInitials}>YN</Text>
          </View>
          <Text style={styles.name}>{MOCK_USER.name}</Text>
          <Text style={styles.handle}>{MOCK_USER.handle}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard label="day streak" value={MOCK_USER.streak} />
          <View style={styles.statDivider} />
          <StatCard label="things made" value={MOCK_USER.madeCount} />
          <View style={styles.statDivider} />
          <StatCard label="days left" value={MOCK_USER.season.total - MOCK_USER.season.day} />
        </View>

        {/* Current season */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Season</Text>
          <View style={styles.seasonCard}>
            <View style={styles.seasonRow}>
              <Text style={styles.seasonName}>{MOCK_USER.season.name}</Text>
              <Text style={styles.seasonDay}>Day {MOCK_USER.season.day}</Text>
            </View>
            <View style={styles.seasonProgressTrack}>
              <View
                style={[
                  styles.seasonProgressFill,
                  { width: `${(MOCK_USER.season.day / MOCK_USER.season.total) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.seasonEnds}>Ends {MOCK_USER.season.endDate}</Text>
          </View>
        </View>

        {/* Next Season */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Next Season</Text>
          <View style={styles.card}>
            {enrollment === 'opted-out' ? (
              <>
                <View style={styles.enrollmentStatusRow}>
                  <View style={[styles.enrollmentDot, { backgroundColor: colors.error }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.enrollmentStatusLabel}>You've opted out</Text>
                    <Text style={styles.enrollmentStatusSub}>Notifications are paused on your account.</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.actionRow} onPress={handleRejoin}>
                  <Text style={[styles.actionLabel, { color: colors.accentWarm }]}>Reconsider and rejoin</Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.accentWarm} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionRow, { borderBottomWidth: 0 }]}
                  onPress={() => navigation.navigate('SeasonEnding')}
                >
                  <Text style={styles.actionLabel}>Manage enrollment preferences</Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.enrollmentStatusRow}>
                  <View style={[styles.enrollmentDot, { backgroundColor: '#5ECA8A' }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.enrollmentStatusLabel}>
                      {enrollment === 'enrolled' ? "You're in for next season" : "Sitting this one out"}
                    </Text>
                    {selectedMembers.length > 0 ? (
                      <View style={styles.enrollmentAvatarRow}>
                        {selectedMembers.map((m) => (
                          <View
                            key={m.id}
                            style={[styles.enrollmentAvatar, { backgroundColor: m.color + '33', borderColor: m.color + '55' }]}
                          >
                            <Text style={styles.enrollmentAvatarText}>{m.initials}</Text>
                          </View>
                        ))}
                        <Text style={styles.enrollmentAvatarLabel}>
                          {selectedMembers.length} {selectedMembers.length === 1 ? 'person' : 'people'} saved
                        </Text>
                      </View>
                    ) : (
                      <Text style={styles.enrollmentStatusSub}>No preferences saved yet.</Text>
                    )}
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.actionRow}
                  onPress={() => navigation.navigate('SeasonEnding')}
                >
                  <Text style={styles.actionLabel}>Update who you'd like to continue with</Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionRow, { borderBottomWidth: 0 }]}
                  onPress={() => {
                    setEnrollment('opted-out');
                    setNotificationsOn(false);
                  }}
                >
                  <Text style={[styles.actionLabel, { color: colors.error }]}>Leave Season</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* Platforms */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Where you create</Text>
          <View style={styles.card}>
            {MOCK_USER.platforms.map((p) => (
              <PlatformRow key={p.id} platform={p} />
            ))}
            <TouchableOpacity
              style={styles.addPlatformBtn}
              onPress={() =>
                Alert.alert('Add platform', 'Connect additional platforms to your profile.', [
                  { text: 'YouTube', onPress: () => {} },
                  { text: 'TikTok', onPress: () => {} },
                  { text: 'Instagram', onPress: () => {} },
                  { text: 'Cancel', style: 'cancel' },
                ])
              }
            >
              <Ionicons name="add" size={14} color={colors.textSecondary} />
              <Text style={styles.addPlatformText}>Add platform</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Account */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.actionRow}
              onPress={() =>
                Alert.alert('Edit profile', 'Update your name, handle, and bio.', [
                  { text: 'OK' },
                ])
              }
            >
              <Text style={styles.actionLabel}>Edit profile</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </TouchableOpacity>
            <View style={styles.actionRow}>
              <Text style={styles.actionLabel}>Notifications</Text>
              <Switch
                value={notificationsOn}
                onValueChange={setNotificationsOn}
                trackColor={{ false: colors.border, true: colors.accentWarm + '80' }}
                thumbColor={notificationsOn ? colors.accentWarm : colors.textMuted}
              />
            </View>
            <TouchableOpacity
              style={[styles.actionRow, { borderBottomWidth: 0 }]}
              onPress={() =>
                Alert.alert('Sign out', 'Are you sure you want to sign out?', [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Sign out',
                    style: 'destructive',
                    onPress: () =>
                      navigation.reset({ index: 0, routes: [{ name: 'Auth' }] }),
                  },
                ])
              }
            >
              <Text style={[styles.actionLabel, { color: colors.error }]}>Sign out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: contentPadding,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: { padding: 4 },
  settingsBtn: { padding: 4 },
  headerTitle: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.textPrimary,
  },
  scroll: {
    paddingBottom: 48,
  },
  identity: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.backgroundCard,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarInitials: {
    fontSize: 22,
    fontFamily: 'PlusJakartaSans_300Light',
    color: colors.textSecondary,
  },
  name: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  handle: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textMuted,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: contentPadding,
    backgroundColor: colors.backgroundCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'PlusJakartaSans_300Light',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textMuted,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 8,
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
  card: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  seasonCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  seasonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  seasonName: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textPrimary,
  },
  seasonDay: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textMuted,
  },
  seasonProgressTrack: {
    height: 2,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginBottom: 8,
  },
  seasonProgressFill: {
    height: '100%',
    backgroundColor: colors.textPrimary,
    borderRadius: 2,
  },
  seasonEnds: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textMuted,
  },
  platformRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 12,
  },
  platformIcon: {
    width: 28,
    alignItems: 'center',
  },
  platformLabel: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
    marginBottom: 1,
  },
  platformHandle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textPrimary,
  },
  addPlatformBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 6,
  },
  addPlatformText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  actionLabel: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },

  // Next Season section
  enrollmentStatusRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  enrollmentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  enrollmentStatusLabel: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  enrollmentStatusSub: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textMuted,
  },
  enrollmentAvatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  enrollmentAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  enrollmentAvatarText: {
    fontSize: 9,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.textPrimary,
  },
  enrollmentAvatarLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textMuted,
  },
});
