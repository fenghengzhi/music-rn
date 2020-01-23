//经测试内部的PanGestureHandler不能useNativeDriver，只能考虑再不用内部PanGestureHandler情况下尝试实现需求
import {Animated, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  NativeViewGestureHandler,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  State,
} from 'react-native-gesture-handler';
import {shallowEqual} from 'react-redux';
import {useStore} from '../../store';

export default function PlayListModalContent({ setVisible }: { setVisible: Function }) {
  const { audios, index } = useStore((state) => ({
    audios: state.audios,
    index: state.index,
  }), shallowEqual);
  const nativeViewGestureHandlerRef = useRef();
  const [panY] = useState(new Animated.Value(0));
  const [panBeganY] = useState(new Animated.Value(0));
  const translationY = Animated.subtract(panY, panBeganY);
  const [flatListOffsetY] = useState(new Animated.Value(0));
  const [flatListTouching] = useState(new Animated.Value(0));
  const [lastOffsetY] = useState(new Animated.Value(0));
  const lastOffsetYRef = useRef(0);
  const [, forceRefresh] = useState({});
  useEffect(() => {
    forceRefresh({});
  }, []);
  return (
    <View style={styles.wrapper}>
      <PanGestureHandler
        simultaneousHandlers={nativeViewGestureHandlerRef}
        onHandlerStateChange={(event: PanGestureHandlerGestureEvent) => {
          switch (event.nativeEvent.state) {
            case State.BEGAN: {
              Animated.parallel([
                Animated.timing(panBeganY, {
                  duration: 0,
                  toValue: event.nativeEvent.y,
                  useNativeDriver: true,
                }),
                Animated.timing(panY, {
                  duration: 0,
                  toValue: event.nativeEvent.y,
                  useNativeDriver: true,
                }),
              ]).start();
            }
          }
        }}
        onGestureEvent={Animated.event(
          [{ nativeEvent: { y: panY } }],
          {
            useNativeDriver: true,
          },
        )}
      >
        <Animated.View
          style={[styles.container, {
            transform: [{
              translateY: translationY,
            }],
          }]}
        >
          <Text>
            <Text style={styles.name}>当前播放</Text>
            <Text style={styles.count}>(1)</Text>
          </Text>
          <ScrollView onScrollEndDrag={e => e.nativeEvent.contentOffset.y}/>
          <NativeViewGestureHandler
            shouldCancelWhenOutside={false}
            // simultaneousHandlers={innerPanRef}
            ref={nativeViewGestureHandlerRef}>
            <Animated.ScrollView
              onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: flatListOffsetY } } }], { useNativeDriver: true })}
              onScrollBeginDrag={event => {
                Animated.parallel([
                  Animated.timing(flatListTouching, {
                    toValue: 1,
                    duration: 0,
                    useNativeDriver: true,
                  }),
                  Animated.timing(lastOffsetY, {
                    toValue: event.nativeEvent.contentOffset.y,
                    duration: 0,
                    useNativeDriver: true,
                  }),
                ]).start();
                lastOffsetYRef.current = event.nativeEvent.contentOffset.y;
              }}
              onMomentumScrollBegin={() => {
                Animated.timing(flatListTouching, {
                  toValue: 0,
                  duration: 0,
                  useNativeDriver: true,
                }).start();
              }}
              onScrollEndDrag={event => {
                Animated.parallel([
                  Animated.timing(lastOffsetY, {
                    toValue: event.nativeEvent.contentOffset.y,
                    duration: 0,
                    useNativeDriver: true,
                  }),
                ]).start();
                lastOffsetYRef.current = event.nativeEvent.contentOffset.y;
              }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(item => <View key={item}
                                                             style={{
                                                               height: 100,
                                                               borderWidth: 1,
                                                             }}
              >
                <Text>{item}</Text>
              </View>)}
            </Animated.ScrollView>
          </NativeViewGestureHandler>
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
    backgroundColor: '#999',
    borderRadius: 24,
    padding: 18,
    paddingBottom: 0,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  name: { color: '#fff', fontSize: 18 },
  count: { color: '#bbb' },
  list: {
    flex: 1,
  },
});
