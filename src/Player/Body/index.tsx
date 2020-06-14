import {
  StyleSheet, TouchableOpacity, View, Animated,
} from 'react-native';
import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import {
  Transitioning, Transition, TransitioningView,
} from 'react-native-reanimated';
import Cover from './Cover';
import Lyric from './Lyric';


export default function Body() {
  const [showCover, setShowCover] = useState(true);
  const [coverOpacity] = useState(new Animated.Value(1));
  useEffect(() => {
    const animation = Animated.timing(coverOpacity, { toValue: showCover ? 1 : 0, useNativeDriver: true });
    animation.start();
    return () => {
      animation.stop();
    };
  }, [showCover]);
  const ref = useRef<TransitioningView>();
  const lyricOpacity = useMemo(() => Animated.subtract(new Animated.Value(1), coverOpacity), [coverOpacity]);
  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.container}
      onPress={() => {
        setShowCover((s) => !s);
      }}
    >
      <Animated.View style={[styles.content, {
        opacity: coverOpacity,
      }]}
      >
        <Cover />
      </Animated.View>
      <Animated.View style={[styles.content, {
        opacity: lyricOpacity,
      }]}
      >
        <Lyric />
      </Animated.View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});
