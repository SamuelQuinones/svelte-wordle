import type { Guess, IKeyboardStore } from '$lib/types';
import { writable } from 'svelte/store';

function createKeyboardStore() {
	const init = { modalOpen: false, letterStatus: new Map() };
	const { subscribe, update, set } = writable<IKeyboardStore>(init);

	return {
		subscribe,
		reset: () => set(init),
		setModalOpen: (val: boolean) => update((s) => ({ ...s, modalOpen: val })),
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
