<script lang="ts">
	import { browser } from '$app/environment';
	import { Grid } from '$components/Grid';
	import { Keyboard } from '$components/Keyboard';
	import { toastStore } from '$components/Toast';
	import { WIN_MESSAGES, solution } from '$lib/game/helpers';
	import { gameStore } from '$lib/game/stateStore';
	import type { CharValue } from '$lib/types';

	let currentGuess: CharValue[] = [];

	$: if ($gameStore.playState !== 'playing' && browser) {
		const statsModal = document.querySelector<HTMLDialogElement>('#svordle-stats-modal');
		setTimeout(() => statsModal!.showModal(), 2000);
	}

	$: {
		if ($gameStore.playState === 'won') {
			// TODO: Show toast
			toastStore.show({
				dismissible: false,
				message: WIN_MESSAGES[$gameStore.guesses.length - 1],
				id: 'wintoast',
				timeout: 2000
			});
		} else if ($gameStore.playState === 'lost') {
			toastStore.show({
				dismissible: false,
				message: `The word was ${solution}`,
				type: 'error',
				id: 'losetoast',
				timeout: 2000
			});
		}
	}
</script>

<svelte:head>
	<title>Svordle Two</title>
	<meta name="description" content="An updated worldle clone rebuilt with svelte" />
	<meta name="og:title" content="Svordle Two" />
	<meta name="og:description" content="An updated worldle clone rebuilt with svelte" />
	<meta name="og:site_name" content="Svordle Two" />
	<meta property="og:type" content="website" />
</svelte:head>

<main class="flex w-full grow flex-col items-center justify-center">
	<!-- Unsure if this needs to be bound -->
	<Grid {currentGuess} />
</main>

<Keyboard bind:currentGuess />
