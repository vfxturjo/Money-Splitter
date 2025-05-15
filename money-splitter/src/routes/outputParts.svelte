<script lang="ts">
	import {
		calculatedResults,
		createFullCalculatedTableData,
		mermaidState
	} from '$lib/state.svelte';
	import MermaidRender from './mermaidRender.svelte';

	$effect(() => {
		calculatedResults.optimumTransactions && createFullCalculatedTableData();
	});
</script>

<div class="flex w-full justify-center">
	<MermaidRender diagramString={mermaidState.mermaidString}></MermaidRender>
</div>

{#if calculatedResults.fullTableData && calculatedResults.fullTableData.length}
	<div class="card space-y-4 p-4">
		<h2 class="h2">Detailed Table</h2>
		<table class="table">
			<thead>
				<tr>
					<th class="text-center">#</th>
					<th class="text-center">Name</th>
					<th class="text-center">Paid</th>
					<th class="text-center">Balance</th>
					<th class="text-center">Transactions</th>
				</tr>
			</thead>
			<tbody>
				{#each calculatedResults.fullTableData as row}
					<tr>
						<td>{row[0]}</td>
						<td>{row[1]}</td>
						<td class="text-right">{row[2]}</td>
						<td class="text-right">{row[3]}</td>
						<td>
							{#if Array.isArray(row[4]) && row[4].length}
								<ul>
									{#each row[4] as tx}
										<li>to {tx.to}: {tx.amount}</li>
									{/each}
								</ul>
							{:else}
								{' '}
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{:else}
	<p>No data available.</p>
{/if}
