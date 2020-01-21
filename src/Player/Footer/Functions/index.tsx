import { StyleSheet, View } from 'react-native';
import React from 'react';
import { useIsPlaying, useStore } from '../../store';
import Icon from '../../../SharedComponents/Icon';

export default function Functions() {
  const isPlaying = useIsPlaying();
  const soundObject = useStore((state) => state.soundObject);
  // console.warn('didJustFinish', didJustFinish);
  // console.warn('isPlaying,isBuffering', isPlaying, isBuffering);
  return (
    <View style={styles.container}>
      <Icon name="heart-outline" />
      <Icon name="cloud-download-outline" />
      <Icon name="bell-ring-outline" />
      <Icon name="message-text-outline" />
      <Icon name="dots-vertical-circle-outline" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 24,
    alignItems: 'center',
  },
});
