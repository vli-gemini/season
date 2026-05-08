import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from './Gradient';

export const NATURE_SCENES = {
  forest:    { type: 'video', uri: 'https://videos.pexels.com/video-files/34574890/14651075_3840_2160_24fps.mp4' },
  bloom:     { type: 'video', uri: 'https://videos.pexels.com/video-files/26762543/12002603_3840_2160_30fps.mp4' },
  lake:      { uri: 'https://images.unsplash.com/photo-1544954412-78da2cfa1a0c?w=900&q=80' },
  meadow:    { uri: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=900&q=80' },
  mist:      { uri: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80' },
  dandelion: { type: 'video', uri: 'https://videos.pexels.com/video-files/10637669/10637669-hd_1920_1080_30fps.mp4' },
};


export function NatureBackground({
  scene = 'forest',
  tintColors,
  tintOpacity = 1,
  children,
  style,
}) {
  const sceneData = typeof scene === 'string' ? NATURE_SCENES[scene] : { uri: scene };
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
        <video
          src={sceneData.uri}
          autoPlay
          loop
          muted
          playsInline
          style={styles.video}
        />
      ) : (
        <View style={styles.imageClip}>
          <Animated.Image
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

const styles = {
  root: {
    flex: 1,
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  imageClip: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    overflow: 'hidden',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
};
