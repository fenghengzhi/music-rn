import React, { useState } from 'react';
import { SlideModal } from '../../../SharedComponents/Modal';
import Icon from '../../../SharedComponents/Icon';
import PlayListModalContent from './PlayListModalContent';

export default function PlayList() {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <SlideModal setVisible={setVisible} visible={visible} heightPercent={75}>
        <PlayListModalContent setVisible={setVisible} />
      </SlideModal>
      <Icon
        onPress={() => setVisible(true)}
        name="playlist-music"
      />
    </>
  );
}
