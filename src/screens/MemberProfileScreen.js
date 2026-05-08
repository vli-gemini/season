import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { contentPadding } from '../theme/layout';
import { LinearGradient } from '../components/Gradient';
import { getSeasonGradient } from '../theme/seasonGradient';
import { CURRENT_DAY, TOTAL_DAYS } from '../config/season';
import { MEMBER_DETAILS } from '../config/members';
import { Embers } from '../components/Embers';

function Avatar({ user, size = 64 }) {
  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: user.color + '30',
          borderWidth: 2,
          borderColor: user.color + '55',
        },
      ]}
    >
      <Text style={[styles.avatarText, { fontSize: size * 0.3 }]}>
        {user.initials}
      </Text>
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
          color={platform.id === 'youtube' ? '#FF453A' : colors.textSecondary}
        />
      </View>
      <View>
        <Text style={styles.platformLabel}>{platform.label}</Text>
        <Text style={styles.platformHandle}>{platform.username}</Text>
      </View>
    </View>
  );
}

function GlassSection({ children, style }) {
  return (
    <View style={[styles.glassSection, style]}>
      <BlurView intensity={18} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, styles.glassSectionOverlay]} />
      {children}
    </View>
  );
}

export function MemberProfileScreen({ navigation, route }) {
  const user = route?.params?.user ?? { id: '1', name: 'Sarah Liao', initials: 'SL', color: '#8B7FF5' };
  const details = MEMBER_DETAILS[user.id] ?? {
    handle: '',
    platforms: [],
    streak: 0,
    madeCount: 0,
    bio: '',
  };

  const [muted, setMuted] = useState(false);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <LinearGradient
        colors={getSeasonGradient(CURRENT_DAY, TOTAL_DAYS)}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Embers />

      {/* Header */}
      <View style={styles.headerWrap}>
        <BlurView intensity={70} tint="systemMaterial" style={StyleSheet.absoluteFill} />
        <View style={[StyleSheet.absoluteFill, styles.headerOverlay]} />
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            accessibilityLabel="Back"
            accessibilityRole="button"
          >
            <Ionicons name="chevron-back" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{user.name.split(' ')[0]}</Text>
          <View style={{ width: 38 }} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Identity */}
        <View style={styles.identity}>
          <Avatar user={user} size={80} />
          <Text style={styles.name}>{user.name}</Text>
          {details.handle ? <Text style={styles.handle}>{details.handle}</Text> : null}
          {details.bio ? <Text style={styles.bio}>{details.bio}</Text> : null}
        </View>

        {/* Stats */}
        <GlassSection style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{details.streak}</Text>
            <Text style={styles.statLabel}>day streak</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{details.madeCount}</Text>
            <Text style={styles.statLabel}>things made</Text>
          </View>
        </GlassSection>

        {/* Platforms */}
        {details.platforms.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Where they create</Text>
            <GlassSection>
              {details.platforms.map((p) => (
                <PlatformRow key={p.id} platform={p} />
              ))}
            </GlassSection>
          </View>
        )}

        {/* DM Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <GlassSection>
            <TouchableOpacity
              style={[styles.settingRow, styles.settingRowBtn]}
              onPress={() => setMuted((m) => !m)}
              accessibilityRole="button"
              accessibilityLabel={muted ? 'Unmute conversation' : 'Mute conversation'}
            >
              <Text style={styles.settingLabel}>
                {muted ? 'Unmute conversation' : 'Mute conversation'}
              </Text>
              <Ionicons
                name={muted ? 'notifications-off-outline' : 'notifications-outline'}
                size={16}
                color={colors.textMuted}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.settingRow, styles.settingRowBtn, { borderBottomWidth: 0 }]}
              onPress={() =>
                Alert.alert(
                  `Block ${user.name.split(' ')[0]}?`,
                  "You won't be able to message each other.",
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Block', style: 'destructive', onPress: () => navigation.goBack() },
                  ]
                )
              }
            >
              <Text style={[styles.settingLabel, { color: colors.error }]}>
                Block {user.name.split(' ')[0]}
              </Text>
            </TouchableOpacity>
          </GlassSection>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  headerWrap: {
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  headerOverlay: {
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: contentPadding,
    paddingVertical: 12,
  },
  backBtn: { padding: 4, width: 38 },
  headerTitle: {
    fontSize: 17,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  scroll: { paddingBottom: 56 },
  identity: {
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: contentPadding,
  },
  avatar: { alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  avatarText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.textPrimary,
  },
  name: {
    fontSize: 24,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  handle: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textMuted,
    marginBottom: 12,
  },
  bio: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
    lineHeight: 21,
    textAlign: 'center',
    maxWidth: 280,
  },

  // Glass section
  glassSection: {
    overflow: 'hidden',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  glassSectionOverlay: {
    backgroundColor: 'rgba(255,255,255,0.06)',
  },

  statsRow: {
    flexDirection: 'row',
    marginHorizontal: contentPadding,
    padding: 18,
    marginBottom: 28,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: {
    fontSize: 32,
    fontFamily: 'PlusJakartaSans_300Light',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textMuted,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.10)',
    marginHorizontal: 8,
  },
  section: {
    paddingHorizontal: contentPadding,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  platformRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.07)',
    gap: 12,
  },
  platformIcon: { width: 28, alignItems: 'center' },
  platformLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textMuted,
    marginBottom: 2,
  },
  platformHandle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.textPrimary,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.07)',
  },
  settingRowBtn: {},
  settingLabel: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textPrimary,
  },
});
