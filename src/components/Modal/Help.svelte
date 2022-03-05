<script lang="ts">
  import { spring } from 'svelte/motion';
  import { MAX_CHALLENGES, MAX_WORD_LENGTH } from '$constants/settings';
  import Tile from '../Grid/Tile.svelte';
  import Modal from './Base.svelte';

  /** Modal Visiblity */
  export let isOpen = false;
  /** Toggle Modal visibility */
  export let toggleIsOpen = (value: boolean) => {
    isOpen = value;
  };

  const scale = spring(1);
</script>

<button
  class="ml-2 mr-1 h-7 w-7 hover:text-gray-500 focus:text-gray-500 dark:hover:text-slate-400 dark:focus:text-slate-400 md:mx-2"
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
    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
    <path
      d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"
    />
  </svg>
</button>

<Modal {isOpen} {toggleIsOpen}>
  <h3 slot="header" class="text-center text-lg font-medium leading-6">How to play</h3>
  <div slot="content" class="mt-3">
    <section>
      <p>
        Guess the word in {MAX_CHALLENGES} tries. Each guess must be a valid {MAX_WORD_LENGTH} letter
        word.
      </p>
      <p>
        Hit the enter button to submit. You can use the provided onscreen keyboard or a connected
        keyboard.
      </p>
      <p>
        After each guess, the color of the tiles will change to show how close your guess was to the
        word.
      </p>
    </section>
    <hr class="my-3 border-t-2 dark:border-slate-400" />
    <section>
      <div class="demo-row">
        <Tile heightClass="h-12" widthClass="w-12" letter="W" status="correct" />
        <Tile heightClass="h-12" widthClass="w-12" letter="E" />
        <Tile heightClass="h-12" widthClass="w-12" letter="A" />
        <Tile heightClass="h-12" widthClass="w-12" letter="R" />
        <Tile heightClass="h-12" widthClass="w-12" letter="Y" />
      </div>
      <p>
        The letter <strong>W</strong> is in the word and in the correct spot.
      </p>
      <div class="demo-row">
        <Tile heightClass="h-12" widthClass="w-12" letter="P" />
        <Tile heightClass="h-12" widthClass="w-12" letter="I" />
        <Tile heightClass="h-12" widthClass="w-12" letter="L" status="present" />
        <Tile heightClass="h-12" widthClass="w-12" letter="O" />
        <Tile heightClass="h-12" widthClass="w-12" letter="T" />
      </div>
      <p>
        The letter <strong>L</strong> is in the word but in the wrong spot.
      </p>
      <div class="demo-row">
        <Tile heightClass="h-12" widthClass="w-12" letter="V" />
        <Tile heightClass="h-12" widthClass="w-12" letter="A" />
        <Tile heightClass="h-12" widthClass="w-12" letter="G" />
        <Tile heightClass="h-12" widthClass="w-12" letter="U" status="absent" />
        <Tile heightClass="h-12" widthClass="w-12" letter="E" />
      </div>
      <p>
        The letter <strong>U</strong> is not in the word in any spot.
      </p>
    </section>
    <hr class="my-3 border-t-2 dark:border-slate-400" />
    <section>
      <p>A new word will be available to guess every day!</p>
    </section>
  </div>
</Modal>

<style lang="postcss">
  p {
    @apply mb-4 text-sm;
  }
  .demo-row {
    @apply mb-1 flex items-center justify-start gap-1;
  }
</style>
