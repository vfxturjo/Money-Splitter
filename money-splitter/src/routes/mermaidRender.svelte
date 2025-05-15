<script lang="ts">
	import mermaid from 'mermaid';
	let { diagramString } = $props();
	let container: HTMLDivElement;

	async function renderDiagram() {
		// console.log(diagramString);
		mermaid.initialize({ theme: 'dark' });
		const { svg } = await mermaid.render('mermaid', diagramString);
		container.innerHTML = svg;
	}

	$effect(() => {
		diagramString && renderDiagram();
	});
</script>

<div bind:this={container}></div>
