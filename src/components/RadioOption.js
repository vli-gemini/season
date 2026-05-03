import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export function RadioOption({ label, selected, onPress, multiSelect = false }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole={multiSelect ? 'checkbox' : 'radio'}
      accessibilityState={{ checked: selected }}
      accessibilityLabel={label}
      style={[styles.container, selected && styles.containerSelected]}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
      <View style={[styles.indicator, selected && styles.indicatorSelected]}>
        {selected && (
          <Ionicons name="checkmark" size={12} color="#fff" />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    height: 72,
    borderRadius: 40,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(148,148,148,0.5)',
    opacity: 0.8,
  },
  containerSelected: {
    borderColor: 'rgba(255,255,255,0.7)',
    opacity: 1,
  },
  label: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.textPrimary,
    lineHeight: 20,
    paddingRight: 12,
  },
  labelSelected: {
    color: colors.textPrimary,
  },
  indicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(148,148,148,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorSelected: {
    backgroundColor: colors.accentWarm,
  },
});
