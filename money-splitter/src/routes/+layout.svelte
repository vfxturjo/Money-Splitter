<script lang="ts">
	import '../app.css';

	let { children } = $props();

	import { AppBar } from '@skeletonlabs/skeleton-svelte';
</script>

<div class="grid grid-rows-[auto_1fr_auto]">
	<AppBar base="top-0 z-10 p-4" centerClasses="">
		<span class="h5"> Money Splitter </span>
	</AppBar>

	<main class="col-span-1 space-y-4 p-4">
		{@render children()}
	</main>
</div>
