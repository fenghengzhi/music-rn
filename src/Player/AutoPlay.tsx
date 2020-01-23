import {useEffect} from 'react';
import {PlayMode, useStore} from './store';
import {shallowEqual, useDispatch} from 'react-redux';
import {updateStore} from './store/action';
import _ from 'lodash';

export default function AutoPlay() {
  const {
    didJustFinish,
    index,
    audios,
    soundObject,
    playMode,
  } = useStore(state => ({
    didJustFinish: state.didJustFinish,
    index: state.index,
    audios: state.audios,
    soundObject: state.soundObject,
    playMode: state.playMode,
  }), shallowEqual);
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      if (didJustFinish) {
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
      }
    })();
  }, [didJustFinish]);
  return null;
}
