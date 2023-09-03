<script lang="ts">
	export let id: string | undefined = undefined;
	export let dialogElement: HTMLDialogElement;

	function handleOutsideClick(e: MouseEvent) {
		const dialogDimensions = dialogElement.getBoundingClientRect();
		if (
			e.clientX < dialogDimensions.left ||
			e.clientX > dialogDimensions.right ||
			e.clientY < dialogDimensions.top ||
			e.clientY > dialogDimensions.bottom
		) {
			dialogElement.close();
		}
	}
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions a11y-click-events-have-key-events -->
<dialog
	{id}
	class="max-h-[calc(100%-1rem)] w-full overflow-hidden rounded-md dark:bg-gray-800 sm:max-h-[calc(100%-3.5rem)] sm:max-w-lg"
	bind:this={dialogElement}
	on:click={handleOutsideClick}
>
	<div class="flex items-center p-3">
		<div class="grow">
			<slot name="header" />
		</div>
		<button on:click={() => dialogElement.close()} class="shrink">X</button>
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
