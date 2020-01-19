import React, {useState} from 'react';
import {Button, Icon} from 'react-native-elements';
import {View} from 'react-native';
import {useIsPlaying, useStore} from '../../store';
import {SlideModal} from '../../../SharedComponents/Modal';

export default function PlayList() {
  const isPlaying = useIsPlaying();
  const soundObject = useStore((state) => state.soundObject);
  const [visible, setVisible] = useState(false);
  return (
    <>
      <SlideModal onBackgroundPress={() => setVisible(false)} visible={visible} heightPercent={75}>
        <View style={{ flex: 1, backgroundColor: 'red' }}>
          <Button onPress={() => setVisible(false)}>close</Button>
        </View>
      </SlideModal>
      <Icon
        underlayColor="#000"
        onPress={() => {
          setVisible(true);
        }}
        name="playlist-music"
        type="material-community"
        color="#fff"
      />
    </>
  );
}
