<script lang="ts">
	import { appState } from '$lib/state.svelte';
	import InputParts from './inputParts.svelte';
	import OutputParts from './outputParts.svelte';
</script>

<!-- Main input -->
<div class="container mx-auto flex w-full flex-col items-center">
	<div class="w-full max-w-4xl">
		<InputParts />

		<div class="print:hidden">
			<div class="py-8"></div>
			<hr class="hr border-4 border-double" />
			<div class="py-6"></div>
		</div>

		{#if appState.v.showOutput}
			<div class="print:break-before-page">
				<OutputParts></OutputParts>
			</div>
		{/if}
	</div>
</div>
