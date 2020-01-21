import {
  Animated,
  Easing,
  LayoutRectangle,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../store';

export default function Header() {
  const audio = useStore((state) => state.audios[state.index]);

  interface State {
    text: string,
    lineStatus: 'unknown' | 'single' | 'multi'
  }

  const [{ text, lineStatus }, setState] = useState<State>({
    text: '',
    lineStatus: 'unknown',
  });
  return (
    <View style={styles.container}>
      <ScrollView style={{ height: 0 }} scrollEnabled={false}>
        <Text
          // @ts-ignore
          onTextLayout={(event) => {
            const nextText = _(event.nativeEvent.lines).map('text').join('');
            const nextLineStatus = (() => {
              if (event.nativeEvent.lines.length > 1) {
                return 'multi';
              }
              return 'single';
            })();
            setState({ text: nextText, lineStatus: nextLineStatus });
          }}
          style={styles.title}
        >
          {audio.title}
        </Text>
      </ScrollView>
      {lineStatus === 'single' && <Text ellipsizeMode="clip" style={styles.title}>{text}</Text>}
      {lineStatus === 'multi' && <MultiLineTitle text={text} />}
      <Text style={{ color: '#888' }}>{audio.artist}</Text>
    </View>
  );
}

function MultiLineTitle({ text }: { text: string }) {
  const [animatedValue] = useState(new Animated.Value(0));
  const [layout, setLayout] = useState<LayoutRectangle>({
    x: 0, y: 0, width: 0, height: 0,
  });
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, { toValue: 0, duration: 0, useNativeDriver: true }),
        Animated.timing(animatedValue, {
          toValue: -layout.width,
          useNativeDriver: true,
          delay: 1000,
          duration: layout.width * 48,
          easing: Easing.inOut(Easing.linear),
        }),
      ]),
    );
    animation.start();
    // console.warn('start');
    return () => animation.stop();
  }, [layout.width]);
  const leftOpacity = useMemo(() => animatedValue.interpolate({
    inputRange: [
      Math.min(-layout.width, -24),
      Math.min(-layout.width + 24, -24),
      Math.min(-layout.width + 24, -24),
      -24,
      0,
    ],
    outputRange: [0, 0, 1, 1, 0],
  }), [animatedValue, layout.width]);
  return (
    <View>
      <ScrollView horizontal scrollEnabled={false}>
        <Animated.View
          style={[styles.longTitleContainer, { transform: [{ translateX: animatedValue }] }]}
        >
          <Text
            onLayout={(event) => setLayout(event.nativeEvent.layout)}
            numberOfLines={1}
            ellipsizeMode="clip"
            style={[styles.title, { paddingRight: 24 }]}
          >
            {text}
          </Text>
          <Text
            numberOfLines={1}
            ellipsizeMode="clip"
            style={styles.title}
          >
            {text}
          </Text>
        </Animated.View>
      </ScrollView>
      <Animated.View style={[styles.leftLinearGradientWrapper, { opacity: leftOpacity }]}>
        <LinearGradient
          style={styles.leftLinearGradient}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,1)']}
        />
      </Animated.View>
      <LinearGradient
        style={styles.rightLinearGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,1)']}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
    paddingHorizontal: 24,
  },
  title: {
    color: '#fff',
    // textAlign: 'justify',
  },
  longTitleContainer: {
    flexDirection: 'row',
  },
  rightLinearGradient: {
    position: 'absolute', right: 0, top: 0, bottom: 0, height: '100%', width: 24,
  },
  leftLinearGradient: {
    height: '100%', width: 24,
  },
  leftLinearGradientWrapper: {
    position: 'absolute', left: 0, top: 0, bottom: 0, height: '100%',
  },
});
