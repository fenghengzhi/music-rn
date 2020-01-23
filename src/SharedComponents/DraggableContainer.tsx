import {Animated, StyleSheet, View} from 'react-native';
import React, {useMemo, useRef, useState} from 'react';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  State,
} from 'react-native-gesture-handler';

export default function DraggableContainer({ setVisible, children, borderRadius = 0, backgroundColor }: { backgroundColor: string, setVisible: Function, children: any[], borderRadius?: number }) {
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
    () => Animated.add(outerTranslationY.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolateLeft: 'clamp',
    }), overflowedNegativeOffsetY),
    [outerTranslationY, overflowedNegativeOffsetY],
  );


  return (
    <PanGestureHandler
      onGestureEvent={Animated.event([{ nativeEvent: { translationY: outerTranslationY } }], { useNativeDriver: true })}
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
    >
      <Animated.View
        style={[styles.container, {
          borderRadius,
          backgroundColor,
          transform: [{ translateY }],
        }]}
      >
        {children[0]}
        <View
          onLayout={(event) => setScrollableContainerHeight(event.nativeEvent.layout.height)}
          style={styles.scrollableContainer}
        >
          <PanGestureHandler
            enabled={scrollableContentHeight > scrollableContainerHeight}
            onHandlerStateChange={(event: PanGestureHandlerGestureEvent) => {
              // console.log('onHandlerStateChange', event.nativeEvent.state, event.nativeEvent.y);
              if (event.nativeEvent.state === State.END) {
                let nextOffsetY = lastOffsetYRef.current - event.nativeEvent.translationY;
                // console.log('lastOffsetYRef', lastOffsetYRef.current);
                // console.log('translationY', event.nativeEvent.translationY);
                // console.log('nextOffsetY', nextOffsetY);
                if (nextOffsetY < -100) {
                  setVisible(false);
                  return;
                }
                nextOffsetY = Math.min(nextOffsetY, maxScrollableOffset);
                if (nextOffsetY <= 0) {
                  //不需要惯性滚动
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
                      toValue: 0,
                      useNativeDriver: true,
                    }),
                  ]).start();
                  lastOffsetYRef.current = 0;
                } else {
                  //需要惯性滚动
                  Animated.parallel([
                    Animated.timing(lastOffsetY, {
                      toValue: nextOffsetY,
                      duration: 0,
                      useNativeDriver: true,
                    }),
                    Animated.timing(innerTranslationY, {
                      toValue: 0,
                      duration: 0,
                      useNativeDriver: true,
                    }),
                  ]).start();
                  lastOffsetYRef.current = nextOffsetY;
                }
              }
            }}
            onGestureEvent={Animated.event(
              [{ nativeEvent: { translationY: innerTranslationY } }],
              { useNativeDriver: true },
            )}
            shouldCancelWhenOutside={false}
          >
            <Animated.View
              onLayout={(event) => setScrollableContentHeight(event.nativeEvent.layout.height)}
              style={{ transform: [{ translateY: invertClampedOffsetY }] }}
            >{children.slice(1)}</Animated.View>
          </PanGestureHandler>
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  scrollableContainer: {
    flex: 1,
    overflow: 'hidden',
  },
});
