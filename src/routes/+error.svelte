<script lang="ts">
	import { page } from '$app/stores';
</script>

<main class="flex w-full grow flex-col items-center justify-center">
	<h1 class="mb-5 text-5xl">{$page.status}: {$page.error?.message}</h1>
	<a
		class="mb-3 inline-block rounded-md bg-blue-200 px-2 py-1 font-bold text-blue-900 hocus:bg-blue-300"
		href="/">Go home</a
	>
</main>
