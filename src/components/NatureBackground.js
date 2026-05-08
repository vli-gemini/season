import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from './Gradient';

export const NATURE_SCENES = {
  forest:    { type: 'video', source: require('../../assets/onboarding1.mp4') },
  bloom:     { type: 'video', source: require('../../assets/onboarding2.mp4') },
  lake:      { type: 'image', uri: 'https://images.unsplash.com/photo-1544954412-78da2cfa1a0c?w=900&q=80' },
  meadow:    { type: 'image', uri: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=900&q=80' },
  mist:      { type: 'image', uri: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80' },
  dandelion: { type: 'video', source: require('../../assets/onboarding3.mp4') },
};

const AnimatedImage = Animated.createAnimatedComponent(Image);

export function NatureBackground({
  scene = 'forest',
  tintColors,
  tintOpacity = 1,
  children,
  style,
}) {
  const sceneData = typeof scene === 'string' ? NATURE_SCENES[scene] : { type: 'image', uri: scene };
  const isVideo = sceneData?.type === 'video';

  const scale = useRef(new Animated.Value(1.08)).current;
  const translateX = useRef(new Animated.Value(-6)).current;
  const translateY = useRef(new Animated.Value(-4)).current;

  useEffect(() => {
    if (isVideo) return;
    const anim = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scale,      { toValue: 1.14, duration: 9000, useNativeDriver: true }),
          Animated.timing(translateX, { toValue: 6,    duration: 9000, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: 4,    duration: 9000, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(scale,      { toValue: 1.08, duration: 9000, useNativeDriver: true }),
          Animated.timing(translateX, { toValue: -6,   duration: 9000, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: -4,   duration: 9000, useNativeDriver: true }),
        ]),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [isVideo]);

  return (
    <View style={[styles.root, style]}>
      {isVideo ? (
        <Video
          source={sceneData.source ?? { uri: sceneData.uri }}
          style={StyleSheet.absoluteFill}
          videoStyle={StyleSheet.absoluteFill}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping
          isMuted
          useNativeControls={false}
        />
      ) : (
        <View style={styles.imageClip}>
          <AnimatedImage
            source={{ uri: sceneData.uri }}
            style={[
              StyleSheet.absoluteFill,
              { transform: [{ scale }, { translateX }, { translateY }] },
            ]}
            resizeMode="cover"
          />
        </View>
      )}
      {tintColors && (
        <LinearGradient
          colors={tintColors}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={[StyleSheet.absoluteFill, { opacity: tintOpacity }]}
        />
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
  imageClip: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
});
