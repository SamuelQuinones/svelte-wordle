import { get } from 'svelte/store';
import { guessStore } from '$stores/guess';
import { GAME_TITLE } from '$constants/strings';
import { solutionIndex } from './words';
import { MAX_CHALLENGES } from '$constants/settings';

export const generateEmojiGrid = () => {
	const store = get(guessStore);
	const results = store
		.map(({ statuses }) => {
			return statuses
				.map((status) => {
					switch (status) {
						case 'correct':
							return '🟩';
						case 'present':
							return '🟨';
						default:
							return '⬜';
					}
				})
				.join('');
		})
		.join('\n');
	return results;
};

export const shareStatus = (lost: boolean) => {
	navigator.clipboard.writeText(
		`${GAME_TITLE} ${solutionIndex + 1} ${
			lost ? 'X' : get(guessStore).length
		}/${MAX_CHALLENGES}\n\n${generateEmojiGrid()}\n\nhttps://word.samtheq.com`
	);
};
