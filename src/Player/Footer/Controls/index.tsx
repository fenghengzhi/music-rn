import { StyleSheet, View } from 'react-native';
import React from 'react';
import PlayModeBtn from './PlayModeBtn';
import PlayBtn from './PlayBtn';
import Prev from './Prev';
import Next from './Next';
import PlayList from './PlayList';

export default function Index() {
  return (
    <View style={styles.container}>
      <PlayModeBtn />
      <Prev />
      <PlayBtn />
      <Next />
      <PlayList />
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
