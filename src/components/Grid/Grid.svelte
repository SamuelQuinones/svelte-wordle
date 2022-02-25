<script lang="ts">
  import type { CharValue, CharStatus } from '$lib/status';
  // import type { guessStore } from '$stores/guess';
  import { MAX_CHALLENGES } from '$constants/settings';
  import Complete from './Row/Complete.svelte';
  import Current from './Row/Current.svelte';
  import Empty from './Row/Empty.svelte';

  export let currentGuess: CharValue[];
  /**
   * Same type as Guess from `$stores/guess`
   *
   * can alternatively use the `guessStore` here directly as opposed to making it a prop
   */
  export let allGuesses: { guess: CharValue[]; statuses: CharStatus[] }[];

  $: empties =
    allGuesses.length < MAX_CHALLENGES - 1
      ? Array.from(Array(MAX_CHALLENGES - 1 - allGuesses.length))
      : [];
</script>

<div class="mt-2 grid grid-rows-6 gap-1">
  {#each allGuesses as { guess, statuses }}
    <Complete {guess} {statuses} />
  {/each}
  {#if allGuesses.length < MAX_CHALLENGES}
    <Current guess={currentGuess} />
  {/if}
  {#each empties as _}
    <Empty />
  {/each}
</div>
