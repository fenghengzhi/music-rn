import React from 'react';
import Toast from 'react-native-root-toast';
import { useDispatch } from 'react-redux';
import Icon from '../../../SharedComponents/Icon';
import { PlayMode, useStore } from '../../store';
import { updateStore } from '../../store/action';

export default function PlayModeBtn() {
  const playMode = useStore((state) => state.playMode);
  const dispatch = useDispatch();
  return (
    <Icon
      name={playMode}
      onPress={() => {
        const PlayModeValues = Object.values(PlayMode);
        const currentPlayModeValueIndex = PlayModeValues.indexOf(playMode);
        const nextPlayModeValueIndex = (currentPlayModeValueIndex + 1) % PlayModeValues.length;
        const nextPlayModeValue = PlayModeValues[nextPlayModeValueIndex];
        // console.warn(PlayModeValues.indexOf(playMode))
        const toastText = {
          [PlayMode.shuffle]: '随机播放',
          [PlayMode['loop-all']]: '列表循环',
          [PlayMode['loop-single']]: '单曲循环',
        };
        Toast.show(toastText[nextPlayModeValue]);
        dispatch(updateStore({ playMode: nextPlayModeValue }));
      }}
    />
  );
}
