import React from 'react';
import { StyleSheet } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

export function VideoBackground({ source }) {
  return (
    <Video
      source={source}
      style={StyleSheet.absoluteFill}
      videoStyle={StyleSheet.absoluteFill}
      resizeMode={ResizeMode.COVER}
      shouldPlay
      isLooping
      isMuted
      useNativeControls={false}
    />
  );
}
