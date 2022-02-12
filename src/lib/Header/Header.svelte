<script lang="ts">
	import Settings from '../../components/Modal/Settings.svelte';
	import Help from '../../components/Modal/Help.svelte';
	import StatsModal from '../../components/Modal/Stats.svelte';
	import { statsModalState, helpModalState, settingsModalState } from './store';
	import ThemeSwitch from '$lib/Theme/Switch.svelte';
</script>

<header class="flex grow-0 items-center justify-between border-b-2 pb-1">
	<div class="flex justify-center items-center">
		<Help isOpen={$helpModalState} toggleIsOpen={helpModalState.set} />
		<ThemeSwitch />
	</div>
	<h1 class="text-2xl md:text-4xl font-semibold">Svelte Wordle</h1>
	<div class="flex justify-center items-center">
		<StatsModal isOpen={$statsModalState} toggleIsOpen={statsModalState.set} />
		<Settings isOpen={$settingsModalState} toggleIsOpen={settingsModalState.set} />
	</div>
</header>
