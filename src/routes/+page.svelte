<script lang="ts">
	const hello = 'world';
	const version = __VERSION__;
</script>

<svelte:head>
	<title>Svordle Two</title>
	<meta name="description" content="An updated worldle clone rebuilt with svelte" />
	<meta name="og:title" content="Svordle Two" />
	<meta name="og:description" content="An updated worldle clone rebuilt with svelte" />
	<meta name="og:site_name" content="Svordle Two" />
	<meta property="og:type" content="website" />
</svelte:head>

<main class="flex grow flex-col items-center justify-center w-full">
	<h1>Welcome to SvelteKit</h1>
	<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
	<p>{hello} {version}</p>
</main>
