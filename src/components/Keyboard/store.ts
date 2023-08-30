import type { Guess, IKeyboardStore } from '$lib/types';
import { writable } from 'svelte/store';

function createKeyboardStore() {
	const init = { letterStatus: new Map(), disabled: false };
	const { subscribe, update, set } = writable<IKeyboardStore>(init);

	return {
		subscribe,
		reset: () => set({ ...init, letterStatus: new Map() }),
		setDisabled: (val: boolean) => update((s) => ({ ...s, disabled: val })),
		setLetterStatus: (guess: Guess) => {
			update(({ letterStatus, ...rest }) => {
				guess.letters.forEach((char, i) => {
					if (letterStatus.get(char) !== 'correct') letterStatus.set(char, guess.statuses[i]);
				});
				return { letterStatus, ...rest };
			});
		}
	};
}

export const keyboardStore = createKeyboardStore();
