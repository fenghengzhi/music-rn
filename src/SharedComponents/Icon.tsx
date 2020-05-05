import React, { memo, useEffect, useState } from 'react';
import { GestureResponderEvent, StyleSheet, View } from 'react-native';
import Animated, {
  block, cond, eq, event, set, Value,
} from 'react-native-reanimated';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import font from '@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf';
import glyphMap from '@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json';
import { shallowEqual } from 'react-redux';
import * as Font from 'expo-font';


interface Icon {
  name:keyof typeof glyphMap;
  size?:number;
  onPress?: (event: GestureResponderEvent) => void
}
const Icon = memo((
  {
    size = 24, name, onPress,
  }: Icon,
) => {
  const [shadowRadius] = useState(new Value(0));
  const [fontIsLoaded, setFontIsLoaded] = useState(false);
  useEffect(() => {
    Font.loadAsync({ 'material-community': font }).then(() => setFontIsLoaded(true));
  }, []);
  return (
    <PanGestureHandler
      onHandlerStateChange={event([{
        nativeEvent: ({ state }) => block([
          cond(eq(state, State.BEGAN), set(shadowRadius, 50)),
          cond(eq(state, State.END), set(shadowRadius, 0)),
        ]),
      }])}
    >
      {fontIsLoaded ? (
        <Animated.Text
          // onPress={()=>console.log('onpress')}
          onPress={onPress}
          style={[styles.icon, { fontSize: size, textShadowRadius: shadowRadius }]}
        >
          {String.fromCharCode(glyphMap[name])}
        </Animated.Text>
      ) : (<Animated.Text />) }
    </PanGestureHandler>
  );
}, shallowEqual);
const styles = StyleSheet.create({
  icon: {
    textShadowColor: '#fff',
    fontSize: 24,
    color: '#fff',
    fontFamily: 'material-community',
    margin: -12,
    padding: 12,
    // borderWidth: 1,
    // borderColor: '#fff',
  },
});
export default Icon;
