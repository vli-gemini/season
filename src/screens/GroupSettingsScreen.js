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
import { BlurView } from 'expo-blur';
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

function Avatar({ member, size = 44 }) {
  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: member.color + '33',
          borderWidth: 1.5,
          borderColor: member.color + '55',
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
        colors={['#8B7FFF', '#4A3FC8']}
        style={[StyleSheet.absoluteFill, { borderRadius: size / 2 }]}
      />
      <Ionicons name="people" size={size * 0.44} color="rgba(255,255,255,0.92)" />
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

export function GroupSettingsScreen({ navigation }) {
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [showActivity, setShowActivity] = useState(true);

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
          <Text style={styles.headerTitle}>{GROUP.name}</Text>
          <View style={{ width: 38 }} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Group identity */}
        <View style={styles.identity}>
          <GroupAvatar size={80} />
          <Text style={styles.groupName}>{GROUP.name}</Text>
          <Text style={styles.groupMeta}>{GROUP.season} · Day {GROUP.day} of {GROUP.total}</Text>
        </View>

        {/* Members */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Members</Text>
          <GlassSection>
            {MEMBERS.map((member, i) => (
              <TouchableOpacity
                key={member.id}
                style={[styles.memberRow, i === MEMBERS.length - 1 && { borderBottomWidth: 0 }]}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('MemberProfile', { user: member })}
              >
                <Avatar member={member} size={40} />
                <Text style={styles.memberName}>{member.name}</Text>
                <Ionicons name="chevron-forward" size={15} color={colors.textMuted} style={{ opacity: 0.5 }} />
              </TouchableOpacity>
            ))}
          </GlassSection>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <GlassSection>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Notifications</Text>
              <Switch
                value={notificationsOn}
                onValueChange={setNotificationsOn}
                trackColor={{ false: 'rgba(255,255,255,0.15)', true: colors.accentVibrant + '80' }}
                thumbColor={notificationsOn ? colors.accent : colors.textMuted}
              />
            </View>
            <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.settingLabel}>Show my activity</Text>
              <Switch
                value={showActivity}
                onValueChange={setShowActivity}
                trackColor={{ false: 'rgba(255,255,255,0.15)', true: colors.accentVibrant + '80' }}
                thumbColor={showActivity ? colors.accent : colors.textMuted}
              />
            </View>
          </GlassSection>
        </View>

        {/* Danger */}
        <View style={[styles.section, { paddingBottom: 48 }]}>
          <GlassSection>
            <TouchableOpacity
              style={[styles.settingRow, { borderBottomWidth: 0 }]}
              onPress={() =>
                Alert.alert(
                  'Leave group?',
                  "You'll lose access to the group chat. Your season progress will be recorded.",
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
  scroll: { paddingBottom: 48 },
  identity: {
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 20,
  },
  groupAvatarWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#7B6FFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
  },
  groupName: {
    fontSize: 24,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.3,
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
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressLabel: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textMuted,
    textAlign: 'right',
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

  avatar: { alignItems: 'center', justifyContent: 'center' },
  avatarText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.textPrimary,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.07)',
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
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.07)',
  },
  settingLabel: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textPrimary,
  },
});
