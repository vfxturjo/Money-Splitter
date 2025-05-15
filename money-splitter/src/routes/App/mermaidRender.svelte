<script lang="ts">
	import mermaid from 'mermaid';
	let { diagramString } = $props();
	let container: HTMLDivElement;
	let loading = $state(false);

	async function renderDiagram() {
		loading = true;
		mermaid.initialize({ theme: 'dark' });
		const { svg } = await mermaid.render('mermaid', diagramString);
		container.innerHTML = svg;
		loading = false;
	}

	$effect(() => {
		diagramString && renderDiagram();
	});
</script>

{#if loading}
	<div>Loading diagram...</div>
{/if}
<div bind:this={container}></div>
