<script lang="ts">
  import { browser } from '$app/env';
  import type { CharValue } from '$lib/status';
  import { isWinningWord, isWordInWordList, solution } from '$lib/words';
  import { saveGameToLocalStorage } from '$lib/localstorage';
  import {
    CELL_ANIMATION_DURATION,
    KEYBOARD_DELAY,
    MAX_CHALLENGES,
    MAX_WORD_LENGTH
  } from '../constants/settings';
  import Keyboard from '$components/Keyboard/Keyboard.svelte';
  import Grid from '$components/Grid/Grid.svelte';
  import { toastStore } from '$components/Toast/store';
  import { statStore } from '$stores/stats';
  import { guessStore } from '$stores/guess';
  import { gameStateStore } from '$stores/gameState';
  import {
    aboutModalState,
    helpModalState,
    settingsModalState,
    statsModalState
  } from '$stores/modals';
  import {
    CORRECT_WORD_MSG,
    INVALID_WORD_MSG,
    NOT_ENOUGH_LETTERS_MSG,
    WIN_MESSAGES
  } from '$constants/strings';

  let currentGuess: CharValue[] = [];
  const RESPONSE_TIMEOUT = KEYBOARD_DELAY + CELL_ANIMATION_DURATION;

  // consider moving into onMount function
  // GAME WON
  $: if ($gameStateStore.gameWon) {
    toastStore.show({
      dismissible: false,
      message: WIN_MESSAGES[$guessStore.length - 1],
      id: 'wintoast',
      timeout: 2000
    });
    setTimeout(() => statsModalState.set(true), 2000);
  }
  // GAME LOST
  $: if ($gameStateStore.gameLost) {
    toastStore.show({
      dismissible: false,
      message: CORRECT_WORD_MSG(solution),
      type: 'error',
      id: 'losetoast',
      timeout: 2000
    });
    setTimeout(() => statsModalState.set(true), 2000);
  }
  $: if (browser) {
    saveGameToLocalStorage({
      solution,
      guesses: $guessStore.map((store) => store.guess.join(''))
    });
  }

  const onChar = (value: string) => {
    if (
      currentGuess.length < MAX_WORD_LENGTH &&
      $guessStore.length < MAX_CHALLENGES &&
      !$gameStateStore.gameWon
    ) {
      currentGuess.push(value as CharValue);
      currentGuess = currentGuess;
    }
  };
  const onDelete = () => {
    if (currentGuess.length > 0) {
      currentGuess.pop();
      currentGuess = currentGuess;
    }
  };
  const onEnter = () => {
    //* if modals are open
    if ($statsModalState || $helpModalState || $settingsModalState || $aboutModalState) {
      return;
    }
    //* if the game is over
    if ($gameStateStore.gameWon || $gameStateStore.gameLost) {
      return;
    }
    if (!(currentGuess.length === MAX_WORD_LENGTH)) {
      toastStore.show({
        timeout: 3000,
        dismissible: false,
        message: NOT_ENOUGH_LETTERS_MSG,
        type: 'warn'
      });
      return;
    }
    if (!isWordInWordList(currentGuess.join(''))) {
      toastStore.show({
        timeout: 3000,
        dismissible: false,
        message: INVALID_WORD_MSG,
        type: 'warn'
      });
      return;
    }
    const winningWord = isWinningWord(currentGuess.join(''));

    if ($guessStore.length < MAX_CHALLENGES && !$gameStateStore.gameWon) {
      guessStore.addGuess(currentGuess);
      currentGuess = [];

      if (winningWord) {
        statStore.addStatsForCompletedGame($guessStore.length, true);
        setTimeout(() => gameStateStore.setGameWon(true), RESPONSE_TIMEOUT);
        return;
      }

      if ($guessStore.length === MAX_CHALLENGES) {
        statStore.addStatsForCompletedGame($guessStore.length, false);
        setTimeout(() => gameStateStore.setGameLost(true), RESPONSE_TIMEOUT);
      }
    }
  };
</script>

<svelte:head>
  <title>Svordle</title>
  <meta name="description" content="A worldle clone built with svelte" />
  <meta name="og:title" content="Svordle" />
  <meta name="og:description" content="A worldle clone built with svelte" />
  <meta name="site_name" content="Svordle" />
  <meta name="og:site_name" content="Svordle" />
  <meta property="og:type" content="website" />
</svelte:head>

<main class="flex grow flex-col items-center justify-center">
  <Grid {currentGuess} allGuesses={$guessStore} />
</main>

<!-- <div> -->
<Keyboard {onChar} {onDelete} {onEnter} />
<!-- </div> -->
