<script lang="ts">
	import '../app.css';
	const version = __VERSION__;
	import { browser } from '$app/environment';
	import type { LayoutData } from './$types';
	import { gameStateKey, saveHighContrast, saveIsDarkMode, statsKey } from '$lib/localStorage';
	import { MAX_CHALLENGES, MAX_WORD_LENGTH } from '$constants/settings';
	import { statStore } from '$lib/game/statStore';
	import { gameStore } from '$lib/game/stateStore';
	import Toggle from '$components/Toggle.svelte';
	import Modal from '$components/Modal.svelte';
	import { keyboardStore } from '$components/Keyboard';
	import { Tile } from '$components/Grid';
	import { toastStore, Toast } from '$components/Toast';
	import { Graph, Transfer } from '$components/Stats';
	import { countdownClock } from '$lib/game/timeStore';
	import { shareGameStatus } from '$lib/share';
	import { onDestroy } from 'svelte';

	export let data: LayoutData;

	onDestroy(() => {
		keyboardStore.setDisabled(false);
	});

	const openModal = (dialogElement: HTMLDialogElement, runCb = true) => {
		dialogElement.showModal();
		if (runCb) keyboardStore.setDisabled(true);
	};
	const closeModal = (dialogElement: HTMLDialogElement, runCb = true) => {
		dialogElement.close();
		if (runCb) keyboardStore.setDisabled(false);
	};

	let help: HTMLDialogElement;
	let settings: HTMLDialogElement;
	let stats: HTMLDialogElement;
	let about: HTMLDialogElement;
	let transfer: HTMLDialogElement;

	let { isDarkMode, isHighContrast } = data;
	$: if (browser) saveIsDarkMode(isDarkMode);
	$: if (browser) saveHighContrast(isHighContrast);

	let isHardMode = $gameStore.isHardMode;
	$: gameStore.setHardMode(isHardMode);

	async function showCopyResponse() {
		try {
			const didShare = await shareGameStatus(
				isHighContrast,
				isDarkMode,
				$gameStore.playState === 'lost'
			);
			if (didShare) return;
			toastStore.show({
				dismissible: false,
				message: 'Score copied to clipboard',
				type: 'info',
				timeout: 2000
			});
		} catch (error) {
			toastStore.show({
				dismissible: false,
				message: 'Share Operation Canceled',
				type: 'error',
				timeout: 2000
			});
		}
	}

	function openTransferModal() {
		closeModal(stats, false);
		openModal(transfer, false);
	}
</script>

