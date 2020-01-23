import {StyleSheet, Text, TouchableNativeFeedback, View} from 'react-native';
import React from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {shallowEqual, useDispatch} from 'react-redux';
import {PlayMode, useStore} from '../../store';
import DraggableContainer from '../../../SharedComponents/DraggableContainer';
import {updateStore} from '../../store/action';

export default function PlayListModalContent({ setVisible }: { setVisible: Function }) {
  const { audios, index, soundObject } = useStore((state) => ({
    audios: state.audios,
    index: state.index,
    soundObject: state.soundObject,
  }), shallowEqual);
  const dispatch = useDispatch();
  return (
    <View style={styles.wrapper}>
      <DraggableContainer borderRadius={24} setVisible={setVisible} backgroundColor="#666">
        <View style={styles.header}>
          <Text>
            <Text style={styles.name}>当前播放</Text>
            <Text style={styles.count}>({audios.length})</Text>
          </Text>
          <PlayModeBtn/>
        </View>
        {audios.map((audio, i) => {
          const current = i === index;
          return (
            <TouchableNativeFeedback
              background={TouchableNativeFeedback.Ripple('#000')}
              onPress={async () => {
                if (!current) {
                  const nextIndex = (index + 1) % audios.length;
                  const nextAudio = audios[nextIndex];
                  await soundObject.unloadAsync();
                  await soundObject.loadAsync(nextAudio.audio);
                  soundObject.playAsync();
                  dispatch(updateStore({ index: i }));
                }
              }}>
              <View style={styles.itemContainer}>
                {i === index && <MaterialIcon name="bell" color={current ? '#ccc' : '#fff'}/>}
                <Text style={current ? styles.playingName : styles.white}
                      numberOfLines={1}>{audio.name}</Text>
              </View>
            </TouchableNativeFeedback>
          );
        })}
      </DraggableContainer>
    </View>
  );
}
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 24,
  },
  header: {
    flex: 0,
    backgroundColor: '#666',
    padding: 18,
    // paddingBottom: 0,
  },
  name: { color: '#fff', fontSize: 18 },
  count: { color: '#ccc' },
  white: {
    color: '#fff',
  },
  playingName: {
    color: '#ccc',
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
        background={TouchableNativeFeedback.Ripple('#000')}
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
        }}>
          <MaterialIcon
            // ref={iconRef}

            size={18}

            name={playMode}
            color="#ccc"
          />
          <View style={{ width: 6 }}/>
          <Text style={{ color: '#fff' }}>{text[playMode]}</Text>
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
