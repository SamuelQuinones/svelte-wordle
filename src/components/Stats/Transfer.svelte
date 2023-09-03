<script lang="ts">
	import { decrypt, encrypt } from '$lib/encrypt';
	import { saveGameStats } from '$lib/localStorage';
	import type { IGameStats } from '$lib/types';
	import { statStore } from '$lib/game/statStore';

	let importExportView = 'export';
	let importTextarea = '';

	$: exportableStats = encrypt(JSON.stringify($statStore));
	$: importableStats = decrypt(importTextarea);
	$: saveDisabled = importTextarea.length === 0 || !importableStats;

	function loadImported() {
		if (!importableStats) return;
		const parsed = JSON.parse(importableStats) as Record<string, unknown>;
		const hasKeys = [
			'winDistribution',
			'gamesFailed',
			'currentStreak',
			'bestStreak',
			'totalGames',
			'successRate'
		].every((k) => k in parsed);
		if (!hasKeys) return;
		const confirmation = confirm(
			'Are you sure you want to override the statistics on this device? This action is not reversable.'
		);
		if (confirmation) {
			saveGameStats(parsed as unknown as IGameStats);
			alert('Site will now reload');
			window.location.reload();
		}
	}
</script>

<div class="flex items-center gap-x-4">
	{#each ['import', 'export'] as operation}
		<div class="flex items-center gap-x-1">
			<label for="{operation}-operation" class="text-sm">
				{operation}
			</label>
			<input
				id="{operation}-operation"
				type="radio"
				name="operations"
				class="h-4 w-4"
				value={operation}
				bind:group={importExportView}
			/>
		</div>
	{/each}
	<p class="text-sm">my stats</p>
</div>
<div class="mt-4 text-sm">
	{#if importExportView === 'import'}
		<textarea
			rows={8}
			class:bg-red-900={importableStats === null}
			class="block w-full rounded-lg p-3"
			bind:value={importTextarea}
		/>
		<div class="mt-4 text-center">
			<button
				on:click={loadImported}
				disabled={saveDisabled}
				class="inline-flex items-center rounded-md border border-sky-800 bg-sky-600 px-4 py-2 font-medium text-white transition-colors hover:bg-sky-800 focus:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-offset-2 active:bg-sky-800 disabled:bg-transparent disabled:text-sky-800"
			>
				Save
			</button>
		</div>
	{:else}
		<textarea readonly rows={8} class="block w-full rounded-lg p-3" value={exportableStats} />
		<div class="mt-4 text-center">
			<button
				class="inline-flex items-center rounded-md border border-sky-800 bg-sky-600 px-4 py-2 font-medium text-white transition-colors hover:bg-sky-800 focus:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-offset-2 active:bg-sky-800"
			>
				Copy
			</button>
		</div>
	{/if}
</div>