{#if $toastStore.length > 0}
	<aside
		class="justify-centere fixed left-0 right-0 top-7 z-[100001] mt-4 flex w-full flex-col"
		data-toast-container
	>
		{#each $toastStore as { dismissible, id, type, message } (id)}
			<!-- TODO: add the id to the dismis function in the actual toast? -->
			<Toast {type} {dismissible} on:dismiss={() => toastStore.dismiss(id)}>{message}</Toast>
		{/each}
	</aside>
{/if}

<header class="grid grow-0 grid-cols-3 items-center border-b-2 dark:border-slate-600">
	<section class="flex justify-start"><button on:click={() => openModal(help)}>?</button></section>
	<h1 class="flex justify-center text-2xl font-semibold md:text-4xl">Svordle</h1>
	<section class="flex justify-end gap-x-3">
		<button on:click={() => openModal(stats)}>📊</button>
		<button on:click={() => openModal(settings)}>⚙</button>
	</section>
</header>
<slot />
<footer class="flex grow-0 justify-around py-1 text-center text-sm sm:py-2">
	<section>Version <strong>{version}</strong></section>
	<section>
		<button
			on:click={() => openModal(about)}
			class="font-bold text-blue-500 hover:text-blue-600 hover:underline focus:text-blue-600 dark:text-sky-500 dark:hover:text-sky-600 dark:focus:text-sky-600"
			>About this App</button
		>
	</section>
</footer>

<!-- HELP MODAL -->
<Modal bind:dialogElement={help}>
	<h3 slot="header" class="text-center text-lg/6 font-medium">How to play</h3>
	<div class="help">
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

<!-- SETTINGS MODAL -->
<Modal bind:dialogElement={settings}>
	<h1 slot="header" class="text-center text-lg/6 font-medium">Settings</h1>
	<div class="space-y-3">
		<div>
			<Toggle bind:checked={isDarkMode}>Dark Mode?</Toggle>
		</div>
		<hr />
		<div>
			<Toggle bind:checked={isHighContrast}>High Contrast?</Toggle>
			<p class="text-xs">For improved color vision</p>
		</div>
		<hr />
		<div>
			<Toggle bind:checked={isHardMode} disabled={$gameStore.guesses.length > 0}>Hard Mode</Toggle>
			<p class="text-xs">Any revealed hints must be used in subsequent guesses.</p>
			<p class="text-xs"><strong>Can only be enabled <em>at the start</em>.</strong></p>
		</div>
	</div>
	{#if import.meta.env.DEV}
		<hr class="my-3" />
		<div class="mt-6 text-center">
			<button
				class="mb-3 inline-block rounded-md bg-blue-200 px-2 py-1 font-bold text-blue-900 hover:bg-blue-300 focus:bg-blue-300"
				on:click={() => {
					browser && localStorage.removeItem(gameStateKey);
					gameStore.reset();
					keyboardStore.reset();
					toastStore.show({
						message: '[DEBUG] Game State Reset',
						type: 'info',
						timeout: 2000,
						dismissible: false
					});
					closeModal(settings);
				}}
			>
				Reset Game State
			</button>
			<br />
			<button
				class="mb-3 inline-block rounded-md bg-blue-200 px-2 py-1 font-bold text-blue-900 hover:bg-blue-300 focus:bg-blue-300"
				on:click={() => {
					browser && localStorage.removeItem(statsKey);
					statStore.reset();
					toastStore.show({
						message: '[DEBUG] Game Stats Reset',
						type: 'info',
						timeout: 2000,
						dismissible: false
					});
					closeModal(settings);
				}}
			>
				Reset Game Stats
			</button>
		</div>
	{/if}
</Modal>

<!-- STATS MODAL -->
<Modal id="svordle-stats-modal" bind:dialogElement={stats}>
	<h3 slot="header" class="text-center text-lg/6 font-medium">Svordle Stats</h3>
	<div class="text-center">
		<Graph />
		{#if $gameStore.playState !== 'playing'}
			<section class="mt-5 grid grid-cols-2 gap-6">
				<div>
					<h5>New word in</h5>
					<div class="font-mono text-lg font-medium">{$countdownClock}</div>
				</div>
				<div class="px-1">
					<button
						on:click={showCopyResponse}
						type="button"
						class="my-2 w-full rounded-md bg-sky-600 px-4 py-2 font-medium text-white transition-colors hover:bg-sky-800 focus:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-offset-2 active:bg-sky-800"
					>
						Share
					</button>
				</div>
			</section>
		{/if}
	</div>
	<svelte:fragment slot="footer">
		<hr />
		<section class="mt-4 grid grid-cols-2 gap-x-4">
			<div class="p-1.5">
				<p class="text-sm">Click here to transfer your statistics to a new device.</p>
			</div>
			<div class="p-1.5">
				<button
					on:click={openTransferModal}
					class="w-full rounded-md bg-sky-600 px-4 py-2 font-medium text-white transition-colors hover:bg-sky-800 focus:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-offset-2 active:bg-sky-800"
					>Transfer</button
				>
			</div>
		</section>
	</svelte:fragment>
</Modal>

<!-- ABOUT MODAL -->
<Modal bind:dialogElement={about}>
	<h3 slot="header" class="text-center text-lg/6 font-medium">
		Svordle
		{version}
	</h3>
	<div class="mt-3 space-y-2 text-left text-base">
		<p>
			I built this game to teach myself how to use svelte. I also recently (as of 2023) rebult it
			using the now production ready SvelteKit.
		</p>
		<p>I'm primarily a ReactJS developer so this was a very different experience for me!</p>
		<p>The code for the project is open source and available on Github:</p>
		<a
			href="https://github.com/SamuelQuinones/svelte-wordle"
			target="_blank"
			class="mb-3 mt-1 inline-block rounded-md bg-blue-200 px-2 py-1 font-bold text-blue-900 hover:bg-blue-300 focus:bg-blue-300"
			><svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				fill="currentColor"
				class="inline-block"
				style="vertical-align: -.125em;"
				viewBox="0 0 16 16"
			>
				<path
					d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"
				/>
			</svg> View the Source
		</a>
		<div class="block">
			<a
				href="https://www.nytimes.com/games/wordle/index.html"
				target="_blank"
				class="mb-2 font-bold text-blue-500 hover:text-blue-700 hover:underline focus:text-blue-700 dark:text-sky-500 dark:hover:text-sky-700 dark:focus:text-sky-700"
				rel="noopener noreferrer"
			>
				Please support the official inspiration for this game</a
			>
		</div>
	</div>
</Modal>

<!-- TRANSFER MODAL -->
<Modal bind:dialogElement={transfer}>
	<h3 slot="header" class="text-center text-lg/6 font-medium">Transfer your statistics</h3>
	<Transfer />
</Modal>

<style lang="postcss">
	.help p {
		@apply mb-4 text-sm;
	}
	.demo-row {
		@apply mb-1 flex items-center justify-start gap-1;
	}
</style>
