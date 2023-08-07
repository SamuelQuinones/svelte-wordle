import { VALIDGUESSES } from '$constants/validGuesses';
import { WORDS } from '$constants/wordlist';

export const solution = 'GUESS';

export const isWinningWord = (word: string) => {
	return solution === word;
};

export const isWordInWordList = (word: string) => {
	return WORDS.includes(word.toLowerCase()) || VALIDGUESSES.includes(word.toLowerCase());
};
