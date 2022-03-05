import { browser } from '$app/env';
import { writable } from 'svelte/store';

const createDarkModeStore = () => {
  let isDarkMode = false;
  if (browser) {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = localStorage.getItem('theme');
    isDarkMode = theme ? theme === 'dark' : prefersDarkMode ? true : false;
  }
  return writable(isDarkMode);
};
export const darkModeStore = createDarkModeStore();
export const watchDarkMode = (value: boolean) => {
  if (browser) {
    if (value) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }
};

const createHighContrastStore = () => {
  let isHighContrastMode = false;
  if (browser) {
    const highContrast = localStorage.getItem('highContrast');
    isHighContrastMode = highContrast === '1';
  }
  return writable(isHighContrastMode);
};
export const highContrastStore = createHighContrastStore();
export const watchHighContrast = (value: boolean) => {
  if (browser) {
    if (value) {
      document.documentElement.classList.add('high-contrast');
      localStorage.setItem('highContrast', '1');
    } else {
      document.documentElement.classList.remove('high-contrast');
      localStorage.setItem('highContrast', '0');
    }
  }
};
