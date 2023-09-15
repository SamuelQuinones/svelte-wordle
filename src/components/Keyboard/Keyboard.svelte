<script lang="ts">
	import { gameStore } from '$lib/game/stateStore';
	import type { CharValue } from '$lib/types';
	import { MAX_CHALLENGES, MAX_WORD_LENGTH } from '$constants/settings';
	import Key from './Key.svelte';
	import { keyboardStore } from './store';
	import { isWordInWordList } from '$lib/game/helpers';
	import { toastStore } from '$components/Toast';

	export let currentGuess: CharValue[] = [];

	$: shouldNotType = $gameStore.playState !== 'playing' || $keyboardStore.disabled;

	function onChar(value: CharValue) {
		if (shouldNotType) return;
		if (
			currentGuess.length < MAX_WORD_LENGTH &&
			$gameStore.guesses.length < MAX_CHALLENGES &&
			$gameStore.playState === 'playing'
		) {
			currentGuess.push(value);
			currentGuess = currentGuess;
		}
	}

	function onDelete() {
		if (shouldNotType) return;
		if (currentGuess.length > 0) {
			currentGuess.pop();
			currentGuess = currentGuess;
		}
	}

	function onEnter() {
		if (shouldNotType) return;
		if (currentGuess.length !== MAX_WORD_LENGTH) {
			toastStore.show({
				message: 'There are not enough letters',
				timeout: 3000,
				dismissible: false,
				type: 'warn'
			});
			return;
		}
		if (!isWordInWordList(currentGuess.join(''))) {
			toastStore.show({
				timeout: 3000,
				dismissible: false,
				message: 'Not a valid word',
				type: 'warn'
			});
			return;
		}
		gameStore.hardModeHelper(currentGuess);
		// If playing hard mode, and there was an error, break out
		if ($gameStore.isHardMode && $gameStore.hardModeError) return;
		keyboardStore.setDisabled(true);
		gameStore.addGuess(currentGuess);
		gameStore.determineGameState();
		currentGuess = [];
	}

	function onKeyDown(e: KeyboardEvent) {
		const value = e.key.toUpperCase();
		if (e.ctrlKey || e.shiftKey || e.metaKey) return;
		if (value === 'ENTER' || value === 'RETURN') {
			onEnter();
		} else if (value === 'BACKSPACE' || value === 'DELETE') {
			onDelete();
		} else if (value.length === 1 && value >= 'A' && value <= 'Z') {
			onChar(value as CharValue);
		}
	}

	const rowOne: CharValue[] = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
	const rowTwo: CharValue[] = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
	const rowThree: CharValue[] = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];
</script>

<svelte:window on:keydown={onKeyDown} />

<div data-keyboard class="mb-2">
	<section class="flex justify-center">
		{#each rowOne as kbKey (`${kbKey}${$keyboardStore.letterStatus.get(kbKey)}`)}
			<Key {kbKey} onClick={() => onChar(kbKey)} status={$keyboardStore.letterStatus.get(kbKey)} />
		{/each}
	</section>
	<section class="flex justify-center">
		{#each rowTwo as kbKey (`${kbKey}${$keyboardStore.letterStatus.get(kbKey)}`)}
			<Key {kbKey} onClick={() => onChar(kbKey)} status={$keyboardStore.letterStatus.get(kbKey)} />
		{/each}
	</section>
	<section class="flex justify-center">
		<Key kbKey="ENTER" onClick={onEnter} />
		{#each rowThree as kbKey (`${kbKey}${$keyboardStore.letterStatus.get(kbKey)}`)}
			<Key {kbKey} onClick={() => onChar(kbKey)} status={$keyboardStore.letterStatus.get(kbKey)} />
		{/each}
		<Key kbKey="DELETE" onClick={onDelete} />
	</section>
</div>
