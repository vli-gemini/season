import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { contentPadding } from '../theme/layout';
import { LinearGradient } from '../components/Gradient';

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
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <LinearGradient colors={colors.gradientBackground} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.settingsBtn}>
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

        {/* Platforms */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Where you create</Text>
          <View style={styles.card}>
            {MOCK_USER.platforms.map((p) => (
              <PlatformRow key={p.id} platform={p} />
            ))}
            <TouchableOpacity style={styles.addPlatformBtn}>
              <Ionicons name="add" size={14} color={colors.textSecondary} />
              <Text style={styles.addPlatformText}>Add platform</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.actionRow}>
            <Text style={styles.actionLabel}>Edit profile</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionRow}>
            <Text style={styles.actionLabel}>Notification settings</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionRow, { borderBottomWidth: 0 }]}>
            <Text style={[styles.actionLabel, { color: colors.error }]}>Sign out</Text>
          </TouchableOpacity>
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
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  actionLabel: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textPrimary,
  },
});
