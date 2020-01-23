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
  const innerPanRef = useRef();
  const [outerPanGestureTranslationY] = useState(new Animated.Value(0));
  const [innerPanY] = useState(new Animated.Value(0));
  const [innerPanBeganY] = useState(new Animated.Value(0));
  const changedPanY = Animated.subtract(innerPanY, innerPanBeganY);
  const [innerPanGestureTranslationY] = useState(new Animated.Value(0));
  const [flatListOffsetY] = useState(new Animated.Value(0));
  const [flatListTouching] = useState(new Animated.Value(0));
  const [lastOffsetY] = useState(new Animated.Value(0));
  const lastOffsetYRef = useRef(0);
  const [, forceRefresh] = useState({});
  useEffect(() => {
    forceRefresh({});
  }, []);
  const flag1 = Animated.add(innerPanGestureTranslationY, flatListOffsetY).interpolate({
    inputRange: [-1, -Number.MIN_VALUE, 0, 1],
    outputRange: [0, 0, 1, 1],
    extrapolateLeft: 'clamp',
  });//判断是否是由滚动容器触发的下滑手势，1是0否，在手势触发过程中offsetY不作用于动画
  const invertFlag1 = Animated.subtract(0, flag1);//判断是否是由滚动容器触发的下滑手势，1是0否，在手势触发过程中offsetY不作用于动画
  return (
    <View style={styles.wrapper}>
      <PanGestureHandler
        simultaneousHandlers={[nativeViewGestureHandlerRef, innerPanRef]}
        onHandlerStateChange={(event: PanGestureHandlerGestureEvent) => {
          // if (event.nativeEvent.state === State.END) {
          //   if (event.nativeEvent.translationY >= 100) {
          //     setVisible(false);
          //     return;
          //   }
          //   Animated.timing(panGestureTranslationY, {
          //     toValue: 0,
          //     useNativeDriver: true,
          //   }).start();
          // }
        }}
        onGestureEvent={Animated.event(
          [{ nativeEvent: { translationY: outerPanGestureTranslationY } }],
          {
            useNativeDriver: true,
          },
        )}
      >
        <Animated.View
          style={[styles.container, {
            transform: [{
              translateY: Animated.add(Animated.add(innerPanGestureTranslationY, Animated.multiply(flatListOffsetY, invertFlag1)), Animated.divide(changedPanY, 0.5)).interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
                extrapolateLeft: 'clamp',
              }),
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
            >
              <PanGestureHandler
                simultaneousHandlers={nativeViewGestureHandlerRef}
                ref={innerPanRef}
                onHandlerStateChange={event => {
                  if(event.nativeEvent.state===State.BEGAN){
                    innerPanBeganY.setValue(event.nativeEvent.y)
                  }
                }}
                onGestureEvent={Animated.event(
                  [{ nativeEvent: { translationY: innerPanGestureTranslationY, y: innerPanY } }],
                  {
                    useNativeDriver: true,
                  },
                )}
              >
                <Animated.View>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(item => <View key={item}
                                                                 style={{
                                                                   height: 100,
                                                                   borderWidth: 1,
                                                                 }}
                  >
                    <Text>{item}</Text>
                  </View>)}
                </Animated.View>
              </PanGestureHandler>
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
