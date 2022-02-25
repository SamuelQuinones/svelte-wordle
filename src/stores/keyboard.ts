import { derived } from 'svelte/store';
import type { CharStatus } from '$lib/status';
import { solution } from '$lib/words';
import { guessStore } from './guess';

export const keyStatusStore = derived(guessStore, ($values) => {
  const base: { [key: string]: CharStatus } = {};
  $values.forEach(({ guess }) =>
    guess.forEach((letter, i) => {
      if (!solution.includes(letter)) {
        base[letter] = 'absent';
        return;
      }
      if (letter === solution[i]) {
        base[letter] = 'correct';
        return;
      }
      if (base[letter] !== 'correct') {
        base[letter] = 'present';
        return;
      }
    })
  );
  return base;
});
