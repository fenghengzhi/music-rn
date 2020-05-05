import { createStore, Store } from 'redux';
import { Audio } from 'expo-av';
import { useRef } from 'react';
import { useSelector, useStore as useReduxStore } from 'react-redux';
import audios from '../audios';
import reducer from './reducer';

export default function useCreateStore() {
  const store = useRef<undefined | Store<State>>();
  if (!store.current) {
    store.current = createStore(reducer, {
      soundObject: new Audio.Sound(),
      audios,
      index: 0,
      playMode: PlayMode['loop-all'],
    } as State);
  }
  return store.current as Store<State>;
}

export function useStore(): State;
export function useStore<selectedStore>(selector: (state: State) => selectedStore, equalityFn?: (prevSelectedStore, nextSelectedStore) => boolean): selectedStore;

export function useStore(selector?, equalityFn?) {
  if (!selector) {
    return useReduxStore<State>();
  }
  return useSelector<State>(selector, equalityFn);
}

export function useIsPlaying() {
  const prevIsPlayingRef = useRef(false);
  const isPlaying = useStore((state) => (state.isBuffering ? prevIsPlayingRef.current : state.isPlaying));
  prevIsPlayingRef.current = isPlaying;
  return isPlaying;
}

export type LoadedPlaybackStatus = {
    isLoaded: boolean;
    androidImplementation?: string;

    uri: string;

    progressUpdateIntervalMillis: number;
    durationMillis?: number;
    positionMillis: number;
    playableDurationMillis?: number;
    seekMillisToleranceBefore?: number;
    seekMillisToleranceAfter?: number;

    shouldPlay: boolean;
    isPlaying: boolean;
    isBuffering: boolean;

    rate: number;
    shouldCorrectPitch: boolean;
    volume: number;
    isMuted: boolean;
    isLooping: boolean;

    didJustFinish: boolean; // true exactly once when the track plays to finish
};
export type State = {
    soundObject: Audio.Sound
    audios: typeof audios
    index: number
    playMode: PlayMode
} & LoadedPlaybackStatus;

export enum PlayMode {
    'shuffle' = 'shuffle',
    'loop-all' = 'repeat',
    'loop-single' = 'repeat-once',
}
