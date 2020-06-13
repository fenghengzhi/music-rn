import { Image, PixelRatio, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { shallowEqual } from 'react-redux';

import { useStore } from './store';


export default function Background() {
  const {
    audios, index,
  } = useStore((state) => ({
    audios: state.audios,
    index: state.index,
  }), shallowEqual);
  return (
    <>
      {audios.map((audio, i) => (
        <Image
          key={i}
          fadeDuration={0}
          progressiveRenderingEnabled
          blurRadius={50}
          source={audio.cover}
          style={[styles.container, i === index ? {} : { width: 0, height: 0 }]}
        />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
});
