<script lang="ts">
	import '../app.css';
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { AppBar } from '@skeletonlabs/skeleton-svelte';
	import { appState } from '$lib/state.svelte';
	let { children } = $props();

	// Transition logic
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	let url = $derived(page.url.href);
	const transition_time = 100;

	// Check PWA
	onMount(() => {
		if (window.matchMedia('(display-mode: standalone)').matches) {
			appState.v.isPWAapp = true;
		} else {
			appState.v.isPWAapp = false;
		}
	});
</script>

<div class="grid grid-rows-[auto_1fr_auto]">
	<AppBar base="top-0 z-10 p-4" centerClasses="">
		{#snippet lead()}{/snippet}
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

	<!-- Footer -->
	<footer class="p-2 text-right opacity-70">
		Thanks for using! Created with ♡ by <a
			href="https://github.com/vfxturjo"
			class="badge preset-filled-secondary-500 hover:preset-filled"
		>
			vfxTurjo
		</a>
	</footer>
</div>
