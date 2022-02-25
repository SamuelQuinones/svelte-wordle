<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { browser } from '$app/env';
  import { keyStatusStore } from '$stores/keyboard';
  import { DELETE_TEXT, ENTER_TEXT } from '$constants/strings';
  import Key from './Key.svelte';

  export let onChar: (value: string) => void;
  export let onEnter: () => void;
  export let onDelete: () => void;

  const onKeyDown = (e: KeyboardEvent) => {
    const value = e.key.toUpperCase();
    if (e.ctrlKey || e.shiftKey || e.metaKey) return;
    if (value === 'ENTER' || value === 'RETURN') {
      onEnter();
    } else if (value === 'BACKSPACE' || value === 'DELETE') {
      onDelete();
    } else if (value.length === 1 && value >= 'A' && value <= 'Z') {
      onChar(value);
    }
  };

  onMount(() => {
    if (browser) {
      window.addEventListener('keydown', onKeyDown);
    }
  });
  onDestroy(() => {
    if (browser) {
      window.removeEventListener('keydown', onKeyDown);
    }
  });

  const rowOne = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  const rowTwo = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
  const rowThree = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];
</script>

<div id="keyboard" class="mb-2">
  <section class="flex justify-center">
    {#each rowOne as kbKey (`${kbKey}${$keyStatusStore[kbKey]}`)}
      <Key {kbKey} onClick={onChar} status={$keyStatusStore[kbKey]} />
    {/each}
  </section>
  <section class="flex justify-center">
    {#each rowTwo as kbKey (`${kbKey}${$keyStatusStore[kbKey]}`)}
      <Key {kbKey} onClick={onChar} status={$keyStatusStore[kbKey]} />
    {/each}
  </section>
  <section class="flex justify-center">
    <Key kbKey={ENTER_TEXT} onClick={onEnter} widthClass="w-[4.5rem]" />
    {#each rowThree as kbKey (`${kbKey}${$keyStatusStore[kbKey]}`)}
      <Key {kbKey} onClick={onChar} status={$keyStatusStore[kbKey]} />
    {/each}
    <Key kbKey={DELETE_TEXT} onClick={onDelete} widthClass="w-[4.5rem]" />
  </section>
</div>
