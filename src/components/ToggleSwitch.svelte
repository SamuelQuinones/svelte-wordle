<script lang="ts">
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';

  export let checked = false;
  export let label: string;
  export let disabled = false;

  const transformTween = tweened(0, { easing: cubicOut, duration: 200 });

  $: checked ? transformTween.set(1) : transformTween.set(0);
</script>

<div class="toggle-switch flex items-center justify-between">
  <h2 class="text-gray-500 dark:text-gray-200">{label}</h2>
  <label
    class:cursor-pointer={!disabled}
    class:cursor-not-allowed={disabled}
    class="flex touch-manipulation items-center rounded-full focus-within:ring-2"
  >
    <input {disabled} type="checkbox" class="sr-only" bind:checked />
    <div
      class:bg-gray-300={!checked && disabled}
      class:bg-gray-400={!checked && !disabled}
      class:bg-green-300={checked && disabled}
      class:bg-green-400={checked && !disabled}
      class:high-contrast:bg-orange-300={checked && disabled}
      class:high-contrast:bg-orange-400={checked && !disabled}
      class="flex h-8 w-14 items-center rounded-full p-1 transition-colors"
      aria-disabled={disabled}
    >
      <div
        style="transform: translateX({$transformTween * 100}%)"
        class:bg-white={!disabled}
        class:bg-gray-50={disabled}
        class="h-6 w-6 rounded-full shadow-md"
        aria-disabled={disabled}
      />
    </div>
  </label>
</div>
