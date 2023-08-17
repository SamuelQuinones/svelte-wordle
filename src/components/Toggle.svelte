<script lang="ts">
	export let checked = false;
	export let disabled = false;
</script>

<label>
	<slot />
	<input type="checkbox" bind:checked {disabled} />
</label>
