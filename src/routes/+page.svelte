<script lang="ts">
	import { browser } from '$app/environment';
	import { Grid } from '$components/Grid';
	import { Keyboard } from '$components/Keyboard';
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
			alert('You won!');
		} else if ($gameStore.playState === 'lost') {
			// TODO: Show toast
			alert('You lost');
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
