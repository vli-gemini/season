import { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors } from '../theme/colors';
import { LinearGradient } from '../components/Gradient';

export function SplashScreen({ navigation }) {
  const wordmarkOpacity = useRef(new Animated.Value(0)).current;
  const wordmarkScale = useRef(new Animated.Value(1.06)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(500),
      Animated.parallel([
        Animated.timing(wordmarkOpacity, { toValue: 1, duration: 1400, useNativeDriver: true }),
        Animated.timing(wordmarkScale, { toValue: 1, duration: 1400, useNativeDriver: true }),
      ]),
      Animated.delay(150),
      Animated.timing(taglineOpacity, { toValue: 1, duration: 700, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => navigation.replace('Onboarding'), 3400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.content}>
        <Animated.Text
          style={[
            styles.wordmark,
            { opacity: wordmarkOpacity, transform: [{ scale: wordmarkScale }] },
          ]}
        >
          Season
        </Animated.Text>

        <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
          The creator community{'\n'}designed to end.
        </Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 32,
  },
  wordmark: {
    fontSize: 48,
    fontFamily: 'DMSerifDisplay_400Regular',
    color: '#F7DCB9',
    lineHeight: 58,
  },
  tagline: {
    fontSize: 17,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
