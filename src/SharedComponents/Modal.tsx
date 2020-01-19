import React, {ReactNode, useEffect, useMemo, useState} from 'react';
import {Animated, Modal, StyleSheet, TouchableOpacity} from 'react-native';
import useWindowSize from '../utils/useWindowSize';

export function SlideModal(props: { visible: boolean, heightPercent: number, children: ReactNode, onShow?: Function, onBackgroundPress?: Function }) {
  const { visible, heightPercent, onShow, onBackgroundPress } = props;
  const [RNModalVisible, setRNModalVisible] = useState(false);
  const [toggleAnimatedValue] = useState(new Animated.Value(0));
  useEffect(() => {
    if (visible && !RNModalVisible) {
      setRNModalVisible(true);
    } else if (visible && RNModalVisible) {
      const animation = Animated.timing(toggleAnimatedValue, {
        toValue: 1,
        // duration: 200,
        useNativeDriver: true,
      });
      animation.start(() => onShow && onShow());
      return () => animation.stop();
    } else if (!visible && RNModalVisible) {
      const animation = Animated.timing(toggleAnimatedValue, {
        toValue: 0,
        // duration: 200,
        useNativeDriver: true,
      });
      animation.start(result => result.finished && setRNModalVisible(false));
      return () => animation.stop();
    }
  }, [visible, RNModalVisible]);
  const { height } = useWindowSize();
  const opacity = useMemo(() => toggleAnimatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.5],
    })
    , [toggleAnimatedValue, height]);
  const translateY = useMemo(() => toggleAnimatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [height * heightPercent / 100, 0],
    })
    , [toggleAnimatedValue, height]);
  return (
    <Modal visible={RNModalVisible} transparent animated={false}>
      <Animated.View
        style={[styles.background, { opacity }]}/>
      <TouchableOpacity activeOpacity={0} onPress={() => onBackgroundPress && onBackgroundPress()}
                        style={styles.fillContain}/>
      <Animated.View style={[styles.container, {
        height: `${heightPercent}%`,
        transform: [{ translateY }],
      }]}>
        {props.children}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
