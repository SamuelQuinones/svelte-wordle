import { browser } from '$app/env';
import {
	defaultStats,
	loadStatsFromLocalStorate,
	saveStatsToLocalStorage
} from '$lib/localstorage';
import { writable } from 'svelte/store';

const createStatStore = () => {
	const { subscribe, update, set } = writable(loadStatsFromLocalStorate());

	const addStatsForCompletedGame = (count: number, didWin: boolean) => {
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
				saveStatsToLocalStorage(stats);
			}
			return stats;
		});
	};

	return {
		subscribe,
		addStatsForCompletedGame,
		reset: () => set(defaultStats)
	};
};
export const statStore = createStatStore();
