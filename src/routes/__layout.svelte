<script lang="ts">
	import '../app.css';
	import Footer from '$lib/Footer.svelte';
	import Header from '$lib/Header/Header.svelte';
	import Container from '$components/Toast/Container.svelte';
</script>

<Container />
<Header />

<!-- <main class="grow"> -->
<slot />
<!-- </main> -->

<Footer />
