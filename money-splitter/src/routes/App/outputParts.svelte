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

<h4 class="h4 pb-4 text-left">Transaction Diagram</h4>
<div class="flex w-full flex-col items-center">
	<MermaidRender diagramString={mermaidState.mermaidString}></MermaidRender>
</div>

{#if calculatedResults.fullTableData && calculatedResults.fullTableData.length}
	<h4 class="h4 py-8 text-left">Detailed Table</h4>
	<div class="flex flex-col items-center">
		<table class="table w-auto">
			<thead>
				<tr>
					<th class="w-10 text-center">#</th>
					<th class="w-36 text-center">Name</th>
					<th class="w-28 !text-right">Paid</th>
					<th class="w-28 !text-right">Balance</th>
					<th class="w-44 !text-right">Transactions</th>
				</tr>
			</thead>
			<tbody>
				{#each calculatedResults.fullTableData as row}
					<tr>
						<td>{row[0]}</td>
						<td class="text-left">{row[1]}</td>
						<td class="text-right">{row[2].toFixed(2)}</td>
						<td class="text-right {-row[3] < 0 ? 'text-red-500' : 'text-green-500'}"
							>{-row[3].toFixed(2)}</td
						>
						<td class="text-right">
							{#if Array.isArray(row[4]) && row[4].length}
								<ul class="space-y-6">
									{#each row[4] as tx}
										<!-- <li class="mb-0 text-center">To {tx.to}:</li>
										<li class="mb-2 pb-1">{tx.amount.toFixed(2)}</li> -->
										<li class="">
											<p class="mb-[-5px] text-center">
												To {tx.to}:
											</p>
											<p class="text-right">
												{tx.amount.toFixed(2)}
											</p>
										</li>
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

<div class="w-full p-8 text-center">
	<button class="btn btn-sm preset-filled-surface-500 print:hidden" onclick={() => window.print()}>
		Click to print
	</button>
</div>
