<script lang="ts">
	import { Keyboard } from '$components/Keyboard';
	import { gameStore } from '$lib/game/stateStore';
	import type { CharValue } from '$lib/types';

	let currentGuess: CharValue[] = [];
</script>

<svelte:head>
	<title>Svordle Two</title>
	<meta name="description" content="An updated worldle clone rebuilt with svelte" />
	<meta name="og:title" content="Svordle Two" />
	<meta name="og:description" content="An updated worldle clone rebuilt with svelte" />
	<meta name="og:site_name" content="Svordle Two" />
	<meta property="og:type" content="website" />
</svelte:head>

<main class="flex grow flex-col items-center justify-center w-full">
	{#each $gameStore.guesses as { letters }}
		<p>{letters.join('')}</p>
	{/each}
	<div>{currentGuess.join('')}</div>
</main>

<Keyboard bind:currentGuess />
