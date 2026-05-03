import React from 'react';
import { View, Platform } from 'react-native';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';

export function LinearGradient({ colors, locations, start, end, style, children }) {
  if (Platform.OS === 'web') {
    const s = start ?? { x: 0, y: 0 };
    const e = end ?? { x: 1, y: 1 };
    const angle = Math.round(Math.atan2(e.x - s.x, e.y - s.y) * (180 / Math.PI)) + 180;
    const stops = colors.map((c, i) => {
      const pct = locations ? `${locations[i] * 100}%` : undefined;
      return pct ? `${c} ${pct}` : c;
    }).join(', ');

    return (
      <View
        style={[style, { backgroundImage: `linear-gradient(${angle}deg, ${stops})` }]}
      >
        {children}
      </View>
    );
  }

  return (
    <ExpoLinearGradient
      colors={colors}
      locations={locations}
      start={start ?? { x: 0, y: 0 }}
      end={end ?? { x: 1, y: 1 }}
      style={style}
    >
      {children}
    </ExpoLinearGradient>
  );
}
