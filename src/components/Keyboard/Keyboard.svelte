<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { gameStore } from '$lib/game/stateStore';
	import type { CharValue } from '$lib/types';
	import { MAX_CHALLENGES, MAX_WORD_LENGTH } from '$constants/settings';
	import Key from './Key.svelte';
	import { keyboardStore } from './store';
	import { isWordInWordList } from '$lib/game/helpers';

	export let currentGuess: CharValue[] = [];

	function onChar(value: CharValue) {
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
		if (currentGuess.length > 0) {
			currentGuess.pop();
			currentGuess = currentGuess;
		}
	}

	function onEnter() {
		if ($gameStore.playState === 'lost' || $gameStore.playState === 'won') return;
		if (currentGuess.length !== MAX_WORD_LENGTH) {
			// todo: Show toast
			alert('not long enough');
			return;
		}
		if (!isWordInWordList(currentGuess.join(''))) {
			// todo: Show toast
			alert('not valid');
			return;
		}
		gameStore.addGuess(currentGuess);
		gameStore.determineGameState();
		currentGuess = [];
	}

	function onKeyDown(e: KeyboardEvent) {
		if ($keyboardStore.modalOpen) return;
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

	onMount(() => {
		if (browser) {
			window.addEventListener('keydown', onKeyDown);
		}
	});
	onDestroy(() => {
		if (browser) {
			window.removeEventListener('keydown', onKeyDown);
		}
	});

	const rowOne: CharValue[] = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
	const rowTwo: CharValue[] = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
	const rowThree: CharValue[] = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];
</script>

<div data-keyboard>
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
