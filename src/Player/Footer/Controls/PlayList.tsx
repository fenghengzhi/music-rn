import React, { useRef } from 'react';
import Icon from '../../../SharedComponents/Icon';
import PlayListModal from './PlayListModal';

export default function PlayList() {
  const playListModal = useRef<PlayListModal>();
  return (
    <>
      <PlayListModal ref={playListModal} />
      <Icon
        onPress={() => playListModal.current.open()}
        name="playlist-music"
      />
    </>
  );
}
