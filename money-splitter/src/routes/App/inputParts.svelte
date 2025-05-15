<script lang="ts">
	import { calculateAllTransactions } from '$lib/calculator.svelte';
	import { appState, data, mermaidState, resetPeopleData, type SplitData } from '$lib/state.svelte';

	let amountToPayPerPerson = $derived(Number((data.totalAmount / data.totalNoOfPeople).toFixed(2)));
	let peopleData_sumPaid = $derived(data.peopleData.reduce((sum, person) => sum + person.paid, 0));
</script>

<div class="card max-w-full space-y-4 p-4">
	<h4 class="h4 w-full px-4 text-left">Overall Scenerio</h4>
	<form class="mx-auto w-full max-w-lg flex-col items-center space-y-4">
		<div class="flex gap-2">
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
		</div>
		<p class="text-center">
			Amount to be paid per person: <span class="font-bold">{amountToPayPerPerson}</span>
		</p>

		<button
			class="btn preset-filled w-full print:hidden"
			onclick={() => {
				resetPeopleData(false);
				appState.showInputTable = true;
			}}>Start Input!</button
		>
	</form>
</div>

{#if appState.showInputTable}
	<div class="card max-w-full space-y-4 p-4">
		<h4 class="h4 px-4">People Details</h4>
		<div class="flex flex-col items-center">
			<table class="table w-full max-w-[56rem]">
				<thead>
					<tr>
						<th class="!text-center"><span>ID </span> </th>
						<th class="!text-center"><span>Name </span> </th>
						<th class="!text-center"><span>Amount Paid </span> </th>
						<th class="!text-center"><span>Amount Owing </span> </th>
					</tr>
				</thead>
				<tbody class="[&>tr]:hover:preset-outlined-primary-50-950">
					{#each data.peopleData as person (person.id)}
						<tr>
							<td>{person.id}</td>
							<td>
								<input
									class="input"
									type="text"
									placeholder="Name"
									bind:value={person.name}
									onclick={() => {
										if (person.name == 'person-' + person.id) person.name = '';
									}}
									onfocusout={() => {
										if (person.name == '') person.name = 'person-' + person.id;
									}}
								/>
							</td>
							<td>
								<input
									class="input text-right"
									type="number"
									placeholder="0.00"
									min="0"
									step="0.01"
									bind:value={person.paid}
									onclick={() => {
										if (person.paid == 0) person.paid = null!;
									}}
									onfocusout={() => {
										if (person.paid == null) person.paid = 0;
									}}
								/>
							</td>
							<td class="text-right">
								<span
									class={amountToPayPerPerson - person.paid < 0 ? 'text-green-500' : 'text-red-500'}
								>
									{(amountToPayPerPerson - person.paid).toFixed(2)}
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
							<span
								class={peopleData_sumPaid == data.totalAmount ? 'text-green-500' : 'text-red-500'}
							>
								{peopleData_sumPaid == data.totalAmount
									? ''
									: 'Mismatch! (' + (peopleData_sumPaid - data.totalAmount) + ')'}
							</span>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>

	<div class="w-full text-center print:hidden">
		<button
			class="btn preset-filled-primary-500 w-1/2"
			disabled={data.totalAmount == 0 || peopleData_sumPaid != data.totalAmount}
			onclick={() => {
				mermaidState.mermaidString = calculateAllTransactions(data);
				appState.showOutput = true;
			}}
		>
			{#if !appState.showOutput}
				Calculate
			{:else}
				Calculated!
			{/if}
		</button>
	</div>
{/if}
