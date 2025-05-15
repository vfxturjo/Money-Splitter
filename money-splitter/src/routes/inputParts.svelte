<script lang="ts">
	import { calculateAllTransactions } from '$lib/calculator.svelte';
	import { appState, data, mermaidState, resetPeopleData, type SplitData } from '$lib/state.svelte';

	let amountToPayPerPerson = $derived(Number((data.totalAmount / data.totalNoOfPeople).toFixed(2)));
	let peopleData_sumPaid = $derived(data.peopleData.reduce((sum, person) => sum + person.paid, 0));
</script>

<form class="mx-auto w-full max-w-md space-y-4">
	<label class="label">
		<span class="label-text">Total amount</span>
		<input
			type="number"
			class="input"
			placeholder="Enter Number"
			min="0"
			step="0.01"
			bind:value={data.totalAmount}
		/>
	</label>

	<label class="label">
		<span class="label-text">Number of people</span>
		<input
			type="number"
			class="input"
			min="2"
			step="1"
			placeholder="Enter Number"
			bind:value={data.totalNoOfPeople}
		/>
	</label>

	<p class="text-center">
		Amount to be paid per person: <span class="font-bold">{amountToPayPerPerson}</span>
	</p>

	<button class="btn preset-filled w-full" onclick={() => resetPeopleData(false)}
		>Start Input!</button
	>
</form>

<div class="card space-y-4 p-4">
	<h2 class="h2">People Details</h2>
	<table class="table">
		<thead>
			<tr>
				<th>ID</th>
				<th>Name</th>
				<th>Amount Paid</th>
				<th>Amount Owing</th>
			</tr>
		</thead>
		<tbody class="[&>tr]:hover:preset-outlined-primary-50-950">
			{#each data.peopleData as person (person.id)}
				<tr>
					<td>{person.id}</td>
					<td>
						<input class="input" type="text" placeholder="Name" bind:value={person.name} />
					</td>
					<td>
						<input
							class="input text-right"
							type="number"
							placeholder="0.00"
							min="0"
							step="0.01"
							bind:value={person.paid}
						/>
					</td>
					<td class="text-right">
						<span
							class={amountToPayPerPerson - person.paid < 0 ? 'text-green-500' : 'text-red-500'}
						>
							{amountToPayPerPerson - person.paid}
						</span>
					</td>
				</tr>
			{/each}
			<tr>
				<td></td>
				<td class="text-right"> <span class="mx-3"> Total </span> </td>
				<td class="text-right">
					<span
						class="{peopleData_sumPaid == data.totalAmount
							? 'text-green-500'
							: 'text-red-500'} mx-3"
					>
						{peopleData_sumPaid}
					</span>
				</td>
				<td class="text-right">
					<span class={peopleData_sumPaid == data.totalAmount ? 'text-green-500' : 'text-red-500'}>
						{peopleData_sumPaid == data.totalAmount
							? ''
							: 'Mismatch! Offset ' + (data.totalAmount - peopleData_sumPaid)}
					</span>
				</td>
			</tr>
		</tbody>
	</table>

	<div class="w-full text-center">
		<button
			class="btn preset-filled w-1/2"
			onclick={() => {
				mermaidState.mermaidString = calculateAllTransactions(data);
				appState.show = true;
			}}
		>
			Calculate
		</button>
	</div>
</div>
