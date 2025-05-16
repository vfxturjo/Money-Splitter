<script lang="ts">
	import '../app.css';
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { AppBar } from '@skeletonlabs/skeleton-svelte';
	let { children } = $props();

	// Transition logic
	import { fade } from 'svelte/transition';
	let url = $derived(page.url.href);
	const transition_time = 100;
</script>

<div class="grid grid-rows-[auto_1fr_auto]">
	<AppBar base="top-0 z-10 p-4" centerClasses="">
		<a class="h5" href="{base}/">Money Splitter</a>
	</AppBar>

	{#key url}
		<main
			class="col-span-1 space-y-4 p-4"
			in:fade={{ duration: transition_time, delay: transition_time + 1 }}
			out:fade={{ duration: transition_time }}
		>
			{@render children()}
		</main>
	{/key}
</div>
