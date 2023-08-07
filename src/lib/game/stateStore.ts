import type { CharValue, CharStatus, IGameStore } from '$lib/types';
import { writable } from 'svelte/store';
import { CELL_ANIMATION_DURATION, KEYBOARD_DELAY, MAX_CHALLENGES } from '$constants/settings';
import { isWinningWord, solution } from './helpers';
import { statStore } from './statStore';
import { browser } from '$app/environment';
import { loadGameState, loadIsHardMode, saveGameState, saveIsHardMode } from '$lib/localStorage';
import { keyboardStore } from '$components/Keyboard';

const RESPONSE_TIMEOUT = KEYBOARD_DELAY + CELL_ANIMATION_DURATION;

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

const defaultStoreVal: IGameStore = { guesses: [], playState: 'playing', isHardMode: false };

function initializeStoreData(): IGameStore {
	// If theres no browser, return default
	if (!browser) return defaultStoreVal;

	// get localstorage state
	const localState = loadGameState();
	// if there is no stored solution, or the stored solution is not the current global one, return default
	if (!localState.solution || localState.solution !== solution) return defaultStoreVal;

	// create bew gameState object
	const gameState: IGameStore = { playState: 'playing', guesses: [], isHardMode: false };

	// determine if the game is won, lost, or still playing
	const isGameWon = localState.guesses.includes(solution);
	const isGameLost = localState.guesses.length === MAX_CHALLENGES && !isGameWon;
	if (isGameWon) gameState.playState = 'won';
	if (isGameLost) gameState.playState = 'lost';

	// playing in hard mode
	gameState.isHardMode = loadIsHardMode();

	// map guess strings to the Guess object type
	gameState.guesses = localState.guesses.map((g) => {
		return helper(g.split('') as CharValue[]);
	});

	return gameState;
}

function createGameStore() {
	const init = initializeStoreData();
	const { subscribe, update, set } = writable<IGameStore>(init);

	return {
		subscribe,
		reset: () => set({ playState: 'playing', guesses: [], isHardMode: false }),
		setHardMode: (val: boolean) => {
			update((state) => {
				state.isHardMode = val;
				if (browser) saveIsHardMode(val);
				return state;
			});
		},
		addGuess: (guess: CharValue[]) => {
			update((state) => {
				// TODO: implement hardmode
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

				if (isWinningWord(lastItem!.letters.join(''))) {
					statStore.calculateStats(state.guesses.length, true);
					setTimeout(() => update((s) => ({ ...s, playState: 'won' })), RESPONSE_TIMEOUT + 100);
					return state;
				}
				if (state.guesses.length === MAX_CHALLENGES) {
					statStore.calculateStats(state.guesses.length, false);
					setTimeout(() => update((s) => ({ ...s, playState: 'lost' })), RESPONSE_TIMEOUT + 100);
				}
				return state;
			});
		}
	};
}

export const gameStore = createGameStore();
