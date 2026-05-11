import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { NatureBackground } from '../components/NatureBackground';
import { colors } from '../theme/colors';
import { contentPadding } from '../theme/layout';
import { Button } from '../components/Button';

const { width } = Dimensions.get('window');
const STORY_DURATION = 5000;

// Nature scenes per slide — replace 'scene' strings with local require() once assets are added.
// e.g. scene: require('../../assets/nature/forest.jpg')
const SLIDES = [
  {
    id: '1',
    scene: 'forest',
    headline: 'A small group of creators.\nChosen for exactly where you are.',
    cta: 'Find your people',
  },
  {
    id: '2',
    scene: 'bloom',
    headline: 'Thirty days.\nOne season.\nMeaningful because it ends.',
    cta: 'Find your people',
  },
  {
    id: '3',
    scene: 'dandelion',
    headline: 'Your next season starts with the right people.',
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
    gap: 5,
    paddingHorizontal: contentPadding,
    paddingTop: 60,
  },
  track: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.20)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.90)',
    borderRadius: 2,
  },
});

const _slideParam = Platform.OS === 'web' && typeof window !== 'undefined'
  ? new URLSearchParams(window.location.search).get('slide')
  : null;
const previewSlide = _slideParam !== null ? parseInt(_slideParam, 10) : 0;
const isPreview    = _slideParam !== null;

export function OnboardingScreen({ navigation }) {
  const [activeIndex, setActiveIndex] = useState(previewSlide);
  const [paused, setPaused] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const animationRef = useRef(null);
  const isLastSlide = activeIndex === SLIDES.length - 1;

  const goTo = (index) => {
    if (index >= SLIDES.length) return;
    if (index < 0) return;
    if (paused && index > activeIndex) return;

    progressAnim.setValue(0);
    setPaused(false);
    setActiveIndex(index);
  };

  useEffect(() => {
    setPaused(false);
    progressAnim.setValue(0);

    animationRef.current = Animated.timing(progressAnim, {
      toValue: 1,
      duration: STORY_DURATION,
      useNativeDriver: false,
    });

    animationRef.current.start(({ finished }) => {
      if (finished) {
        if (isLastSlide || isPreview) {
          setPaused(true);
        } else {
          goTo(activeIndex + 1);
        }
      }
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
    <View style={styles.container}>
      {/* Pre-render all backgrounds so videos are already loaded on switch */}
      {SLIDES.map((s, i) => (
        <NatureBackground
          key={s.id}
          scene={s.scene}
          style={[StyleSheet.absoluteFill, { opacity: i === activeIndex ? 1 : 0 }]}
        />
      ))}

      {/* Tap zones for prev/next — behind content, disabled when paused on last slide */}
      <TouchableOpacity
        style={styles.tapZoneLeft}
        onPress={() => activeIndex === 0 ? navigation.replace('Splash') : goTo(activeIndex - 1)}
        activeOpacity={1}
        accessibilityLabel="Previous slide"
        accessibilityRole="button"
      />
      <TouchableOpacity
        style={styles.tapZoneRight}
        onPress={() => goTo(activeIndex + 1)}
        activeOpacity={1}
        accessibilityLabel="Next slide"
        accessibilityRole="button"
        disabled={paused || isLastSlide}
      />

      <StoryProgressBars
        total={SLIDES.length}
        activeIndex={activeIndex}
        progressAnim={progressAnim}
      />

<View style={styles.content} pointerEvents="box-none">
        <View style={styles.top}>
          <Text style={styles.wordmark}>
            Welcome to <Text style={styles.wordmarkBrand}>Season</Text>
          </Text>
          <Text style={styles.headline}>{slide.headline}</Text>
        </View>
        <View style={styles.bottom}>
          <View style={styles.ctaWrap}>
            <Button
              label={slide.cta}
              onPress={() => navigation.replace('Quiz', { questionIndex: 0 })}
              variant="solid"
              color="transparent"
              textColor="#ffffff"
              style={styles.ctaBtn}
            />
          </View>

          <TouchableOpacity
            onPress={() => navigation.replace('Auth')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
          >
            <Text style={styles.secondaryBtn}>I already have an account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tapZoneLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '33%',
    zIndex: 1,
  },
  tapZoneRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '67%',
    zIndex: 1,
  },
content: {
    flex: 1,
    paddingHorizontal: contentPadding,
    paddingBottom: 52,
    justifyContent: 'space-between',
    paddingTop: 20,
    zIndex: 2,
  },
  wordmark: {
    fontSize: 17,
    fontFamily: 'PlusJakartaSans_300Light',
    color: '#ffffff',
    letterSpacing: 0.5,
    opacity: 0.8,
  },
  wordmarkBrand: {
    color: '#ffffff',
    opacity: 1,
  },
  top: {
    gap: 8,
  },
  bottom: {
    gap: 28,
  },
  headline: {
    fontSize: 32,
    fontFamily: 'PlusJakartaSans_300Light',
    color: '#ffffff',
    lineHeight: 42,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.30)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  ctaWrap: {
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.40)',
    backgroundColor: 'rgba(255,255,255,0.40)',
  },
  ctaBtn: {
    borderRadius: 0,
  },
  secondaryBtn: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255, 255, 255, 0.70)',
    letterSpacing: 0.1,
  },
});
