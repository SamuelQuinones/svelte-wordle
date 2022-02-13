<script lang="ts">
	import Settings from '../../components/Modal/Settings.svelte';
	import Help from '../../components/Modal/Help.svelte';
	import StatsModal from '../../components/Modal/Stats.svelte';
	import { statsModalState, helpModalState, settingsModalState } from './store';
	import ThemeSwitch from '$lib/Theme/Switch.svelte';
	import { GAME_TITLE } from '$constants/strings';
</script>

<header class="flex grow-0 items-center justify-between border-b-2 pb-1">
	<div class="flex items-center justify-center">
		<Help isOpen={$helpModalState} toggleIsOpen={helpModalState.set} />
		<ThemeSwitch />
	</div>
	<h1 class="text-2xl font-semibold md:text-4xl">{GAME_TITLE}</h1>
	<div class="flex items-center justify-center">
		<StatsModal isOpen={$statsModalState} toggleIsOpen={statsModalState.set} />
		<Settings isOpen={$settingsModalState} toggleIsOpen={settingsModalState.set} />
	</div>
</header>
