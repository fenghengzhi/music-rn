import {State} from './index';

export function updateStore(newStore: Partial<State>) {
    return {
        type: 'UPDATE_STORE',
        payload: newStore,
    };
}
