<script lang="ts">
	import type { CharValue } from '$lib/status';
	import { guessStore } from '$stores/guess';
	import { MAX_CHALLENGES } from '$constants/settings';
	import Complete from './Row/Complete.svelte';
	import Current from './Row/Current.svelte';
	import Empty from './Row/Empty.svelte';

	export let currentGuess: CharValue[];

	$: empties =
		$guessStore.length < MAX_CHALLENGES - 1
			? Array.from(Array(MAX_CHALLENGES - 1 - $guessStore.length))
			: [];
</script>

<div class="grid grid-rows-6 gap-1 mt-2">
	{#each $guessStore as { guess, statuses }}
		<Complete {guess} {statuses} />
	{/each}
	{#if $guessStore.length < MAX_CHALLENGES}
		<Current guess={currentGuess} />
	{/if}
	{#each empties as _}
		<Empty />
	{/each}
</div>
