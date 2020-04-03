import React from 'react';
import { StatusBar } from 'react-native';
import { Audio } from 'expo-av';
import Player from './src/Player';

Audio.setAudioModeAsync({ staysActiveInBackground: true });

export default function App() {
  return (
    <>
      <StatusBar translucent />
      <Player />
    </>
  );
}
