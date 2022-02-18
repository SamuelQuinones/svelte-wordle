// TODO: Hash solution to be annoying
import { MAX_CHALLENGES } from '$constants/settings';

type StoredGameState = {
	guesses: string[];
	solution?: string;
};

export const gameStateKey = 'gameState';

export const saveGameToLocalStorage = (gameState: StoredGameState) => {
	localStorage.setItem(gameStateKey, JSON.stringify(gameState));
};

export const loadGameFromLocalStorage = () => {
	try {
		const state = localStorage.getItem(gameStateKey);
		if (!state) return { guesses: [] } as StoredGameState;
		return JSON.parse(state) as StoredGameState;
	} catch (error) {
		//TODO: alert error?
		return { guesses: [] } as StoredGameState;
	}
};

//* ----- STATS ----- *//

export type GameStats = {
	winDistribution: number[];
	gamesFailed: number;
	currentStreak: number;
	bestStreak: number;
	totalGames: number;
	successRate: number;
};

export const statsKey = 'gameStats';

export const defaultStats: GameStats = {
	winDistribution: Array.from(new Array(MAX_CHALLENGES), () => 0),
	gamesFailed: 0,
	currentStreak: 0,
	bestStreak: 0,
	totalGames: 0,
	successRate: 0
};

export const saveStatsToLocalStorage = (state: GameStats) => {
	localStorage.setItem(statsKey, JSON.stringify(state));
};

export const loadStatsFromLocalStorate = () => {
	try {
		const stats = localStorage.getItem(statsKey);
		if (!stats) return defaultStats;
		return JSON.parse(stats) as GameStats;
	} catch (error) {
		return defaultStats;
	}
};
