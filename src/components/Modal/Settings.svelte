<script lang="ts">
  import { spring } from 'svelte/motion';
  import Modal from './Base.svelte';
  import { browser } from '$app/env';
  import { gameStateKey, statsKey } from '$lib/localstorage';
  import { guessStore } from '$stores/guess';
  import { statStore } from '$stores/stats';
  import { gameStateStore } from '$stores/gameState';
  import { darkModeStore, highContrastStore } from '$stores/theme';
  import ToggleSwitch from '$components/ToggleSwitch.svelte';

  /** Modal Visiblity */
  export let isOpen = false;
  /** Toggle Modal visibility */
  export let toggleIsOpen = (value: boolean) => {
    isOpen = value;
  };

  const scale = spring(1);
</script>

<button
  class="mr-2 ml-1 h-7 w-7 hover:text-gray-500 focus:text-gray-500 dark:hover:text-slate-400 dark:focus:text-slate-400 md:mx-2"
  on:click={() => toggleIsOpen(true)}
  on:mousedown={() => scale.set(0.8)}
  on:mouseup={() => scale.set(1)}
  on:mouseenter={() => scale.set(1.3)}
  on:mouseleave={() => scale.set(1)}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="currentColor"
    class="inline-block"
    viewBox="0 0 16 16"
    style="transform: scale({$scale});"
  >
    <path
      d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"
    />
    <path
      d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"
    />
  </svg>
</button>

<Modal {isOpen} {toggleIsOpen}>
  <h3 slot="header" class="text-center text-lg font-medium leading-6">Settings</h3>
  <div slot="content" class="mx-2 mt-3">
    <div>
      <ToggleSwitch bind:checked={$highContrastStore} label="High Contrast Mode" />
      <p class="-mt-1 text-xs text-gray-500 dark:text-gray-200">For improved color vision</p>
    </div>
    <hr class="my-3" />
    <div>
      <ToggleSwitch bind:checked={$darkModeStore} label="Toggle Dark Mode" />
    </div>
    {#if import.meta.env.DEV}
      <hr class="my-3" />
      <div class="mt-6 text-center">
        <button
          class="mb-3 inline-block rounded-md bg-blue-200 py-1 px-2 font-bold text-blue-900 hover:bg-blue-300 focus:bg-blue-300"
          on:click={() => {
            browser && localStorage.removeItem(gameStateKey);
            guessStore.reset();
            gameStateStore.setGameLost(false);
            gameStateStore.setGameWon(false);
            toggleIsOpen(false);
          }}
        >
          Reset Game State
        </button>
        <br />
        <button
          class="mb-3 inline-block rounded-md bg-blue-200 py-1 px-2 font-bold text-blue-900 hover:bg-blue-300 focus:bg-blue-300"
          on:click={() => {
            browser && localStorage.removeItem(statsKey);
            statStore.reset();
            toggleIsOpen(false);
          }}
        >
          Reset Game Stats
        </button>
      </div>
    {/if}
  </div>
</Modal>
