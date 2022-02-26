<script lang="ts">
  import { highContrastStore } from './store';
  import ToggleSwitch from '$components/ToggleSwitch.svelte';
</script>

<ToggleSwitch bind:checked={$highContrastStore} label="High Contrast Mode" />
