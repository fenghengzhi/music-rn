import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Icon } from 'react-native-elements';
import { useIsPlaying, useStore } from '../store';

export default function Functions() {
  const isPlaying = useIsPlaying();
  const soundObject = useStore((state) => state.soundObject);
  // console.warn('didJustFinish', didJustFinish);
  // console.warn('isPlaying,isBuffering', isPlaying, isBuffering);
  return (
    <View style={styles.container}>
      <Icon name="heart-outline" type="material-community" color="#fff" />
      <Icon name="cloud-download-outline" type="material-community" color="#fff" />
      <Icon name="bell-ring-outline" type="material-community" color="#fff" />
      <Icon name="message-text-outline" type="material-community" color="#fff" />
      <Icon name="dots-vertical-circle-outline" type="material-community" color="#fff" />
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
