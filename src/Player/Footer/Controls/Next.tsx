import React from 'react';
import { useIsPlaying, useStore } from '../../store';
import Icon from '../../../SharedComponents/Icon';

export default function Next() {
  const isPlaying = useIsPlaying();
  const soundObject = useStore((state) => state.soundObject);

  return (
    <Icon
      onPress={async () => {
      }}
      name="skip-next"
    />
  );
}
