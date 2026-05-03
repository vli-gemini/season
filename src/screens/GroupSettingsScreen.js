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
import { LinearGradient } from '../components/Gradient';
import { colors } from '../theme/colors';
import { contentPadding } from '../theme/layout';
import { getSeasonGradient } from '../theme/seasonGradient';
import { CURRENT_DAY, TOTAL_DAYS } from '../config/season';
import { GROUP_MEMBERS } from '../config/members';
import { Embers } from '../components/Embers';

const GROUP = {
  name: 'the hideout',
  season: 'Season 1',
  day: CURRENT_DAY,
  total: TOTAL_DAYS,
  endDate: 'Apr 30',
};

const MEMBERS = GROUP_MEMBERS;

function Avatar({ member, size = 48 }) {
  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: member.color + '33',
        },
      ]}
    >
      <Text style={[styles.avatarText, { fontSize: size * 0.3 }]}>
        {member.initials}
      </Text>
    </View>
  );
}

function GroupAvatar({ size = 72 }) {
  return (
    <View style={[styles.groupAvatarWrap, { width: size, height: size, borderRadius: size / 2 }]}>
      <LinearGradient
        colors={['#6B5FD4', '#3D2E8C']}
        style={[StyleSheet.absoluteFill, { borderRadius: size / 2 }]}
      />
      <Ionicons name="people" size={size * 0.44} color="rgba(255,255,255,0.85)" />
    </View>
  );
}

export function GroupSettingsScreen({ navigation }) {
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [showActivity, setShowActivity] = useState(true);

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
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Group identity */}
        <View style={styles.identity}>
          <GroupAvatar size={72} />
          <Text style={styles.groupName}>{GROUP.name}</Text>
          <Text style={styles.groupMeta}>{GROUP.season} · Day {GROUP.day} of {GROUP.total}</Text>
        </View>

        {/* Progress bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${(GROUP.day / GROUP.total) * 100}%` }]} />
          </View>
          <Text style={styles.progressLabel}>Ends {GROUP.endDate}</Text>
        </View>

        {/* Members */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Members</Text>
          <View style={styles.card}>
            {MEMBERS.map((member, i) => (
              <TouchableOpacity
                key={member.id}
                style={[styles.memberRow, i === MEMBERS.length - 1 && { borderBottomWidth: 0 }]}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('MemberProfile', { user: member })}
              >
                <Avatar member={member} size={40} />
                <Text style={styles.memberName}>{member.name}</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Group settings */}
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
            <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.settingLabel}>Show my activity</Text>
              <Switch
                value={showActivity}
                onValueChange={setShowActivity}
                trackColor={{ false: colors.border, true: colors.accentWarm + '80' }}
                thumbColor={showActivity ? colors.accentWarm : colors.textMuted}
              />
            </View>
          </View>
        </View>

        {/* Danger */}
        <View style={[styles.section, { paddingBottom: 40 }]}>
          <View style={styles.card}>
            <TouchableOpacity
              style={[styles.settingRow, { borderBottomWidth: 0 }]}
              onPress={() =>
                Alert.alert(
                  'Leave group?',
                  'You\'ll lose access to the group chat. Your season progress will be recorded.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Leave',
                      style: 'destructive',
                      onPress: () => navigation.navigate('SeasonEnding', { day: GROUP.day }),
                    },
                  ]
                )
              }
            >
              <Text style={[styles.settingLabel, { color: colors.error }]}>Leave group</Text>
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
    paddingBottom: 20,
  },
  groupAvatarWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 14,
  },
  groupName: {
    fontSize: 22,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  groupMeta: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textMuted,
  },

  progressSection: {
    paddingHorizontal: contentPadding,
    marginBottom: 28,
  },
  progressTrack: {
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accentWarm,
    borderRadius: 2,
  },
  progressLabel: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textMuted,
    textAlign: 'right',
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

  avatar: { alignItems: 'center', justifyContent: 'center' },
  avatarText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.textPrimary,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  memberName: {
    flex: 1,
    fontSize: 15,
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
  settingLabel: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textPrimary,
  },
});
