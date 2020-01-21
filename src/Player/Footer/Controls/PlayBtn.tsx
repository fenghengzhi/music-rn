import React from 'react';
import Icon from '../../../SharedComponents/Icon';
import { LoadedPlaybackStatus, useIsPlaying, useStore } from '../../store';

export default function PlayBtn() {
  const isPlaying = useIsPlaying();
  const soundObject = useStore((state) => state.soundObject);

  return (
    <Icon
      onPress={async () => {
        if (isPlaying) {
          soundObject.pauseAsync();
          // soundObject.setVolumeAsync(1)
        } else {
          const playbackStatus = (await soundObject.playAsync()) as LoadedPlaybackStatus;
          const { durationMillis, positionMillis } = playbackStatus;
          if (durationMillis === positionMillis) {
            soundObject.setStatusAsync({ positionMillis: 0 });
          }
        }
      }}
      size={48}
      name={isPlaying ? 'pause-circle-outline' : 'play-circle-outline'}
    />
  );
}
