<script lang="ts">
	import { base } from '$app/paths';
	import '../app.css';

	let { children } = $props();

	import { AppBar } from '@skeletonlabs/skeleton-svelte';
</script>

<div class="grid grid-rows-[auto_1fr_auto]">
	<AppBar base="top-0 z-10 p-4" centerClasses="">
		<a class="h5" href="{base}/">Money Splitter</a>
	</AppBar>

	<main class="col-span-1 space-y-4 p-4">
		{@render children()}
	</main>
</div>
