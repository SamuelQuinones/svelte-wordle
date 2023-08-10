<script lang="ts">
	import { MAX_CHALLENGES } from '$constants/settings';
	import { Complete, Current, Empty } from './Row';
	import { gameStore } from '$lib/game/stateStore';
	import type { CharValue } from '$lib/types';

	export let currentGuess: CharValue[] = [];

	$: emptyRows =
		$gameStore.guesses.length < MAX_CHALLENGES - 1
			? Array.from(Array(MAX_CHALLENGES - 1 - $gameStore.guesses.length))
			: [];
</script>

<div class="mt-2 grid grid-rows-6 gap-1">
	{#each $gameStore.guesses as { letters, statuses }}
		<Complete {letters} {statuses} />
	{/each}
	{#if $gameStore.guesses.length < MAX_CHALLENGES}
		<Current guess={currentGuess} />
	{/if}
	{#each emptyRows as _, i (i)}
		<Empty />
	{/each}
</div>
