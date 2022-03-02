<script lang="ts">
  import { CELL_ANIMATION_DURATION } from '$constants/settings';
  import type { CharStatus } from '$lib/status';
  import { rotateX } from '$lib/transition';
  import { backOut } from 'svelte/easing';
  import { scale } from 'svelte/transition';

  export let letter: string | undefined = undefined;
  export let status: CharStatus | undefined = undefined;
  export let heightClass = 'h-16';
  export let widthClass = 'w-16';
  export let delay = 1;

  const animate = (node: HTMLElement, args: any): any => {
    if (status) {
      return rotateX(node, {
        delay,
        duration: CELL_ANIMATION_DURATION,
        degrees: args.degrees,
        changeBg: args.changeBg
      });
    }
    if (letter) return scale(node, { start: 0.9, opacity: 1, easing: backOut, duration: 200 });
  };
</script>

<div
  class="game-tile {heightClass} {widthClass}"
  class:dark:border-slate-600={!letter}
  class:dark:border-white={!!letter && !status}
  class:border-black={!!letter && !status}
  class:text-shadow={!!status}
  class:absent={status === 'absent'}
  class:correct={status === 'correct'}
  class:present={status === 'present'}
  in:animate
  on:introstart={(e) => {
    if (status) {
      e.currentTarget.classList.add('revealing');
    }
  }}
  on:introend={(e) => {
    if (status) {
      e.currentTarget.classList.remove('revealing');
    }
  }}
>
  <div in:animate={{ changeBg: false, degrees: -180 }} class="letter-wrapper">
    {letter ?? ''}
  </div>
</div>

<style lang="postcss" global>
  .game-tile {
    @apply flex select-none items-center justify-center rounded border-2 text-4xl font-bold;
  }
  .game-tile.absent {
    @apply border-slate-400 bg-slate-400 text-white dark:border-slate-700 dark:bg-slate-700;
  }
  .game-tile.present {
    @apply border-yellow-500 bg-yellow-500 text-white high-contrast:border-cyan-500 high-contrast:bg-cyan-500;
  }
  .game-tile.correct {
    @apply border-green-600 bg-green-600 text-white high-contrast:border-orange-500 high-contrast:bg-orange-500;
  }
  .game-tile.revealing {
    @apply !border-black text-black dark:!border-white dark:!text-white;
  }
</style>
