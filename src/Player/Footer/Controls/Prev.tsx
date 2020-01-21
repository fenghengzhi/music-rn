import React from 'react';
import Icon from '../../../SharedComponents/Icon';
import { LoadedPlaybackStatus, useIsPlaying, useStore } from '../../store';

export default function Prev() {
  const isPlaying = useIsPlaying();
  const soundObject = useStore((state) => state.soundObject);

  return (
    <Icon
      onPress={async () => {
      }}
      name="skip-previous"
    />
  );
}
