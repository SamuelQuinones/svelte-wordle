<script lang="ts">
	import type { CharStatus, CharValue } from '$lib/types';

	export let kbKey: CharValue | 'ENTER' | 'DELETE';
	export let status: CharStatus | undefined = undefined;
	export let onClick: () => void;
</script>

<button
	class="keyboard-key h-14"
	class:w-12={!['ENTER', 'DELETE'].includes(kbKey)}
	class:w-[4.5rem]={['ENTER', 'DELETE'].includes(kbKey)}
	class:absent={status === 'absent'}
	class:correct={status === 'correct'}
	class:present={status === 'present'}
	on:click={onClick}
>
	{kbKey}
</button>

<style lang="postcss">
	.keyboard-key {
		@apply m-0.5 flex touch-manipulation select-none items-center justify-center rounded bg-slate-200 text-xs font-bold uppercase text-black hocus:bg-slate-300 dark:bg-slate-600 dark:text-white dark:hocus:bg-slate-700 md:text-base;
	}
	.keyboard-key.absent {
		@apply bg-slate-500 text-white hocus:bg-slate-500 dark:bg-slate-800 dark:hocus:bg-slate-800;
	}
	.keyboard-key.correct {
		@apply bg-green-600 text-white hocus:bg-green-600 high-contrast:bg-orange-500 high-contrast:hocus:bg-orange-600;
	}
	.keyboard-key.present {
		@apply bg-yellow-500 text-white hocus:bg-yellow-500 high-contrast:bg-cyan-500 high-contrast:hocus:bg-cyan-500;
	}
</style>
