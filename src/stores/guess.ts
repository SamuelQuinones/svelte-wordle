import { browser } from '$app/env';
import type { CharStatus, CharValue } from '$lib/status';
import { solution } from '$lib/words';
import { writable } from 'svelte/store';
import { loadGameFromLocalStorage } from '$lib/localstorage';
import { MAX_CHALLENGES } from '$constants/settings';
import { gameStateStore } from './gameState';

type Guess = {
  guess: CharValue[];
  statuses: CharStatus[];
};

const helper = (guess: CharValue[]) => {
  const splitSolution = solution.split('');
  //* used to make sure we don't perform the same present check more than once
  const usedSolutionCharacters = splitSolution.map(() => false);

  const statuses: CharStatus[] = Array.from(Array(guess.length));

  guess.forEach((letter, index) => {
    //* Start with correct cases
    if (letter === splitSolution[index]) {
      statuses[index] = 'correct';
      usedSolutionCharacters[index] = true;
      return;
    }
    //* letter is absent
    if (!splitSolution.includes(letter)) {
      statuses[index] = 'absent';
      return;
    }
    //* present status test
    const indexOfPresentChar = splitSolution.findIndex(
      (char, i) => char === letter && !usedSolutionCharacters[i]
    );

    if (indexOfPresentChar > -1) {
      statuses[index] = 'present';
      usedSolutionCharacters[indexOfPresentChar] = true;
      return;
    } else {
      statuses[index] = 'absent';
      return;
    }
  });
  return { guess, statuses };
};
function createGuessStore() {
  //* initialize
  let init: Guess[] = [];
  if (browser) {
    const loaded = loadGameFromLocalStorage();
    if (loaded?.solution === solution) {
      const isGameWon = loaded.guesses.includes(solution);
      if (isGameWon) {
        gameStateStore.setGameWon(true);
      }
      if (loaded.guesses.length === MAX_CHALLENGES && !isGameWon) {
        gameStateStore.setGameLost(true);
      }
      init = loaded.guesses.map((g) => {
        return helper(g.split('') as CharValue[]);
      });
    }
  }
  //* main logic
  const { subscribe, update, set } = writable<Guess[]>(init);
  return {
    subscribe,
    addGuess: (guess: CharValue[]) =>
      update((state) => {
        const newGuess = helper(guess);
        state.push(newGuess);
        return state;
      }),
    reset: () => set([])
  };
}
export const guessStore = createGuessStore();
