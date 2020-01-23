import {StyleSheet, View} from 'react-native';
import React from 'react';
import {useStore} from '../../store';
import Icon from '../../../SharedComponents/Icon';
import Fav from './Fav';

export default function Functions() {
  const index = useStore((state) => state.index);
  // console.warn('didJustFinish', didJustFinish);
  // console.warn('isPlaying,isBuffering', isPlaying, isBuffering);
  return (
    <View style={styles.container}>
      <Fav key={index}/>
      <Icon name="cloud-download-outline"/>
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
