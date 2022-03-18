import { WORDS } from '$constants/wordlist';
import { VALIDGUESSES } from '$constants/validGuesses';
import dayjs from 'dayjs';

export const isWordInWordList = (word: string) => {
  return WORDS.includes(word.toLowerCase()) || VALIDGUESSES.includes(word.toLowerCase());
};

export const isWinningWord = (word: string) => {
  return solution === word;
};

export const getWordOfDay = () => {
  const dayOne = dayjs('2022-02-22');
  const today = dayjs();
  const daysSince = today.diff(dayOne, 'days');
  const tomorrow = today.add(1, 'day').startOf('day');

  return {
    solution: WORDS[daysSince % WORDS.length].toUpperCase(),
    solutionIndex: daysSince,
    tomorrow
  };
};

export const { solution, solutionIndex, tomorrow } = getWordOfDay();
