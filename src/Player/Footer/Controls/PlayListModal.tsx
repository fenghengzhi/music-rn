import React, {
  forwardRef, ReactNode, useImperativeHandle, useRef,
} from 'react';
import {
  View, Text, TouchableNativeFeedback, StyleSheet,
} from 'react-native';
import { shallowEqual, useDispatch } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DraggableModal from '../../../SharedComponents/DraggableModal';
import { PlayMode, useStore } from '../../store';
import { updateStore } from '../../store/action';

interface PlayListModal {
  close: () => void,
  open: () => void
}

const PlayListModal = forwardRef<PlayListModal>(({ children }:
                                                   { children: ReactNode }, ref) => {
  const { audios, index, soundObject } = useStore((state) => ({
    audios: state.audios,
    index: state.index,
    soundObject: state.soundObject,
  }), shallowEqual);
  const dispatch = useDispatch();
  const draggableModal = useRef<DraggableModal>();
  useImperativeHandle(ref, () => ({
    open: draggableModal.current && draggableModal.current.open,
    close: draggableModal.current && draggableModal.current.close,
  }));
  return (
    <DraggableModal ref={draggableModal}>
      <View style={styles.header}>
        <Text>
          <Text style={styles.name}>当前播放</Text>
          <Text style={styles.count}>
            （
            {audios.length}
            )
          </Text>
        </Text>
        <PlayModeBtn />
      </View>
      {audios.map((audio, i) => {
        const current = i === index;
        return (
          <TouchableNativeFeedback
            key={i}
            background={TouchableNativeFeedback.Ripple('#999')}
            onPress={async () => {
              if (!current) {
                const nextIndex = (index + 1) % audios.length;
                const nextAudio = audios[nextIndex];
                await soundObject.unloadAsync();
                await soundObject.loadAsync(nextAudio.audio);
                soundObject.playAsync();
                dispatch(updateStore({ index: i }));
              }
            }}
          >
            <View style={styles.itemContainer}>
              {i === index && <MaterialCommunityIcons style={{ marginRight: 6 }} size={18} name="volume-high" color={current ? 'red' : '#000'} />}
              <Text
                style={current ? styles.playingName : styles.white}
                numberOfLines={1}
              >
                {audio.name}
                <Text style={{ color: '#999', fontSize: 12 }}>
                  {' - '}
                  {audio.artist}
                </Text>
              </Text>
            </View>
          </TouchableNativeFeedback>
        );
      })}
    </DraggableModal>
  );
});
export default PlayListModal;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 24,
  },
  header: {
    flex: 0,
    backgroundColor: '#fff',
    padding: 18,
    // paddingBottom: 0,
  },
  name: { color: '#000', fontSize: 18 },
  count: { color: '#999' },
  white: {
    color: '#000',
  },
  playingName: {
    color: 'red',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
});

function PlayModeBtn() {
  const playMode = useStore((state) => state.playMode);
  const dispatch = useDispatch();
  const text = {
    [PlayMode.shuffle]: '随机播放',
    [PlayMode['loop-all']]: '列表循环',
    [PlayMode['loop-single']]: '单曲循环',
  };

  return (
    <View style={{ flexDirection: 'row' }}>
      <TouchableNativeFeedback
        background={TouchableNativeFeedback.Ripple('#999')}
        onPress={() => {
          const PlayModeValues = Object.values(PlayMode);
          const currentPlayModeValueIndex = PlayModeValues.indexOf(playMode);
          const nextPlayModeValueIndex = (currentPlayModeValueIndex + 1) % PlayModeValues.length;
          const nextPlayModeValue = PlayModeValues[nextPlayModeValueIndex];
          // console.warn(PlayModeValues.indexOf(playMode))
          dispatch(updateStore({ playMode: nextPlayModeValue }));
        }}
      >
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 12,
          paddingHorizontal: 18,
          marginLeft: -18,
          marginBottom: -12,
        }}
        >
          <MaterialCommunityIcons
            size={18}
            name={playMode}
            color="#999"
          />
          <View style={{ width: 6 }} />
          <Text style={{ color: '#000' }}>{text[playMode]}</Text>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
  // return (
  //   <Icon
  //     name={playMode}
  //   />
  // );
}
