<script lang="ts">
	import '../app.css';
	const version = __VERSION__;
	import { browser } from '$app/environment';
	import type { LayoutData } from './$types';
	import { saveHighContrast, saveIsDarkMode } from '$lib/localStorage';
	import Toggle from '$components/Toggle.svelte';
	import Modal from '$components/Modal.svelte';
	import { keyboardStore } from '$components/Keyboard';

	export let data: LayoutData;

	const onOpen = () => keyboardStore.setModalOpen(true);
	const onClose = () => keyboardStore.setModalOpen(false);

	let settings: Modal;

	let { isDarkMode, isHighContrast } = data;
	$: if (browser) saveIsDarkMode(isDarkMode);
	$: if (browser) saveHighContrast(isHighContrast);
</script>

<header class="grid grow-0 grid-cols-3 items-center border-b-2 dark:border-slate-600">
	<section class="flex justify-start">?</section>
	<h1 class="flex justify-center text-2xl font-semibold md:text-4xl">Svordle</h1>
	<section class="flex justify-end">
		<button on:click={settings.openModal}>⚙</button>
	</section>
</header>
<slot />
<footer class="flex grow-0 justify-around py-1 text-center text-sm sm:py-2">
	<section>Version <strong>{version}</strong></section>

	<section>About this app</section>
</footer>

<Modal bind:this={settings} {onOpen} {onClose}>
	<h1 slot="header" class="text-center text-lg/6 font-medium">Settings</h1>
	<Toggle bind:checked={isDarkMode}>Dark Mode?</Toggle>
	<Toggle bind:checked={isHighContrast}>High Contrast?</Toggle>
</Modal>
