import { StyleSheet, View } from 'react-native';
import React from 'react';
import Toast from 'react-native-root-toast';
import { useStore } from '../../store';
import Icon from '../../../SharedComponents/Icon';
import Fav from './Fav';

export default function Functions() {
  const index = useStore((state) => state.index);
  // console.warn('didJustFinish', didJustFinish);
  // console.warn('isPlaying,isBuffering', isPlaying, isBuffering);
  return (
    <View style={styles.container}>
      <Fav key={index} />
      <Icon onPress={() => Toast.show('下载功能，演示版无此功能', { containerStyle: { backgroundColor: '#ccc' }, textColor: '#000' })} name="cloud-download-outline" />
      <Icon onPress={() => Toast.show('设为铃声，演示版无此功能', { containerStyle: { backgroundColor: '#ccc' }, textColor: '#000' })} name="bell-ring-outline" />
      <Icon onPress={() => Toast.show('查看评论，演示版无此功能', { containerStyle: { backgroundColor: '#ccc' }, textColor: '#000' })} name="message-text-outline" />
      <Icon onPress={() => Toast.show('查看歌曲详情，演示版无此功能', { containerStyle: { backgroundColor: '#ccc' }, textColor: '#000' })} name="dots-vertical-circle-outline" />
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
