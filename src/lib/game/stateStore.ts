import type { CharValue, CharStatus, IGameStore } from '$lib/types';
import { writable } from 'svelte/store';
import { TILE_ANIMATION_DURATION, KEYBOARD_DELAY, MAX_CHALLENGES } from '$constants/settings';
import { isWinningWord, solution } from './helpers';
import { statStore } from './statStore';
import { browser } from '$app/environment';
import { loadGameState, loadIsHardMode, saveGameState, saveIsHardMode } from '$lib/localStorage';
import { keyboardStore } from '$components/Keyboard';
import { toastStore } from '$components/Toast';

const RESPONSE_TIMEOUT = KEYBOARD_DELAY + TILE_ANIMATION_DURATION;

function helper(letters: CharValue[]) {
	const splitSolution = solution.split('');

	//* used to make sure we don't perform the same present check more than once
	const usedSolutionCharacters = splitSolution.map(() => false);

	const statuses = Array.from(Array(letters.length)) as CharStatus[];

	//* Start with correct cases
	letters.forEach((letter, index) => {
		if (letter === splitSolution[index]) {
			statuses[index] = 'correct';
			usedSolutionCharacters[index] = true;
			return;
		}
	});

	letters.forEach((letter, index) => {
		if (statuses[index]) return;

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
		}

		//? is this even needed?
		statuses[index] = 'absent';
		return;
	});
	return { letters, statuses };
}

function initializeStoreData(): IGameStore {
	// create new  gameState object
	const gameState: IGameStore = {
		playState: 'playing',
		guesses: [],
		isHardMode: false,
		hardModeError: false
	};

	// If theres no browser, return default
	if (!browser) return gameState;

	// playing in hard mode - needs to happen first to get around the issue of hardmode existing without any gamestate
	gameState.isHardMode = loadIsHardMode();

	// get localstorage state
	const localState = loadGameState();
	// if there is no stored solution, or the stored solution is not the current global one, return default
	if (!localState.solution || localState.solution !== solution) return gameState;

	// determine if the game is won, lost, or still playing
	const isGameWon = localState.guesses.includes(solution);
	const isGameLost = localState.guesses.length === MAX_CHALLENGES && !isGameWon;
	if (isGameWon) gameState.playState = 'won';
	if (isGameLost) gameState.playState = 'lost';

	// map guess strings to the Guess object type
	gameState.guesses = localState.guesses.map((g) => {
		const guess = helper(g.split('') as CharValue[]);
		keyboardStore.setLetterStatus(guess);
		return guess;
	});

	return gameState;
}

function createGameStore() {
	const init = initializeStoreData();
	const { subscribe, update, set } = writable<IGameStore>(init);

	return {
		subscribe,
		reset: () =>
			set({ playState: 'playing', guesses: [], isHardMode: false, hardModeError: false }),
		setHardMode: (val: boolean) => {
			update((state) => {
				state.isHardMode = val;
				if (browser) saveIsHardMode(val);
				return state;
			});
		},
		hardModeHelper: (guess: CharValue[]) => {
			update((state) => {
				if (!state.isHardMode) return state;
				state.hardModeError = false;
				for (const { letters, statuses } of state.guesses) {
					// Looping twice is needed here because wordle reports missing successes first...
					for (let i = 0; i < letters.length; i++) {
						const letter = letters[i];
						const status = statuses[i];
						if (status === 'correct' && letter !== guess[i]) {
							toastStore.show({
								message: `Needs ${letter} at position ${i + 1}`,
								timeout: 3000,
								dismissible: false,
								type: 'error'
							});
							state.hardModeError = true;
							break;
						}
					}
					if (state.hardModeError) break; // correct letter found, break out
					// Looping twice is needed here because wordle reports missing successes first...
					for (let i = 0; i < letters.length; i++) {
						const letter = letters[i];
						const status = statuses[i];
						if (status === 'present' && !guess.includes(guess[i])) {
							toastStore.show({
								message: `Needs ${letter}`,
								timeout: 3000,
								dismissible: false,
								type: 'error'
							});
							state.hardModeError = true;
							break;
						}
					}
					if (state.hardModeError) break; // present letter found, break out
				}
				return state;
			});
		},
		addGuess: (guess: CharValue[]) => {
			update((state) => {
				state.hardModeError = false;
				const guessWithStatus = helper(guess);
				state.guesses.push(guessWithStatus);
				if (browser) {
					saveGameState({ solution, guesses: state.guesses.map((s) => s.letters.join('')) });
				}
				return state;
			});
		},
		determineGameState: () => {
			update((state) => {
				const lastItem = state.guesses.at(-1);

				setTimeout(() => keyboardStore.setLetterStatus(lastItem!), RESPONSE_TIMEOUT);
				setTimeout(() => keyboardStore.setDisabled(false), RESPONSE_TIMEOUT + 50);

				if (isWinningWord(lastItem!.letters.join(''))) {
					statStore.calculateStats(state.guesses.length, true);
					setTimeout(() => update((s) => ({ ...s, playState: 'won' })), RESPONSE_TIMEOUT);
					return state;
				}
				if (state.guesses.length === MAX_CHALLENGES) {
					statStore.calculateStats(state.guesses.length, false);
					setTimeout(() => update((s) => ({ ...s, playState: 'lost' })), RESPONSE_TIMEOUT);
				}
				return state;
			});
		}
	};
}

export const gameStore = createGameStore();
