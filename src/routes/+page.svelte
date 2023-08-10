<script lang="ts">
	import { Grid } from '$components/Grid';
	import { Keyboard } from '$components/Keyboard';
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

<main class="flex w-full grow flex-col items-center justify-center">
	<!-- Unsure if this needs to be bound -->
	<Grid {currentGuess} />
</main>

<Keyboard bind:currentGuess />
