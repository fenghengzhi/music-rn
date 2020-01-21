import {
  Animated, StyleSheet, Text, View,
} from 'react-native';
import React, { useMemo, useRef, useState } from 'react';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  State,
} from 'react-native-gesture-handler';
import { shallowEqual } from 'react-redux';
import { useStore } from '../../store';

export default function PlayListModalContent({ setVisible }: { setVisible: Function }) {
  const { audios, index } = useStore((state) => ({
    audios: state.audios,
    index: state.index,
  }), shallowEqual);
  // const nativeViewGestureHandlerRef = useRef();
  const [outerTranslationY] = useState(new Animated.Value(0));
  const [innerTranslationY] = useState(new Animated.Value(0));

  const [lastOffsetY] = useState(new Animated.Value(0));
  const lastOffsetYRef = useRef(0);
  const [scrollableContentHeight, setScrollableContentHeight] = useState(0);
  const [scrollableContainerHeight, setScrollableContainerHeight] = useState(0);
  // Animated.subtract(Animated.add(outerTranslationY, offsetY), lastOffsetY);
  const maxScrollableOffset = useMemo(
    () => Math.max(scrollableContentHeight - scrollableContainerHeight, 0),
    [scrollableContentHeight, scrollableContainerHeight],
  );

  const offsetY = useMemo(
    () => Animated.subtract(lastOffsetY, innerTranslationY),
    [lastOffsetY, innerTranslationY],
  );
  const clampedOffsetY = useMemo(() => offsetY.interpolate({
    inputRange: [0, maxScrollableOffset],
    outputRange: [0, maxScrollableOffset],
    extrapolate: 'clamp',
  }), [offsetY, maxScrollableOffset]);
  const invertClampedOffsetY = useMemo(
    () => Animated.subtract(0, clampedOffsetY),
    [clampedOffsetY],
  );
  const overflowedNegativeOffsetY = useMemo(() => Animated.subtract(0, offsetY).interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolateLeft: 'clamp',
  }), [offsetY]);
  const translateY = useMemo(
    () => Animated.add(outerTranslationY, overflowedNegativeOffsetY),
    [outerTranslationY, overflowedNegativeOffsetY],
  );
  return (
    <View style={styles.wrapper}>
      <PanGestureHandler
        onHandlerStateChange={(event: PanGestureHandlerGestureEvent) => {
          if (event.nativeEvent.state === State.END) {
            if (event.nativeEvent.translationY >= 100) {
              setVisible(false);
              return;
            }
            Animated.timing(outerTranslationY, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
          }
        }}
        onGestureEvent={Animated.event(
          [{ nativeEvent: { translationY: outerTranslationY } }],
          { useNativeDriver: true },
        )}
      >
        <Animated.View
          style={[styles.container, { transform: [{ translateY }] }]}
        >
          <Text>
            <Text style={styles.title}>当前播放</Text>
            <Text style={styles.count}>(1)</Text>
          </Text>
          <PanGestureHandler
            onHandlerStateChange={(event: PanGestureHandlerGestureEvent) => {
              if (event.nativeEvent.state === State.END) {
                let nextOffsetY = lastOffsetYRef.current - event.nativeEvent.translationY;
                if (nextOffsetY < -100) {
                  setVisible(false);
                  return;
                }
                nextOffsetY = Math.max(nextOffsetY, 0);

                nextOffsetY = Math.min(nextOffsetY, maxScrollableOffset);
                Animated.sequence([
                  Animated.parallel([
                    Animated.timing(lastOffsetY, {
                      toValue: lastOffsetYRef.current - event.nativeEvent.translationY,
                      duration: 0,
                      useNativeDriver: true,
                    }),
                    Animated.timing(innerTranslationY, {
                      toValue: 0,
                      duration: 0,
                      useNativeDriver: true,
                    }),
                  ]),
                  Animated.timing(lastOffsetY, {
                    toValue: nextOffsetY,
                    useNativeDriver: true,
                  }),
                ]).start();
                lastOffsetYRef.current = nextOffsetY;
              }
            }}
            onGestureEvent={Animated.event(
              [{ nativeEvent: { translationY: innerTranslationY } }],
              { useNativeDriver: true },
            )}
            shouldCancelWhenOutside={false}
            // ref={nativeViewGestureHandlerRef}
          >
            <Animated.View
              onLayout={(event) => setScrollableContainerHeight(event.nativeEvent.layout.height)}
              style={{
                flex: 1,
                overflow: 'hidden',
              }}
            >
              <Animated.View
                onLayout={(event) => setScrollableContentHeight(event.nativeEvent.layout.height)}
                style={{ transform: [{ translateY: invertClampedOffsetY }] }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
                  <View
                    key={item}
                    style={{ height: 100, borderWidth: 1 }}
                  >
                    <Text>{item}</Text>
                  </View>
                ))}
              </Animated.View>
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 24,
  },
  container: {
    flex: 1,
    backgroundColor: '#888',
    borderRadius: 24,
    padding: 18,
    paddingBottom: 0,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  title: { color: '#fff', fontSize: 18 },
  count: { color: '#bbb' },
  list: {
    flex: 1,
  },
});
