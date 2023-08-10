<script lang="ts">
	import { MAX_WORD_LENGTH } from '$constants/settings';
	import Tile from '../Tile.svelte';

	const emptyTiles = Array.from(Array(MAX_WORD_LENGTH));
</script>

<div class="grid grid-cols-5 gap-1">
	{#each emptyTiles as _}
		<Tile />
	{/each}
</div>
