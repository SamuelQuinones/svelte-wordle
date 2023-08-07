<script lang="ts">
	export let onOpen: () => void = () => void 0;
	export let onClose: () => void = () => void 0;

	let dialogElement: HTMLDialogElement;

	// To use, bind a variable to the component instance
	export function openModal() {
		dialogElement.showModal();
		onOpen?.();
	}

	// To use, bind a variable to the component instance
	export function closeModal() {
		dialogElement.close();
		onClose?.();
	}

	function handleOutsideClick(e: MouseEvent) {
		const dialogDimensions = dialogElement.getBoundingClientRect();
		if (
			e.clientX < dialogDimensions.left ||
			e.clientX > dialogDimensions.right ||
			e.clientY < dialogDimensions.top ||
			e.clientY > dialogDimensions.bottom
		) {
			closeModal();
		}
	}
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
	class="rounded-md sm:max-w-lg sm:max-h-[calc(100%-3.5rem)] max-h-[calc(100%-1rem)] overflow-hidden w-full"
	bind:this={dialogElement}
	on:click={handleOutsideClick}
>
	<div class="p-3 flex items-center">
		<div class="grow">
			<slot name="header" />
		</div>
		<button on:click={closeModal} class="shrink">X</button>
	</div>

	<div class="flex-1 overflow-auto p-3">
		<slot />
	</div>

	<div class="p-3">
		<slot name="footer" />
	</div>
</dialog>

<style lang="postcss">
	dialog[open] {
		display: flex;
		flex-direction: column;
	}
	dialog::backdrop {
		@apply bg-black bg-opacity-40 dark:bg-gray-400 dark:bg-opacity-50;
	}
</style>
