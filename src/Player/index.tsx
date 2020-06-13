import React, { useEffect } from 'react';
import { Provider, shallowEqual, useDispatch } from 'react-redux';
import {
  StyleSheet, View, Image, StatusBar,
} from 'react-native';
import { setSiblingWrapper } from 'react-native-root-siblings';
import { BlurView } from 'expo-blur';
import Footer from './Footer';
import Body from './Body';
import Header from './Header';
import useCreateStore, { useStore } from './store';
import { updateStore } from './store/action';
import AutoPlay from './AutoPlay';
import { BackgroundTest as Background } from './Background';
// import { JimpBackground as Background } from './Background';
// import { ThreeBackground1 as Background } from './Background';

export default function Player() {
  const store = useCreateStore();
  useEffect(() => {
    setSiblingWrapper((sibling) => <Provider store={store}>{sibling}</Provider>);
  }, [store]);
  return (
    <Provider store={store}>
      <StatusBar translucent backgroundColor="transparent" />
      {React.createElement(() => {
        const { isLoaded, soundObject, audios } = useStore((state) => ({
          isLoaded: state.isLoaded,
          soundObject: state.soundObject,
          audios: state.audios,
          index: state.index,
        }), shallowEqual);
        const dispatch = useDispatch();
        useEffect(() => {
          soundObject.setOnPlaybackStatusUpdate((status) => dispatch(updateStore(status)));
          soundObject.loadAsync(audios[0].audio, { volume: 0.25 });
          return () => soundObject.unloadAsync();
        }, []);
        return !!isLoaded && (
        <>
          <Background />
          <View style={styles.container}>
            <Header />
            <Body />
            <Footer />
            <AutoPlay />
          </View>
        </>
        );
      })}
    </Provider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
});
