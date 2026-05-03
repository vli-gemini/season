import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { LinearGradient } from '../components/Gradient';
import { colors } from '../theme/colors';
import { contentPadding } from '../theme/layout';
import { Button } from '../components/Button';

const { width } = Dimensions.get('window');
const STORY_DURATION = 5000;

const SLIDE_GRADIENTS = [
  ['#5D4463', '#568C89'],
  ['#5D4463', '#568C89'],
  ['#5D4463', '#568C89'],
];

const SLIDES = [
  {
    id: '1',
    headline: 'Eight creators.\nChosen for exactly\nwhere you are.',
    cta: 'Find your people',
  },
  {
    id: '2',
    headline: 'Thirty days.\nOne season.\nMeaningful because it ends.',
    cta: 'Find your people',
  },
  {
    id: '3',
    headline: 'Your next season starts\nwith the right people.',
    cta: 'Find your people',
  },
];

function StoryProgressBars({ total, activeIndex, progressAnim }) {
  return (
    <View style={bars.row}>
      {Array.from({ length: total }).map((_, i) => {
        const isPast = i < activeIndex;
        const isActive = i === activeIndex;

        const fillWidth = isActive
          ? progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] })
          : isPast
          ? '100%'
          : '0%';

        return (
          <View key={i} style={bars.track}>
            <Animated.View style={[bars.fill, { width: fillWidth }]} />
          </View>
        );
      })}
    </View>
  );
}

const bars = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: contentPadding,
    paddingTop: 56,
  },
  track: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
});

export function OnboardingScreen({ navigation }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const animationRef = useRef(null);

  const goTo = (index) => {
    if (index >= SLIDES.length) {
      navigation.replace('Quiz', { questionIndex: 0 });
      return;
    }
    if (index < 0) return;
    progressAnim.setValue(0);
    setActiveIndex(index);
  };

  useEffect(() => {
    progressAnim.setValue(0);

    animationRef.current = Animated.timing(progressAnim, {
      toValue: 1,
      duration: STORY_DURATION,
      useNativeDriver: false,
    });

    animationRef.current.start(({ finished }) => {
      if (finished) goTo(activeIndex + 1);
    });

    return () => animationRef.current?.stop();
  }, [activeIndex]);

  const handleTap = (e) => {
    const tapX = e.nativeEvent.locationX;
    if (tapX < width / 3) {
      goTo(activeIndex - 1);
    } else {
      goTo(activeIndex + 1);
    }
  };

  const slide = SLIDES[activeIndex];

  return (
    <TouchableWithoutFeedback onPress={handleTap}>
      <View style={styles.container}>
        <LinearGradient
          colors={SLIDE_GRADIENTS[activeIndex]}
          style={StyleSheet.absoluteFill}
        />

        <StoryProgressBars
          total={SLIDES.length}
          activeIndex={activeIndex}
          progressAnim={progressAnim}
        />

        <View style={styles.content}>
          <Text style={styles.wordmark}>Season</Text>
          <View style={styles.bottom}>
            <Text style={styles.headline}>{slide.headline}</Text>
            <Button
              label={slide.cta}
              onPress={() => navigation.replace('Quiz', { questionIndex: 0 })}
              style={styles.ctaBtn}
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: contentPadding,
    paddingBottom: 48,
    justifyContent: 'space-between',
    paddingTop: 24,
  },
  wordmark: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_300Light',
    color: colors.textPrimary,
    letterSpacing: 0.3,
  },
  bottom: {
    gap: 24,
  },
  headline: {
    fontSize: 30,
    fontFamily: 'PlusJakartaSans_300Light',
    color: colors.textPrimary,
    lineHeight: 40,
    letterSpacing: -0.3,
  },
  ctaBtn: {
    borderRadius: 14,
  },
});
