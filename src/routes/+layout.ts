import { browser } from '$app/environment';
import { loadHighContrast, loadIsDarkMode, loadIsHardMode } from '$lib/localStorage';
import type { LayoutLoad } from './$types';

export const load = (() => {
	let isDarkMode = false;
	let isHighContrast = false;
	let isHardMode = false;
	if (browser) {
		isDarkMode = loadIsDarkMode();
		isHighContrast = loadHighContrast();
		isHardMode = loadIsHardMode();
	}
	return { isDarkMode, isHighContrast, isHardMode };
}) satisfies LayoutLoad;
