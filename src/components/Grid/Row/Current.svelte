<script lang="ts">
	import type { CharValue } from '$lib/types';
	import { MAX_WORD_LENGTH } from '$constants/settings';
	import Tile from '../Tile.svelte';

	export let guess: CharValue[];

	$: emptyCells = Array.from(Array(MAX_WORD_LENGTH - guess.length));
</script>

<div class="grid grid-cols-5 gap-1">
	{#each guess as letter}
		<Tile {letter} />
	{/each}
	{#each emptyCells as _}
		<Tile />
	{/each}
</div>
