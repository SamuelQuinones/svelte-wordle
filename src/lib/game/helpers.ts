import { VALIDGUESSES } from '$constants/validGuesses';
import { WORDS } from '$constants/wordlist';
import { addDays, differenceInDays } from 'date-fns';

export const WIN_MESSAGES = [
	'Absolute mad lad',
	'Expertly done!',
	'Great job!',
	'Well done',
	'Call it a comeback!',
	'Phew, nice work!'
];

function getWordOfTheday() {
	const dayOne = new Date('2023-08-16');
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const daysSince = differenceInDays(today, dayOne);
	const tomorrow = addDays(today, 1);

	return {
		tomorrow,
		solutionIndex: daysSince,
		solution: WORDS[daysSince % WORDS.length].toUpperCase()
	};
}

export const { tomorrow, solution, solutionIndex } = getWordOfTheday();

export const isWinningWord = (word: string) => {
	return solution === word;
};

export const isWordInWordList = (word: string) => {
	return WORDS.includes(word.toLowerCase()) || VALIDGUESSES.includes(word.toLowerCase());
};
