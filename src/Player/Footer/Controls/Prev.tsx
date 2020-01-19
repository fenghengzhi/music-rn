import React from 'react';
import { Icon } from 'react-native-elements';
import { LoadedPlaybackStatus, useIsPlaying, useStore } from '../../store';

export default function Prev() {
  const isPlaying = useIsPlaying();
  const soundObject = useStore((state) => state.soundObject);

  return (
    <Icon
      underlayColor="#000"
      onPress={async () => {
      }}
      name="skip-previous"
      type="material-community"
      color="#fff"
    />
  );
}
