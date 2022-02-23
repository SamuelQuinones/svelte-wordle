<script lang="ts">
	import { CELL_ANIMATION_DURATION, KEYBOARD_DELAY } from '$constants/settings';
	import type { CharStatus } from '$lib/status';
	import { dummy } from '$lib/transition';

	export let kbKey: string;
	export let onClick: (value: string) => void;
	export let status: CharStatus | undefined = undefined;
	export let heightClass = 'h-14';
	export let widthClass = 'w-12';

	const handleClick = (e: MouseEvent) => {
		onClick(kbKey);
		//@ts-ignore this will exist
		e.currentTarget.blur();
	};
	const animate = (node: HTMLElement, _args: any): any => {
		if (!!status) {
			return dummy(node, { duration: CELL_ANIMATION_DURATION, delay: KEYBOARD_DELAY });
		}
	};
</script>

<button
	class="keyboard-key {heightClass} {widthClass}"
	class:absent={status === 'absent'}
	class:correct={status === 'correct'}
	class:present={status === 'present'}
	on:click={handleClick}
	in:animate
	on:introstart={(e) => {
		if (!!status) {
			e.currentTarget.classList.add('revealing');
		}
	}}
	on:introend={(e) => {
		if (!!status) {
			e.currentTarget.classList.remove('revealing');
		}
	}}
>
	{kbKey}
</button>

<style lang="postcss" global>
	.keyboard-key {
		@apply m-0.5 flex touch-manipulation select-none items-center justify-center rounded bg-slate-200 text-xs font-bold uppercase text-black hover:bg-slate-300 dark:bg-slate-600 dark:text-white dark:hover:bg-slate-700 md:text-base;
	}
	.keyboard-key.absent {
		@apply bg-slate-400 text-white hover:bg-slate-400 dark:bg-slate-800 dark:hover:bg-slate-800;
	}
	.keyboard-key.correct {
		@apply bg-green-600 text-white hover:bg-green-600;
	}
	.keyboard-key.present {
		@apply bg-yellow-500 text-white hover:bg-yellow-500;
	}
	.keyboard-key.revealing {
		@apply !text-black hover:!bg-slate-300 dark:!bg-slate-600 dark:!text-white dark:hover:!bg-slate-700;
	}
</style>
