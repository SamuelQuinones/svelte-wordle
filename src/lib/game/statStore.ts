import { writable } from 'svelte/store';
import { MAX_CHALLENGES } from '$constants/settings';
import { browser } from '$app/environment';
import { loadStats, saveGameStats } from '$lib/localStorage';
import type { IGameStats } from '$lib/types';

const defaultStats: IGameStats = {
	winDistribution: [],
	gamesFailed: 0,
	currentStreak: 0,
	bestStreak: 0,
	totalGames: 0,
	successRate: 0
};

function createStatStore() {
	const init = loadStats(
		{ ...defaultStats, winDistribution: Array.from(new Array(MAX_CHALLENGES), () => 0) },
		'winDistribution',
		'gamesFailed',
		'currentStreak',
		'bestStreak',
		'totalGames',
		'successRate'
	);
	const { subscribe, set, update } = writable<IGameStats>(init);

	return {
		subscribe,
		calculateStats: (count: number, didWin: boolean) => {
			update((gameStats) => {
				const stats = { ...gameStats };

				//* you played a new game
				stats.totalGames += 1;

				if (didWin) {
					stats.winDistribution[count - 1] += 1;
					stats.currentStreak += 1;

					if (stats.bestStreak < stats.currentStreak) {
						stats.bestStreak = stats.currentStreak;
					}
				} else {
					stats.currentStreak = 0;
					stats.gamesFailed += 1;
				}

				const successRate = Math.round(
					(100 * (stats.totalGames - stats.gamesFailed)) / Math.max(stats.totalGames, 1)
				);
				stats.successRate = successRate;
				if (browser) {
					saveGameStats(stats);
				}
				return stats;
			});
		},
		reset: () =>
			set({ ...defaultStats, winDistribution: Array.from(new Array(MAX_CHALLENGES), () => 0) })
	};
}

export const statStore = createStatStore();
