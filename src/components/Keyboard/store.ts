import type { CharStatus, Guess, IKeyboardStore } from '$lib/types';
import { writable } from 'svelte/store';
/**
 * By converting the statuses into numbers,
 * we can create a hierarchy that can be logically tested to determine the most correct status
 *
 * The idea being that the highest number is the most correct
 */
function translateHierarchy(status?: CharStatus) {
	if (status === 'absent') return 1;
	if (status === 'present') return 2;
	if (status === 'correct') return 3;
	return 0;
}

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
					const currentStatus = translateHierarchy(letterStatus.get(char));
					const incomingStatus = translateHierarchy(guess.statuses[i]);
					if (incomingStatus > currentStatus) {
						letterStatus.set(char, guess.statuses[i]);
					}
				});
				return { letterStatus, ...rest };
			});
		}
	};
}

export const keyboardStore = createKeyboardStore();
