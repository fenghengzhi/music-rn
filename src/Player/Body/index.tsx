import {
  LayoutRectangle, StyleSheet, View,
} from 'react-native';
import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import Animated, {
  block, Clock,
  clockRunning,
  cond,
  decay,
  greaterThan,
  lessThan, max, min,
  set,
  stopClock,
  sub, timing,
  Value,
  Easing, startClock, concat,
  add, and, not, debug,
} from 'react-native-reanimated';
import { useIsPlaying, useStore } from '../store';


export default function Body() {
  const [layout, setLayout] = useState<LayoutRectangle>({
    x: 0, y: 0, width: 0, height: 0,
  });
  const imageSize = useMemo(() => Math.min(layout.height, layout.width) - 192, [layout]);
  const audio = useStore((state) => state.audios[state.index]);

  const isPlaying = useIsPlaying();
  // const [prevDeg] = useState(new Value(0))
  //   const rotating = useMemo(()=>new Value(isPlaying?1:0),[isPlaying]);
  const [rotating] = useState(new Value<1 | 0>(0));
  const [prevRotateZ] = useState(new Value(0));
  const [rotateClock] = useState(new Clock());
  const rotateZ = useMemo(() => {
    const state = {
      finished: new Value(0),
      time: new Value(0),
      position: new Value(0),
      frameTime: new Value(0),
    };
    return block([
      // cond(eq(contentEventState, State.END), ,
      cond(
        clockRunning(rotateClock),
        cond(not(rotating), [
          stopClock(rotateClock),
          set(prevRotateZ, state.position),
        ]),
        [
          set(state.position, prevRotateZ),
          set(state.frameTime, 0),
          set(state.finished, 0),
          set(state.time, 0),
          cond(rotating, startClock(rotateClock)),
        ],
      ),
      timing(rotateClock, state, { toValue: add(prevRotateZ, 36000), duration: 1000000, easing: Easing.linear }),
      cond(state.finished, [
        set(state.position, prevRotateZ),
        set(state.frameTime, 0),
        set(state.finished, 0),
        set(state.time, 0),
      ]),
      // debug('time', state.time),
      // debug('clock', clockRunning(rotateClock)),
      // debug('rotating', rotating),
      // state.position,
      concat(state.position, 'deg'),
    ]);
  }, [prevRotateZ, rotating, rotateClock]);

  useEffect(() => {
    if (isPlaying) {
      rotating.setValue(1);
    } else {
      rotating.setValue(0);
    }
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
