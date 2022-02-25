import { writable } from 'svelte/store';

// TODO: Possibly convert to derived store?
const createGameStateStore = () => {
  const { subscribe, update } = writable({ gameWon: false, gameLost: false });
  return {
    subscribe,
    setGameWon: (value: boolean) =>
      update((state) => ({ gameLost: state.gameLost, gameWon: value })),
    setGameLost: (value: boolean) =>
      update((state) => ({ gameLost: value, gameWon: state.gameWon }))
  };
};
export const gameStateStore = createGameStateStore();
