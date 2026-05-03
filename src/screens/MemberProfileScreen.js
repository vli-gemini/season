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
          backgroundColor: user.color + '33',
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

export function MemberProfileScreen({ navigation, route }) {
  const user = route?.params?.user ?? { id: '1', name: 'Sarah Liao', initials: 'SL', color: '#8B7FF5' };
  const details = MEMBER_DETAILS[user.id] ?? {
    handle: '',
    platforms: [],
    streak: 0,
    madeCount: 0,
    bio: '',
  };

  const [notificationsOn, setNotificationsOn] = useState(true);
  const [muted, setMuted] = useState(false);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <LinearGradient
        colors={getSeasonGradient(CURRENT_DAY, TOTAL_DAYS)}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Embers />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Identity */}
        <View style={styles.identity}>
          <Avatar user={user} size={72} />
          <Text style={styles.name}>{user.name}</Text>
          {details.handle ? <Text style={styles.handle}>{details.handle}</Text> : null}
          {details.bio ? <Text style={styles.bio}>{details.bio}</Text> : null}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{details.streak}</Text>
            <Text style={styles.statLabel}>day streak</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{details.madeCount}</Text>
            <Text style={styles.statLabel}>things made</Text>
          </View>
        </View>

        {/* Platforms */}
        {details.platforms.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Where they create</Text>
            <View style={styles.card}>
              {details.platforms.map((p) => (
                <PlatformRow key={p.id} platform={p} />
              ))}
            </View>
          </View>
        )}

        {/* DM Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Notifications</Text>
              <Switch
                value={notificationsOn}
                onValueChange={setNotificationsOn}
                trackColor={{ false: colors.border, true: colors.accentWarm + '80' }}
                thumbColor={notificationsOn ? colors.accentWarm : colors.textMuted}
              />
            </View>
            <TouchableOpacity
              style={[styles.settingRow, styles.settingRowBtn]}
              onPress={() => setMuted((m) => !m)}
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
                  'They won\'t be able to send you DMs. You can unblock them from your account settings.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Block',
                      style: 'destructive',
                      onPress: () => navigation.goBack(),
                    },
                  ]
                )
              }
            >
              <Text style={[styles.settingLabel, { color: colors.error }]}>
                Block {user.name.split(' ')[0]}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: contentPadding,
    paddingVertical: 12,
  },
  backBtn: { padding: 4, width: 38 },
  scroll: { paddingBottom: 48 },
  identity: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 28,
    paddingHorizontal: contentPadding,
  },
  avatar: { alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  avatarText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.textPrimary,
  },
  name: {
    fontSize: 22,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  handle: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textMuted,
    marginBottom: 10,
  },
  bio: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
    lineHeight: 20,
    textAlign: 'center',
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
  statItem: { flex: 1, alignItems: 'center' },
  statValue: {
    fontSize: 28,
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
  platformRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 12,
  },
  platformIcon: { width: 28, alignItems: 'center' },
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
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingRowBtn: {},
  settingLabel: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textPrimary,
  },
});
