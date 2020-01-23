import {Slider, StyleSheet, Text, View} from 'react-native';
import React, {useMemo, useState} from 'react';
import {shallowEqual} from 'react-redux';
import Duration from 'luxon/src/duration.js';
// import Slider from '@react-native-community/slider';
import {useStore} from '../store';

export default function Progress() {
  const { durationMillis, positionMillis, soundObject } = useStore((state) => ({
    soundObject: state.soundObject,
    positionMillis: state.positionMillis,
    durationMillis: state.durationMillis,
  }), shallowEqual);
  const [searchPosition, setSearchPostion] = useState(-1);
  const positionText = useMemo(() => Duration.fromMillis(positionMillis).toFormat('mm:ss'), [positionMillis]);
  const searchPositionText = useMemo(() => Duration.fromMillis(searchPosition).toFormat('mm:ss'), [searchPosition]);
  const durationText = useMemo(() => Duration.fromMillis(durationMillis).toFormat('mm:ss'), [durationMillis]);
  return (
    <View style={styles.container}>
      <Text style={styles.time}>{searchPosition > 0 ? searchPositionText : positionText}</Text>
      <Slider
        minimumValue={0}
        maximumValue={durationMillis}
        value={searchPosition >= 0 ? searchPosition : positionMillis}
        onValueChange={value => setSearchPostion(value)}
        onSlidingComplete={async (value) => {
          await soundObject.setPositionAsync(value);
          setSearchPostion(-1);
        }}
        minimumTrackTintColor="#fff"
        maximumTrackTintColor="#999"
        thumbTintColor="#fff"
        style={styles.progressBar}
      />
      <Text style={styles.time}>{durationText}</Text>
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
