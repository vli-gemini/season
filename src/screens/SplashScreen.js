import { useRef, useCallback } from 'react';
import { StyleSheet, TouchableWithoutFeedback, Animated, Easing, useWindowDimensions, Platform } from 'react-native';

const isPreview = Platform.OS === 'web' &&
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).has('pause');
import { Video, ResizeMode } from 'expo-av';
import Svg, { Defs, Mask, Rect, Image as SvgImage, Text as SvgText } from 'react-native-svg';

const AnimatedSvgText = Animated.createAnimatedComponent(SvgText);

const LETTERS = 'Season'.split('');
const LETTER_COUNT = LETTERS.length;

// ml12 parameters
const IN_DURATION       = 1200;
const IN_INITIAL_DELAY  = 500;
const IN_STAGGER        = 30;
const OUT_DURATION      = 1100;
const OUT_INITIAL_DELAY = 100;
const OUT_STAGGER       = 30;

// Time when the last letter finishes animating in
const IN_COMPLETE_MS = IN_INITIAL_DELAY + IN_STAGGER * (LETTER_COUNT - 1) + IN_DURATION;

export function SplashScreen({ navigation }) {
  const { width, height } = useWindowDimensions();

  const screenOpacity   = useRef(new Animated.Value(0)).current;
  const taglineOpacity  = useRef(new Animated.Value(0)).current;
  const letterOpacities = useRef(LETTERS.map(() => new Animated.Value(0))).current;
  const letterXs        = useRef(LETTERS.map(() => new Animated.Value(40))).current;
  const started         = useRef(false);

  const startAnimation = useCallback(() => {
    if (started.current) return;
    started.current = true;

    Animated.timing(screenOpacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();

    // ml12 in: each letter slides from +40px → 0, easeOutExpo, staggered
    const inAnims = LETTERS.map((_, i) =>
      Animated.sequence([
        Animated.delay(IN_INITIAL_DELAY + IN_STAGGER * i),
        Animated.parallel([
          Animated.timing(letterOpacities[i], { toValue: 1, duration: IN_DURATION, easing: Easing.out(Easing.exp), useNativeDriver: false }),
          Animated.timing(letterXs[i],        { toValue: 0, duration: IN_DURATION, easing: Easing.out(Easing.exp), useNativeDriver: false }),
        ]),
      ])
    );

    // ml12 out: each letter slides 0 → -30px, easeInExpo, staggered
    const outAnims = LETTERS.map((_, i) =>
      Animated.sequence([
        Animated.delay(OUT_INITIAL_DELAY + OUT_STAGGER * i),
        Animated.parallel([
          Animated.timing(letterOpacities[i], { toValue: 0, duration: OUT_DURATION, easing: Easing.in(Easing.exp), useNativeDriver: false }),
          Animated.timing(letterXs[i],        { toValue: -30, duration: OUT_DURATION, easing: Easing.in(Easing.exp), useNativeDriver: false }),
        ]),
      ])
    );

    Animated.sequence([
      Animated.parallel(inAnims),
      Animated.delay(800),
      Animated.parallel(outAnims),
      Animated.timing(screenOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(({ finished }) => {
      if (finished && !isPreview) navigation.replace('Onboarding');
    });

    // Tagline fades in as the last letters arrive
    Animated.sequence([
      Animated.delay(IN_COMPLETE_MS - 400),
      Animated.timing(taglineOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const fontSize        = Math.min(Math.round((width - 64) / 3.6), 160);
  const wordY           = height / 2 + fontSize * 0.365 - 54;
  const taglineTop      = wordY + fontSize * 0.3 + 10;
  const taglineFontSize = Math.min(Math.round(fontSize * 0.18), 22);

  // Distribute letters evenly across the same total width as before
  const totalTextWidth  = fontSize * 3.6;
  const letterWidth     = totalTextWidth / LETTER_COUNT;
  const textStartX      = width / 2 - totalTextWidth / 2;

  return (
    <TouchableWithoutFeedback onPress={() => navigation.replace('Onboarding')}>
      <Animated.View style={[styles.container, { opacity: screenOpacity }]}>

        <Video
          source={require('../../assets/splash.mp4')}
          style={StyleSheet.absoluteFill}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping
          isMuted
          onReadyForDisplay={startAnimation}
        />

        <Svg style={StyleSheet.absoluteFill} width={width} height={height}>
          <Defs>
            <Mask id="seasonMask" x="0" y="0" width={width} height={height}>
              <Rect fill="white" x="0" y="0" width={width} height={height} />
              {LETTERS.map((letter, i) => (
                <AnimatedSvgText
                  key={i}
                  fill="black"
                  fontSize={fontSize}
                  fontFamily="Bungee_400Regular"
                  fontWeight="400"
                  textAnchor="middle"
                  textLength={letterWidth}
                  lengthAdjust="spacingAndGlyphs"
                  x={textStartX + (i + 0.5) * letterWidth}
                  y={wordY}
                  opacity={letterOpacities[i]}
                  style={{ transform: [{ translateX: letterXs[i] }] }}
                >
                  {letter}
                </AnimatedSvgText>
              ))}
            </Mask>
          </Defs>
          <SvgImage
            href={require('../../assets/splash background.png')}
            x="0" y="0"
            width={width} height={height}
            preserveAspectRatio="xMidYMid slice"
            mask="url(#seasonMask)"
          />
        </Svg>

        <Animated.Text
          style={[styles.tagline, { opacity: taglineOpacity, top: taglineTop, fontSize: taglineFontSize, lineHeight: taglineFontSize * 1.6 }]}
        >
          The creator community{'\n'}designed to end.
        </Animated.Text>

      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9BBDD8',
  },
  tagline: {
    position: 'absolute',
    left: 32,
    right: 32,
    fontFamily: 'PlusJakartaSans_300Light',
    color: 'rgba(40, 28, 55, 0.68)',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});
