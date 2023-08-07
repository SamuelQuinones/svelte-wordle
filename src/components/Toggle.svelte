<script lang="ts">
	export let checked = false;
</script>

<label>
	<slot />
	<input type="checkbox" bind:checked />
</label>
