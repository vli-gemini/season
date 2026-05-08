import { Platform, View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

const BLUR_CSS = 'blur(30px) saturate(180%)';

export function FrostedBar({ children, style, pointerEvents, position = 'top' }) {
  const maskColors = position === 'top'
    ? ['rgba(0,0,0,1)', 'rgba(0,0,0,0)']
    : ['rgba(0,0,0,0)', 'rgba(0,0,0,1)'];

  const webMask = position === 'top'
    ? 'linear-gradient(to bottom, black, transparent)'
    : 'linear-gradient(to top, black, transparent)';

  if (Platform.OS === 'web') {
    return (
      <View
        pointerEvents={pointerEvents}
        style={[
          styles.bar,
          {
            // @ts-ignore — RN Web forwards unknown style keys as CSS
            backdropFilter: BLUR_CSS,
            WebkitBackdropFilter: BLUR_CSS,
            maskImage: webMask,
            WebkitMaskImage: webMask,
          },
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  // iOS: MaskedView clips BlurView alpha with a gradient — pure blur, no color
  return (
    <MaskedView
      style={[styles.bar, style]}
      pointerEvents={pointerEvents}
      maskElement={
        <LinearGradient
          colors={maskColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      }
    >
      <BlurView
        intensity={90}
        tint="systemMaterial"
        style={StyleSheet.absoluteFill}
      />
      {children}
    </MaskedView>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
});
