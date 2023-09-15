<script lang="ts">
	export let checked = false;
	export let disabled = false;
</script>

<div class="toggle-label flex items-center justify-between">
	<slot />
	<input
		type="checkbox"
		class="input-toggle cursor-pointer disabled:cursor-not-allowed"
		bind:checked
		{disabled}
	/>
</div>

<style lang="postcss">
	.input-toggle {
		@apply relative h-8 w-14 appearance-none rounded-full bg-gray-500 transition-colors checked:bg-green-500 checked:after:translate-x-full disabled:bg-opacity-70 disabled:after:bg-opacity-60;
	}
	.input-toggle::after {
		content: '';
		@apply absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow-sm transition-transform;
	}
</style>
