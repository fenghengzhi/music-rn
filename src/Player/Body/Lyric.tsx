import {
  LayoutRectangle, StyleSheet, View, Text,
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
  add, and, not, debug, Transitioning, TransitioningView, Transition,
} from 'react-native-reanimated';
import { shallowEqual } from 'react-redux';
import Axios from 'axios';
import { Asset } from 'expo-asset';
import Duration from 'luxon/src/duration.js';
import { useIsPlaying, useStore } from '../store';

export default function Lyric() {
  const { audio, positionMillis } = useStore((state) => ({
    audio: state.audios[state.index],
    positionMillis: state.positionMillis,
  }), shallowEqual);
  const [lyric, setLyric] = useState('');
  const ref = useRef<TransitioningView>();

  const [lyricLayout, setLyricLayout] = useState<LayoutRectangle[]>([]);

  useEffect(() => {
    if (audio.lyric) {
      Axios.get(Asset.fromModule(audio.lyric).uri)
        .then((d) => {
          setLyric(d.data);
          setLyricLayout([]);
        });
    } else {
      setLyric('');
      setLyricLayout([]);
    }
  }, [audio]);
  const parsedLyric = useMemo(() => {
    let lines = lyric.split('\n');
    const RegExp = /^\[(\d{2}:\d{2}.\d{2})](.*)$/;
    lines = lines.filter((line) => RegExp.test(line));
    return lines.map((line) => {
      const [, time, lrc] = Array.from(line.match(RegExp));
      const [, minutes, seconds, milliseconds] = Array.from(time.match(/^(\d{2}):(\d{2}).(\d{2})$/));
      return {
        time: Duration.fromObject({ minutes: Number(minutes), seconds: Number(seconds), milliseconds: Number(milliseconds) * 10 }),
        lrc,
      };
    });
  }, [lyric]);
  const currentIndex = useMemo(() => {
    let i = 0;
    for (; i < parsedLyric.length; i++) {
      const item = parsedLyric[i];
      // console.log('compare', item.time.milliseconds, positionMillis);
      if (item.time.as('millisecond') > positionMillis) {
        break;
      }
    }
    return i - 1;
  }, [parsedLyric, positionMillis]);
  const [top, setTop] = useState(0);
  const [containerLayout, setContainerLayout] = useState<LayoutRectangle>({
    x: 0, y: 0, height: 0, width: 0,
  });
  useEffect(() => {
    ref.current.animateNextTransition();
    const currentLyricLayout = lyricLayout[currentIndex] ?? {
      x: 0, y: 0, height: 0, width: 0,
    };
    setTop(containerLayout.height / 2 - currentLyricLayout.y - currentLyricLayout.height / 2);
  }, [currentIndex, containerLayout, lyricLayout]);
  // console.log('currentIndex', positionMillis, currentIndex);
  return (
    <Transitioning.View ref={ref} style={styles.container} onLayout={(e) => setContainerLayout(e.nativeEvent.layout)} transition={<Transition.Change interpolation="linear" />}>
      <View style={[styles.content, { top }]}>
        {parsedLyric.map((item, index) => {
          const isCurrent = currentIndex === index;
          return (
            <Text
              style={[styles.lyric, { color: isCurrent ? '#fff' : '#888' }]}
              onLayout={(e) => {
                const layout = { ...e.nativeEvent.layout };
                setLyricLayout((prev) => {
                  const next = [...prev];
                  next[index] = layout;
                  return next;
                });
              }}
              key={index}
            >
              {item.lrc}
            </Text>
          );
        })}
      </View>
    </Transitioning.View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    // backgroundColor: 'red',
    overflow: 'hidden',
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  lyric: {
    paddingVertical: 12, fontSize: 18, textAlign: 'center',
  },
});
