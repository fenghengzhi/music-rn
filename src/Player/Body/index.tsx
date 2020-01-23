import {Animated, Easing, LayoutRectangle, StyleSheet, View} from 'react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useIsPlaying, useStore} from '../store';

export default function Body() {
  const [layout, setLayout] = useState<LayoutRectangle>({
    x: 0, y: 0, width: 0, height: 0,
  });
  const imageSize = useMemo(() => Math.min(layout.height, layout.width) - 192, [layout]);
  const audio = useStore((state) => state.audios[state.index]);

  const isPlaying = useIsPlaying();
  const [animatedValue] = useState(new Animated.Value(0));
  const animatedCurrentValueRef = useRef(0);
  const rotateZ = useMemo(() => animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    }),
    [animatedValue]);
  useEffect(() => {
    animatedValue.addListener((state) => animatedCurrentValueRef.current = state.value);
  }, []);
  useEffect(() => {
    if (isPlaying) {
      const animation = Animated.loop(Animated.timing(animatedValue, {
        toValue: animatedCurrentValueRef.current + 1,
        useNativeDriver: true,
        duration: 10000,
        easing: Easing.inOut(Easing.linear),
      }));
      animation.start();
      return () => animation.stop();
    }
    return undefined;
  }, [isPlaying]);

  return (
    <View style={styles.container} onLayout={(event) => setLayout(event.nativeEvent.layout)}>
      <Animated.Image
        style={[
          styles.cover,
          {
            width: imageSize,
            height: imageSize,
            borderRadius: imageSize,
            transform: [{ rotateZ }],
          }]}
        source={audio.cover}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'red',
  },
  cover: {
    width: 100,
    height: 100,
    borderRadius: 50,
    flex: 0,
  },
});
