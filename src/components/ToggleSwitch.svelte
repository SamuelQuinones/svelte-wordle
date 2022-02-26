<script lang="ts">
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';

  export let checked = false;
  export let label: string;

  const transformTween = tweened(0, { easing: cubicOut, duration: 200 });

  $: checked ? transformTween.set(1) : transformTween.set(0);
</script>

<div class="toggle-switch flex items-center justify-between">
  <h2 class="text-gray-500 dark:text-gray-200">{label}</h2>
  <label
    class="flex cursor-pointer touch-manipulation items-center rounded-full focus-within:ring-2"
  >
    <input type="checkbox" class="sr-only" id="theme-switch" bind:checked />
    <div
      class:bg-gray-400={!checked}
      class:bg-green-400={checked}
      class="flex h-8 w-14 items-center rounded-full p-1 transition-colors"
    >
      <div
        style="transform: translateX({$transformTween * 100}%)"
        class="h-6 w-6 rounded-full bg-white shadow-md"
      />
    </div>
  </label>
</div>
