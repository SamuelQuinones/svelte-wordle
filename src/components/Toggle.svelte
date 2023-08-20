<script lang="ts">
	export let checked = false;
	export let disabled = false;
</script>

<label class="toggle-label" class:cursor-not-allowed={disabled}>
	<slot />
	<input
		type="checkbox"
		class="input-toggle"
		class:cursor-not-allowed={disabled}
		bind:checked
		{disabled}
	/>
</label>
