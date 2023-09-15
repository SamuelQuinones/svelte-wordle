<script lang="ts">
	import '../app.css';
	const version = __VERSION__;
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
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

	$: isHome = $page.url.pathname === '/';
	$: if (isHome && $gameStore.playState !== 'playing') {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
		setTimeout(() => stats.openModal(), 2200);
	}

	let help: Modal;
	let settings: Modal;
	let stats: Modal;
	let about: Modal;
	let transfer: Modal;

	let { isDarkMode, isHighContrast } = data;
	$: if (browser) saveIsDarkMode(isDarkMode);
	$: if (browser) saveHighContrast(isHighContrast);

	let isHardMode = $gameStore.isHardMode;
	$: gameStore.setHardMode(isHardMode);

	async function showCopyResponse() {
		const { didShare, didCopy } = await shareGameStatus(
			isHighContrast,
			isDarkMode,
			$gameStore.playState === 'lost'
		);
		if (didShare) return;
		if (didCopy) {
			toastStore.show({
				dismissible: false,
				message: 'Score copied to clipboard',
				type: 'info',
				timeout: 2000
			});
			return;
		}
		toastStore.show({
			dismissible: false,
			message: 'Share Operation Incomplete',
			type: 'error',
			timeout: 2000
		});
	}

	function onOpen() {
		keyboardStore.setDisabled(true);
	}

	function onClose() {
		keyboardStore.setDisabled(false);
	}

	function openTransferModal() {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		stats.closeModalWithoutCallback();
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		transfer.openWithoutCallback();
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
	<section class="flex justify-start">
		<button class="modal-trigger" on:click={help.openModal}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				fill="currentColor"
				viewBox="0 0 16 16"
			>
				<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
				<path
					d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"
				/>
			</svg><span class="sr-only">Help</span>
		</button>
	</section>
	<h1 class="flex justify-center text-2xl font-semibold md:text-4xl">Svordle</h1>
	<section class="flex justify-end gap-x-3">
		<button class="modal-trigger" on:click={stats.openModal}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				fill="currentColor"
				viewBox="0 0 16 16"
			>
				<path
					d="M4 11H2v3h2v-3zm5-4H7v7h2V7zm5-5v12h-2V2h2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1h-2zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3z"
				/>
			</svg><span class="sr-only">Statistics</span>
		</button>
		<button class="modal-trigger" on:click={settings.openModal}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				fill="currentColor"
				viewBox="0 0 16 16"
			>
				<path
					d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"
				/>
				<path
					d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"
				/>
			</svg><span class="sr-only">Settings</span>
		</button>
	</section>
</header>
<slot />
<footer class="flex grow-0 justify-around py-1 text-center text-sm sm:py-2">
	<section>Version <strong>{version}</strong></section>
	<section>
		<button
			on:click={about.openModal}
			class="font-bold text-blue-500 hover:underline hocus:text-blue-600 dark:text-sky-500 dark:hocus:text-sky-600"
			>About this App</button
		>
	</section>
</footer>

<!-- MODALS IN HEADER START -->

<!-- HELP MODAL -->
<Modal {onClose} {onOpen} bind:this={help}>
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
<Modal {onClose} {onOpen} bind:this={settings}>
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
				class="mb-3 inline-block rounded-md bg-blue-200 px-2 py-1 font-bold text-blue-900 hocus:bg-blue-300"
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
					// eslint-disable-next-line @typescript-eslint/no-unsafe-call
					settings.closeModal();
				}}
			>
				Reset Game State
			</button>
			<br />
			<button
				class="mb-3 inline-block rounded-md bg-blue-200 px-2 py-1 font-bold text-blue-900 hocus:bg-blue-300"
				on:click={() => {
					browser && localStorage.removeItem(statsKey);
					statStore.reset();
					toastStore.show({
						message: '[DEBUG] Game Stats Reset',
						type: 'info',
						timeout: 2000,
						dismissible: false
					});
					// eslint-disable-next-line @typescript-eslint/no-unsafe-call
					settings.closeModal();
				}}
			>
				Reset Game Stats
			</button>
		</div>
	{/if}
</Modal>

<!-- STATS MODAL -->
<Modal {onClose} {onOpen} bind:this={stats}>
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
						class="my-2 w-full rounded-md bg-sky-600 px-4 py-2 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 active:bg-sky-800 hocus:bg-sky-800"
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
					class="w-full rounded-md bg-sky-600 px-4 py-2 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 active:bg-sky-800 hocus:bg-sky-800"
					>Transfer</button
				>
			</div>
		</section>
	</svelte:fragment>
</Modal>

<!-- TRANSFER MODAL -->
<Modal {onClose} {onOpen} bind:this={transfer}>
	<h3 slot="header" class="text-center text-lg/6 font-medium">Transfer your statistics</h3>
	<Transfer />
</Modal>

<!-- MODALS IN HEADER END -->

<!-- MODALS IN FOOTER START -->

<!-- ABOUT MODAL -->
<Modal {onClose} {onOpen} bind:this={about}>
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
			class="mb-3 mt-1 inline-block rounded-md bg-blue-200 px-2 py-1 font-bold text-blue-900 hocus:bg-blue-300"
			><svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
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
				class="mb-2 font-bold text-blue-500 hover:underline hocus:text-blue-700 dark:text-sky-500 dark:hocus:text-sky-700"
				rel="noopener noreferrer"
			>
				Please support the official inspiration for this game</a
			>
		</div>
	</div>
</Modal>

<!-- MODALS IN FOOTER END -->

<style lang="postcss">
	.help p {
		@apply mb-4 text-sm;
	}
	.demo-row {
		@apply mb-1 flex items-center justify-start gap-1;
	}

	.modal-trigger {
		@apply transition-colors hocus:text-gray-600 dark:hocus:text-gray-500;
	}
	.modal-trigger > svg {
		display: inline-block;
		vertical-align: -0.125em;
		fill: currentcolor;
	}
</style>
