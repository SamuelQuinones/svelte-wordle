<script lang="ts">
	import { decrypt, encrypt } from '$lib/encrypt';
	import { saveGameStats } from '$lib/localStorage';
	import type { IGameStats } from '$lib/types';
	import { statStore } from '$lib/game/statStore';
	import { svordleShareData, svordleWriteClipboardText } from '$lib/share';
	import { toastStore } from '$components/Toast';
	import { tick } from 'svelte';

	let importExportView = 'export';
	let importTextarea = '';
	let copied = false;

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

	async function onCopied() {
		const dataToShare = {
			title: 'Svordle Stats',
			text: exportableStats
		};

		const didShare = await svordleShareData(dataToShare);
		if (didShare) return;

		const didCopy = await svordleWriteClipboardText(dataToShare.text);
		if (didCopy) {
			copied = true;
			await tick();
			setTimeout(() => (copied = false), 2000);
			return;
		}

		toastStore.show({
			dismissible: false,
			message: 'Share Operation Incomplete',
			type: 'error',
			timeout: 2000
		});
	}

	$: dynamicTextAreaClasses =
		exportableStats === importTextarea
			? 'bg-yellow-400 dark:bg-yellow-600'
			: importableStats === null
			? 'bg-red-500 dark:bg-red-900 text-white'
			: 'bg-gray-100 dark:bg-slate-700';
</script>

<div class="flex items-center gap-x-4">
	{#each ['import', 'export'] as operation}
		<div class="flex items-center gap-x-1">
			<input
				id="{operation}-operation"
				type="radio"
				name="operations"
				class="h-4 w-4"
				value={operation}
				bind:group={importExportView}
			/>
			<label for="{operation}-operation" class="text-sm">
				{operation}
			</label>
		</div>
	{/each}
	<p class="text-sm">my stats</p>
</div>
<div class="mt-4 text-sm">
	{#if importExportView === 'import'}
		<textarea
			rows={8}
			class="block w-full rounded-lg border border-gray-500 p-3 dark:border-slate-500 {dynamicTextAreaClasses}"
			bind:value={importTextarea}
		/>
		<div class="mt-4 text-center">
			<button
				on:click={loadImported}
				disabled={saveDisabled}
				class="inline-flex items-center rounded-md border border-sky-800 bg-sky-600 px-4 py-2 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 active:bg-sky-800 disabled:bg-transparent disabled:text-sky-800 hocus:bg-sky-800 disabled:hocus:bg-transparent"
			>
				Save
			</button>
		</div>
	{:else}
		<textarea
			readonly
			rows={8}
			class="block w-full rounded-lg border border-gray-500 bg-gray-100 p-3 dark:border-slate-500 dark:bg-slate-700"
			bind:value={exportableStats}
		/>
		<div class="mt-4 text-center">
			<button
				on:click={onCopied}
				class="inline-flex items-center rounded-md border border-sky-600 bg-sky-600 px-4 py-2 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 active:bg-sky-800 hocus:border-sky-800 hocus:bg-sky-800"
			>
				{#if copied}
					Copied!
				{:else}
					Copy <svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						style="vertical-align: -.125em; height: 1em; width: 1em;"
						class="ml-1 inline-block"
						viewBox="0 0 16 16"
					>
						<path
							d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"
						/>
						<path
							d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"
						/>
					</svg>
				{/if}
			</button>
		</div>
	{/if}
</div>
