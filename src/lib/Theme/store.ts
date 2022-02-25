import { browser } from '$app/env';
import { writable } from 'svelte/store';

const createThemeStore = () => {
  let isDarkMode = false;
  if (browser) {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = localStorage.getItem('theme');
    isDarkMode = theme ? theme === 'dark' : prefersDarkMode ? true : false;
  }
  const { subscribe, update, set } = writable(isDarkMode);
  return {
    subscribe,
    set,
    toggle: () => update((val) => !val)
  };
};
export const darkModeStore = createThemeStore();
