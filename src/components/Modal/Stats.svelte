<script lang="ts">
	import classNames from 'classnames';
	import { countdownClock } from '$stores/countdown';
	import { gameStateStore } from '$stores/gameState';
	import { statStore } from '$stores/stats';
	import { shareStatus } from '$lib/share';
	import { toastStore } from '../Toast/store';
	import Modal from './Base.svelte';
	import {
		BEST_STREAK_TEXT,
		CURRENT_STREAK_TEXT,
		GUESS_DISTRIBUTION_TEXT,
		NEW_WORD_TEXT,
		SCORE_COPIED_MSG,
		SHARE_TEXT,
		STATISTICS_TITLE,
		SUCCESS_RATE_TEXT,
		TOTAL_GAMES_TEXT
	} from '$constants/strings';

	/** Modal Visiblity */
	export let isOpen: boolean = false;
	/** Toggle Modal visibility */
	export let toggleIsOpen = (value: boolean) => {
		isOpen = value;
	};

	const showCopyResponse = () => {
		try {
			shareStatus($gameStateStore.gameLost);
			toastStore.show({
				dismissible: false,
				message: SCORE_COPIED_MSG,
				type: 'info',
				timeout: 2000
			});
		} catch (error) {
			toastStore.show({
				dismissible: false,
				message: SCORE_COPIED_MSG,
				type: 'error',
				id: 'copy-error',
				timeout: 2000
			});
		}
	};

	$: maxValue = Math.max(...$statStore.winDistribution);
</script>

<button
	class="mx-1 h-7 w-7 hover:text-gray-500 focus:text-gray-500 dark:hover:text-slate-400 dark:focus:text-slate-400 md:mx-2"
	on:click={() => toggleIsOpen(true)}
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		fill="currentColor"
		class="inline-block"
		viewBox="0 0 16 16"
	>
		<path
			d="M4 11H2v3h2v-3zm5-4H7v7h2V7zm5-5v12h-2V2h2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1h-2zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3z"
		/>
	</svg>
</button>

<Modal {isOpen} {toggleIsOpen}>
	<h3 slot="header" class="text-center text-lg font-medium leading-6">{STATISTICS_TITLE}</h3>
	<div slot="content" class="text-center">
		<section class="my-2 flex justify-center">
			<div class="m-1 w-1/4 justify-center">
				<div class="text-3xl font-bold">
					{$statStore.totalGames}
				</div>
				<div class="text-xs">{TOTAL_GAMES_TEXT}</div>
			</div>
			<div class="m-1 w-1/4 justify-center">
				<div class="text-3xl font-bold">
					{$statStore.successRate}%
				</div>
				<div class="text-xs">{SUCCESS_RATE_TEXT}</div>
			</div>
			<div class="m-1 w-1/4 justify-center">
				<div class="text-3xl font-bold">
					{$statStore.currentStreak}
				</div>
				<div class="text-xs">{CURRENT_STREAK_TEXT}</div>
			</div>
			<div class="m-1 w-1/4 justify-center">
				<div class="block text-3xl font-bold">
					{$statStore.bestStreak}
				</div>
				<div class="text-xs">{BEST_STREAK_TEXT}</div>
			</div>
		</section>
		{#if $statStore.totalGames > 0}
			<h3 class="text-lg font-medium leading-6">{GUESS_DISTRIBUTION_TEXT}</h3>
			<section class="m-2 text-sm">
				{#each $statStore.winDistribution as win, i}
					<div class="m-1 flex">
						<div class="grow-0">{i + 1}</div>
						<div class="ml-2 grow">
							<div
								style={`width: ${(win / maxValue) * 90 + 5}%`}
								class={classNames('grow bg-sky-600 text-white dark:bg-blue-600', {
									'rounded-full': win > 0,
									'rounded-l-full': win === 0
								})}
							>
								{win}
							</div>
						</div>
					</div>
				{/each}
			</section>
		{/if}
		{#if $gameStateStore.gameWon || $gameStateStore.gameLost}
			<section class="mt-5 grid grid-cols-2 gap-6">
				<div>
					<h5>{NEW_WORD_TEXT}</h5>
					<div class="text-lg font-medium">{$countdownClock}</div>
				</div>
				<div class="px-1">
					<button type="button" on:click={showCopyResponse} class="share-button w-full font-medium">
						{SHARE_TEXT}
					</button>
				</div>
			</section>
		{/if}
	</div>
</Modal>

<style lang="postcss">
	.share-button {
		@apply my-2 rounded-md bg-sky-600 px-4 py-2 text-white transition-colors hover:bg-sky-800 focus:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-offset-2 active:bg-sky-800;
	}
</style>
