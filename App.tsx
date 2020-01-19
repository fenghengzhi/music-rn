import React from 'react';
import { StatusBar } from 'react-native';
import Player from './src/Player';

export default function App() {
  return (
    <>
      <StatusBar translucent />
      <Player />
    </>
  );
}
