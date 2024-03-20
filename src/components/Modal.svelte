<script lang="ts">
	export let id: string | undefined = undefined;
	let dialogElement: HTMLDialogElement;

	export let onOpen: () => void = () => void 0;
	export let onClose: () => void = () => void 0;

	export function openModal() {
		dialogElement.showModal();
		onOpen();
	}

	export function closeModal() {
		dialogElement.close();
		onClose();
	}

	export function openWithoutCallback() {
		dialogElement.showModal();
	}

	export function closeModalWithoutCallback() {
		dialogElement.close();
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

	// need this to override closing behavior
	function onKeyDown(e: KeyboardEvent) {
		if (e.key.toLowerCase() === 'escape' && dialogElement.open) {
			e.preventDefault();
			closeModal();
		}
	}
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions a11y-click-events-have-key-events -->
<dialog
	{id}
	class="max-h-[calc(100%-1rem)] w-full overflow-hidden rounded-md dark:bg-gray-800 sm:max-h-[calc(100%-3.5rem)] sm:max-w-lg"
	bind:this={dialogElement}
	on:pointerdown={handleOutsideClick}
	on:keydown={onKeyDown}
>
	<div class="flex items-center p-3">
		<div class="grow">
			<slot name="header" />
		</div>
		<button
			on:click={closeModal}
			class="shrink transition-colors hocus:text-gray-600 dark:hocus:text-gray-500"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="1em"
				height="1em"
				fill="currentColor"
				class="size-6"
				style="display: inline-block; vertical-align: -0.125em; fill: currentColor;"
				viewBox="0 0 16 16"
			>
				<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
				<path
					d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
				/>
			</svg><span class="sr-only">close modal</span>
		</button>
	</div>

	<div class="overflow-auto p-3">
		<slot />
	</div>

	{#if $$slots.footer}
		<div class="p-3">
			<slot name="footer" />
		</div>
	{/if}
</dialog>

<style lang="postcss">
	dialog {
		color: inherit;
	}
	dialog[open] {
		display: flex;
		flex-direction: column;
	}
	dialog::backdrop {
		@apply bg-black bg-opacity-40 dark:bg-gray-400 dark:bg-opacity-50;
	}
</style>
