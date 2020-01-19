import { createContext, useContext } from 'react';
import { Audio } from 'expo-av';

const SoundContext = createContext(new Audio.Sound());

export function useSound() {
  return useContext(SoundContext);
}

export default SoundContext;
