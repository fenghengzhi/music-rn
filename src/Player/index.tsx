import React, { useEffect } from 'react';
import { Provider, shallowEqual, useDispatch } from 'react-redux';
import { StyleSheet, View } from 'react-native';
import Footer from './Footer';
import Body from './Body';
import Header from './Header';
import useCreateStore, { useStore } from './store';
import { updateStore } from './store/action';

export default function Player() {
  return (
    <Provider store={useCreateStore()}>
      {React.createElement(() => {
        const { isLoaded, soundObject, audios } = useStore((state) => ({
          isLoaded: state.isLoaded,
          soundObject: state.soundObject,
          audios: state.audios,
        }), shallowEqual);
        const dispatch = useDispatch();
        useEffect(() => {
          soundObject.setOnPlaybackStatusUpdate((status) => dispatch(updateStore(status)));
          soundObject.loadAsync(audios[0].audio, { volume: 0.25 });
          return () => soundObject.unloadAsync();
        }, []);
        return !!isLoaded && (
        <View style={styles.container}>
          <Header />
          <Body />
          <Footer />
        </View>
        );
      })}
    </Provider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
