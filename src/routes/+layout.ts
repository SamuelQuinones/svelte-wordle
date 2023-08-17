import { browser } from '$app/environment';
import { loadHighContrast, loadIsDarkMode } from '$lib/localStorage';
import type { LayoutLoad } from './$types';

export const load = (() => {
	let isDarkMode = false;
	let isHighContrast = false;
	if (browser) {
		isDarkMode = loadIsDarkMode();
		isHighContrast = loadHighContrast();
	}
	return { isDarkMode, isHighContrast };
}) satisfies LayoutLoad;
