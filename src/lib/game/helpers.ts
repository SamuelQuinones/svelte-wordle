import { VALIDGUESSES } from '$constants/validGuesses';
import { WORDS } from '$constants/wordlist';

export const solution = 'GUESS';

export const isWinningWord = (word: string) => {
	return solution === word;
};

export const isWordInWordList = (word: string) => {
	return WORDS.includes(word.toLowerCase()) || VALIDGUESSES.includes(word.toLowerCase());
};

export const WIN_MESSAGES = [
	'Absolute mad lad',
	'Expertly done!',
	'Great job!',
	'Well done',
	'Call it a comeback!',
	'Phew, nice work!'
];
