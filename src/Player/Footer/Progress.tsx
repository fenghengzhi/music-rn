import {
  Slider, StyleSheet, Text, View,
} from 'react-native';
import React from 'react';
import { shallowEqual } from 'react-redux';
// import Slider from '@react-native-community/slider';
import { useStore } from '../store';

export default function Progress() {
  const { durationMillis, positionMillis, soundObject } = useStore((state) => ({
    soundObject: state.soundObject,
    positionMillis: state.positionMillis,
    durationMillis: state.durationMillis,
  }), shallowEqual);

  function format(millis) {
    const minute = Math.floor(millis / 1000 / 60);
    const second = Math.round((millis - minute * 1000 * 60) / 1000);
    return `${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
  }

  // console.warn('didJustFinish', didJustFinish)
  return (
    <View style={styles.container}>
      <Text style={styles.time}>{format(positionMillis)}</Text>
      <Slider
        minimumValue={0}
        maximumValue={durationMillis}
        value={positionMillis}
        onSlidingComplete={(value) => soundObject.setPositionAsync(value)}
        minimumTrackTintColor="#fff"
        maximumTrackTintColor="#888"
        thumbTintColor="#fff"
        style={styles.progressBar}
      />
      <Text style={styles.time}>{format(durationMillis)}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  time: {
    color: '#fff',
  },
  progressBar: {
    flex: 1,
    color: 'red',

  },
});
