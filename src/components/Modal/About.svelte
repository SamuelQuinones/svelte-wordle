<script lang="ts">
  import { ABOUT_APP_MSG, GAME_TITLE } from '$constants/strings';
  import Base from './Base.svelte';

  /** Modal Visiblity */
  export let isOpen = false;
  /** Toggle Modal visibility */
  export let toggleIsOpen = (value: boolean) => {
    isOpen = value;
  };

  //@ts-ignore this does exist because we set it in the kit config
  const clientVersion = __version__;
</script>

<button
  on:click={() => toggleIsOpen(true)}
  class="font-bold text-blue-500 hover:text-blue-600 hover:underline focus:text-blue-600 dark:text-sky-500 dark:hover:text-sky-600 dark:focus:text-sky-600"
  >{ABOUT_APP_MSG}</button
>

<Base {isOpen} {toggleIsOpen}>
  <h3 slot="header" class="text-center text-lg font-medium leading-6">
    {GAME_TITLE}
    {clientVersion}
  </h3>
  <div slot="content" class="mt-3 text-left text-base">
    <p class="mb-2">I built this game to teach myself how to use svelte.</p>
    <p class="mb-2">
      I'm primarily a ReactJS developer so this was a very different experience for me!
    </p>
    <!-- <p>The entire process was recorded for a YouTube video available here:</p>
		<a
			href="http://corporalsaturn.com"
			target="_blank"
			class="mb-3 mt-1 inline-block rounded-md bg-blue-200 py-1 px-2 font-bold text-blue-900 hover:bg-blue-300 focus:bg-blue-300"
			>Making a Word Game Clone</a> -->
    <p>The code for the project is open source and available on Github:</p>
    <a
      href="https://github.com/SamuelQuinones/svelte-wordle"
      target="_blank"
      class="mb-3 mt-1 inline-block rounded-md bg-blue-200 py-1 px-2 font-bold text-blue-900 hover:bg-blue-300 focus:bg-blue-300"
      ><svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="inline-block"
        style="vertical-align: -.125em;"
        viewBox="0 0 16 16"
      >
        <path
          d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"
        />
      </svg> View the Source
    </a>
    <div class="block">
      <a
        href="https://www.nytimes.com/games/wordle/index.html"
        target="_blank"
        class="mb-2 font-bold text-blue-500 hover:text-blue-700 hover:underline focus:text-blue-700 dark:text-sky-500 dark:hover:text-sky-700 dark:focus:text-sky-700"
        rel="noopener noreferrer"
      >
        Please support the official inspiration for this game</a
      >
    </div>
  </div>
</Base>
