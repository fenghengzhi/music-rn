import React, {useEffect, useMemo, useRef, useState} from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {GestureResponderEvent, StyleSheet, Text, TouchableWithoutFeedback} from 'react-native';
import Animated, {
  add,
  block,
  cond,
  eq,
  event,
  greaterThan,
  min,
  set, startClock,
  stopClock,
  sub, Value,
} from 'react-native-reanimated';
import {PanGestureHandler, TapGestureHandler,State} from 'react-native-gesture-handler';

export default function Icon(
  {
    size = 24, name, onPress,
  }: { size?: number, name: string, onPress?: (event: GestureResponderEvent) => void },
) {
  const iconRef = useRef<any>();
  // const pressEvent = useMemo(() => event([
  //   {
  //     nativeEvent: ({ translationY, state, velocityY }) => block([
  //       set(offsetY, min(sub(prevOffsetY, translationY), maxOffset)),
  //       set(momentumV, sub(0, velocityY)),
  //       cond(eq(state, State.BEGAN), [
  //         stopClock(momentumClock),
  //       ]),
  //       cond(eq(state, State.ACTIVE),
  //         cond(greaterThan(sub(prevOffsetY, translationY), maxOffset),
  //           set(prevOffsetY, add(translationY, maxOffset)))), // 内容在滑动到底部后手指继续上滑一段距离，再下滑时可以直接滚动
  //       cond(eq(state, State.END), [
  //         set(prevOffsetY, min(sub(prevOffsetY, translationY), maxOffset)),
  //         startClock(momentumClock),
  //       ]),
  //     ]),
  //   },
  // ]), [offsetY, prevOffsetY]);
  const [shadowRadius] = useState(new Value(500));
  // useEffect(()=>{
  //   iconRef.current.setNativeProps({ style: { textShadowRadius: 0 } })
  // },[])
  return (
    <PanGestureHandler
      onHandlerStateChange={event([{
        nativeEvent: ({ state }) => block([
          cond(eq(state, State.BEGAN), set(shadowRadius,50)),
          cond(eq(state, State.END), set(shadowRadius,0)),
        ]),
      }])}
      // numberOfTaps={1}
      // onPress={e=>console.log(e)}
      // onPressIn={event([{nativeEvent:()=>set(shadowRadius,50)}])}
      // onPressOut={event([{nativeEvent:()=>set(shadowRadius,0)}])}
    >
      {/*<Text ref={iconRef} style={{ fontSize: size, color: '#fff', textShadowRadius: shadowRadius,textShadowColor:'#fff' }}>啊</Text>*/}
      <Animated.Text style={{ fontSize: size, color: '#fff', textShadowRadius: shadowRadius,textShadowColor:'#fff' }}>啊</Animated.Text>
    </PanGestureHandler>
  );
  // return (
  //   <TouchableWithoutFeedback
  //     onPress={onPress}
  //     onPressOut={() => iconRef.current.setNativeProps({ style: { textShadowRadius: 0 } })}
  //     onPressIn={() => iconRef.current.setNativeProps({ style: { textShadowRadius: 50 } })}
  //   >
  //     <MaterialIcon
  //       ref={iconRef}
  //       size={size}
  //       name={name}
  //       color="#fff"
  //       style={styles.iconShadowColor}
  //     />
  //   </TouchableWithoutFeedback>
  // );
}

const styles = StyleSheet.create({
  iconShadowColor: {
    textShadowColor: '#fff',
  },
  iconShadow: {
    textShadowRadius: 200,
  },
});
