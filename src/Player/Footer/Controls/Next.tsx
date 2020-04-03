import React from 'react';
import _ from 'lodash';
import { shallowEqual, useDispatch } from 'react-redux';
import { PlayMode, useStore } from '../../store';
import Icon from '../../../SharedComponents/Icon';
import { updateStore } from '../../store/action';

export default function Next() {
  const {
    soundObject, index, audios, playMode,
  } = useStore((state) => ({
    soundObject: state.soundObject,
    index: state.index,
    audios: state.audios,
    playMode: state.playMode,
  }), shallowEqual);
  const dispatch = useDispatch();
  return (
    <Icon
      onPress={async () => {
        if (audios.length === 1) {
          soundObject.setPositionAsync(0);
          return;
        }
        switch (playMode) {
          case PlayMode.shuffle: {
            let nextIndex = _.random(0, audios.length - 1);
            while (nextIndex === index) {
              nextIndex = _.random(0, audios.length - 1);
            }
            const nextAudio = audios[nextIndex];
            await soundObject.unloadAsync();
            await soundObject.loadAsync(nextAudio.audio);
            soundObject.playAsync();
            dispatch(updateStore({ index: nextIndex }));
            break;
          }
          case PlayMode['loop-single']: {
            soundObject.setPositionAsync(0);
            break;
          }
          case PlayMode['loop-all']: {
            const nextIndex = (index + 1) % audios.length;
            const nextAudio = audios[nextIndex];
            await soundObject.unloadAsync();
            await soundObject.loadAsync(nextAudio.audio);
            soundObject.playAsync();
            dispatch(updateStore({ index: nextIndex }));
            break;
          }
        }
      }}
      name="skip-next"
    />
  );
}
