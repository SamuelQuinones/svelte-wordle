import type { IGameStats } from './types';

interface IStoredGameState {
	guesses: string[];
	solution?: string;
}

export const gameStateKey = 'gameState';

export function saveGameState(obj: IStoredGameState) {
	localStorage.setItem(gameStateKey, JSON.stringify(obj));
}

export function loadGameState(): IStoredGameState {
	try {
		const state = localStorage.getItem(gameStateKey);
		if (!state) return { guesses: [] };
		const parsed = JSON.parse(state) as Record<string, unknown>;
		if ('guesses' in parsed) {
			return parsed as unknown as IStoredGameState;
		}
		return { guesses: [] };
	} catch (error) {
		return { guesses: [] };
	}
}

export const statsKey = 'gameStats';

export function saveGameStats(state: IGameStats) {
	localStorage.setItem(statsKey, JSON.stringify(state));
}

export function loadStats(defaultShape: IGameStats, ...keys: (keyof IGameStats)[]): IGameStats {
	try {
		const stats = localStorage.getItem(statsKey);
		if (!stats) return defaultShape;
		const parsed = JSON.parse(stats) as Record<string, unknown>;
		if (keys.every((k) => k in parsed)) return parsed as unknown as IGameStats;
		return defaultShape;
	} catch (error) {
		return defaultShape;
	}
}

export const hardModeKey = 'hardMode';

export function saveIsHardMode(v: boolean) {
	localStorage.setItem(hardModeKey, v ? '1' : '0');
}

export function loadIsHardMode() {
	try {
		const value = localStorage.getItem(hardModeKey);
		return value === '1';
	} catch (error) {
		return false;
	}
}

// Theme items //
export const highContrastKey = 'sw-highContrast';

export function saveHighContrast(v: boolean) {
	if (v) {
		localStorage.setItem(highContrastKey, '1');
		document.documentElement.classList.add('high-contrast');
	} else {
		localStorage.setItem(highContrastKey, '0');
		document.documentElement.classList.remove('high-contrast');
	}
}

export function loadHighContrast() {
	try {
		const value = localStorage.getItem(highContrastKey);
		return value === '1';
	} catch (error) {
		return false;
	}
}

export const themeKey = 'sw-theme';

export function saveIsDarkMode(v: boolean) {
	if (v) {
		localStorage.setItem(themeKey, 'dark');
		document.documentElement.classList.add('dark');
	} else {
		localStorage.setItem(themeKey, 'light');
		document.documentElement.classList.remove('dark');
	}
}

export function loadIsDarkMode() {
	const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
	try {
		const theme = localStorage.getItem(themeKey);
		return theme ? theme === 'dark' : prefersDarkMode ? true : false;
	} catch (error) {
		return false;
	}
}
