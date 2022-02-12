<script lang="ts">
	import type { CharStatus } from '$lib/status';
	import classNames from 'classnames';

	export let letter: string | undefined = undefined;
	export let status: CharStatus | undefined = undefined;
	export let heightClass: string = 'h-16';
	export let widthClass: string = 'w-16';

	const classes = classNames('game-cell', heightClass, widthClass, {
		'border-black dark:border-white': !!letter,
		'dark:border-slate-600': !letter,
		default: !status,
		'text-shadow': !!status,
		absent: status === 'absent',
		present: status === 'present',
		correct: status === 'correct'
	});
</script>

<div class={classes}>{letter ?? ''}</div>

<style lang="postcss" global>
	.game-cell {
		@apply flex select-none items-center justify-center rounded border-2 text-4xl font-bold;
	}
	.game-cell.present {
		@apply border-yellow-500 bg-yellow-500 text-white dark:border-yellow-500 dark:bg-yellow-500;
	}
	.game-cell.correct {
		@apply border-green-600 bg-green-600 text-white dark:border-green-600 dark:bg-green-600;
	}
	.game-cell.absent {
		@apply border-slate-400 bg-slate-400 text-white dark:border-slate-700 dark:bg-slate-700;
	}
</style>
