import React, {
  ReactNode, useEffect, useMemo, useState,
} from 'react';
import {
  Animated, StyleSheet, TouchableOpacity, View,
} from 'react-native';
import { RootSiblingPortal } from 'react-native-root-siblings';
import { Provider, useStore } from 'react-redux';
import useWindowSize from '../utils/useWindowSize';

export function SlideModal(props: {
  visible: boolean,
  heightPercent: number,
  children: ReactNode,
  onShow?: Function,
  setVisible?: Function
}) {
  const {
    visible, heightPercent, onShow, setVisible, children,
  } = props;
  const touchY = new Animated.Value(0);

  const [RNModalVisible, setRNModalVisible] = useState(false);
  const [toggleAnimatedValue] = useState(new Animated.Value(0));
  useEffect(() => {
    if (visible && !RNModalVisible) {
      setRNModalVisible(true);
    } else if (visible && RNModalVisible) {
      const animation = Animated.timing(toggleAnimatedValue, {
        toValue: 1,
        // duration: 10000,
        useNativeDriver: true,
      });
      animation.start(() => onShow && onShow());
      return () => animation.stop();
    } else if (!visible && RNModalVisible) {
      const animation = Animated.timing(toggleAnimatedValue, {
        toValue: 0,
        // duration: 10000,
        useNativeDriver: true,
      });
      animation.start((result) => result.finished && setRNModalVisible(false));
      return () => animation.stop();
    }
    return () => undefined;
  }, [visible, RNModalVisible]);
  const { height } = useWindowSize();
  const opacity = useMemo(() => toggleAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  }),
  [toggleAnimatedValue, height]);
  const translateY = useMemo(() => toggleAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [height * heightPercent * 0.01, 0],
  }),
  [toggleAnimatedValue, height]);
  const store = useStore();
  // console.log('scrollViewRef', scrollViewRef);
  return RNModalVisible && (
    <RootSiblingPortal>
      <View style={styles.modalWrapper}>
        <Animated.View
          style={[styles.background, { opacity }]}
        />
        <TouchableOpacity
          activeOpacity={0}
          onPress={() => setVisible && setVisible(false)}
          style={styles.fillContain}
        />
        <Animated.View style={[styles.container, {
          height: `${heightPercent}%`,
          transform: [{ translateY }, { translateY: touchY }],
        }]}
        >
          <Provider store={store}>{children}</Provider>
        </Animated.View>
      </View>
    </RootSiblingPortal>
  );
}

const styles = StyleSheet.create({
  modalWrapper: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  background: {
    backgroundColor: '#000',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  fillContain: {
    flex: 1,
  },
  container: {
    flex: 0,
  },
});

export function test() {
}
