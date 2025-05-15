<script lang="ts">
	import '../app.css';

	let { children } = $props();

	import { AppBar } from '@skeletonlabs/skeleton-svelte';
	import { Paperclip } from 'lucide-svelte';
	import { Calendar } from 'lucide-svelte';
	import { CircleUser } from 'lucide-svelte';
	import { Menu } from 'lucide-svelte';
</script>

<div class="grid grid-rows-[auto_1fr_auto]">
	<AppBar
		base="sticky top-0 z-10 p-4 backdrop-blur-sm"
		headlineClasses="sm:hidden"
		centerClasses="hidden sm:block"
		background="bg-none"
	>
		{#snippet lead()}
			<pre class="italic">Icon</pre>
		{/snippet}
		{#snippet trail()}
			<div class="hidden space-x-4 sm:flex">
				<Paperclip size={20} />
				<Calendar size={20} />
				<CircleUser size={20} />
			</div>
			<div class="block sm:hidden">
				<Menu size={20} />
			</div>
		{/snippet}
		{#snippet headline()}
			<h2 class="h2">Title</h2>
		{/snippet}
		<span>
			<pre class="italic">TITLE</pre>
		</span>
	</AppBar>

	<main class="col-span-1 space-y-4 p-4">
		{@render children()}
	</main>
</div>
