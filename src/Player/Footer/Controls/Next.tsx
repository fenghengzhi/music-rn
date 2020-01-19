import React from 'react';
import { Icon } from 'react-native-elements';
import { useIsPlaying, useStore } from '../../store';

export default function Next() {
  const isPlaying = useIsPlaying();
  const soundObject = useStore((state) => state.soundObject);

  return (
    <Icon
      underlayColor="#000"
      onPress={async () => {
      }}
      name="skip-next"
      type="material-community"
      color="#fff"
    />
  );
}
