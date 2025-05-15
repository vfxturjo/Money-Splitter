<script lang="ts">
	import { appState } from '$lib/state.svelte';
	import InputParts from './inputParts.svelte';
	import OutputParts from './outputParts.svelte';
</script>

<!-- Main input -->
<div class="*:p-2">
	<InputParts />
</div>

<div class="py-8"></div>
<hr class="hr border-4 border-double" />
<div class="py-6"></div>

{#if appState.showOutput}
	<OutputParts></OutputParts>
{/if}

<!-- Footer -->
<footer class="p-4 text-right opacity-70">
	Thanks for using! Created by <a
		href="https://github.com/vfxturjo"
		class="badge preset-filled-secondary-500 hover:preset-filled"
	>
		vfxTurjo
	</a>
</footer>
