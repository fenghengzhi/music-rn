import { State } from './index';


export default function reducer(state: State, action: { type: string, payload: Partial<State> }): State {
  const newState = action.payload;
  switch (action.type) {
    case 'UPDATE_STORE':
      if (!state) {
        return newState as State;
      }
      if (Object.keys(newState).some((key) => state[key] !== newState[key])) {
        return {
          ...state,
          ...newState,
          isLoaded: true,
        } as State;
      }
      return state;
    default:
      return state;
  }
}
