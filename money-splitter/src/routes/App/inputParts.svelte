<script lang="ts">
	import { calculateAllTransactions } from '$lib/calculator.svelte';
	import {
		appState,
		data,
		loadExampleDataset,
		mermaidState,
		resetPeopleData,
		type SplitData
	} from '$lib/state.svelte';
	import { Paperclip } from 'lucide-svelte';

	let amountToPayPerPerson = $derived(
		Number((data.v.totalAmount / data.v.totalNoOfPeople).toFixed(2))
	);
	let peopleData_sumPaid = $derived(
		data.v.peopleData.reduce((sum, person) => sum + person.paid, 0)
	);

	import { Modal } from '@skeletonlabs/skeleton-svelte';
	let modalOpenState_example = $state(false);
	let modalOpenState_reset = $state(false);
	function modalClose() {
		modalOpenState_example = false;
		modalOpenState_reset = false;
	}
</script>

<div class="card max-w-full space-y-4 p-4">
	<div class="flex">
		<h4 class="h4 w-full px-4 text-left">Overall Scenerio</h4>
		<button class="px-2" title="Load Example Dataset">
			{@render ExampleDatasetLoader()}
		</button>

		{@render ResetAllData()}
	</div>
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
					bind:value={data.v.totalAmount}
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
					bind:value={data.v.totalNoOfPeople}
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
				appState.v.showInputTable = true;
			}}>Start Input!</button
		>
	</form>
</div>

<!--  -->
<!--  -->
<!--  -->
<!--  -->
<!--  -->
<!--  -->
<!--  -->

{#if appState.v.showInputTable}
	<div class="card max-w-full space-y-4 p-4">
		<h4 class="h4 p-4">People Details</h4>
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
					{#each data.v.peopleData as person (person.id)}
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
								class="{peopleData_sumPaid == data.v.totalAmount
									? 'text-green-500'
									: 'text-red-500'} mx-3"
							>
								{peopleData_sumPaid}
							</span>
						</td>
						<td class="text-right">
							<span
								class={peopleData_sumPaid == data.v.totalAmount ? 'text-green-500' : 'text-red-500'}
							>
								{peopleData_sumPaid == data.v.totalAmount
									? ''
									: 'Mismatch! (' + (peopleData_sumPaid - data.v.totalAmount) + ')'}
							</span>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>

	<div class="w-full text-center print:hidden">
		<button
			title={data.v.totalAmount == 0 || peopleData_sumPaid != data.v.totalAmount
				? 'Check the people details table'
				: ''}
			class="btn preset-filled-primary-500 w-1/2"
			disabled={data.v.totalAmount == 0 || peopleData_sumPaid != data.v.totalAmount}
			onclick={() => {
				mermaidState.mermaidString = calculateAllTransactions(data.v);
				appState.v.showOutput = true;
			}}
		>
			{#if !appState.v.showOutput}
				Calculate
			{:else}
				Calculated!
			{/if}
		</button>
	</div>
{/if}

<!--  -->
<!--  -->
<!--  -->
<!--  -->
<!--  -->
<!--  -->
<!--  -->

{#snippet ExampleDatasetLoader()}
	<Modal
		open={modalOpenState_example}
		onOpenChange={(e) => (modalOpenState_example = e.open)}
		triggerBase="btn preset-tonal p-2"
		contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl max-w-screen-sm"
	>
		{#snippet trigger()}
			<Paperclip size={20} />
		{/snippet}
		{#snippet content()}
			<header class="flex justify-between">
				<h4 class="h4">Load Example Dataset?</h4>
			</header>
			<article>
				<p class="opacity-60">It will override current data</p>
			</article>
			<footer class="flex justify-end gap-4">
				<button type="button" class="btn preset-tonal" onclick={modalClose}>Cancel</button>
				<button
					type="button"
					class="btn preset-filled"
					onclick={() => {
						loadExampleDataset();
						modalClose();
					}}>Confirm</button
				>
			</footer>
		{/snippet}
	</Modal>
{/snippet}

{#snippet ResetAllData()}
	<Modal
		open={modalOpenState_reset}
		onOpenChange={(e) => (modalOpenState_reset = e.open)}
		triggerBase="btn preset-tonal"
		contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl max-w-screen-sm"
	>
		{#snippet trigger()}
			Reset all
		{/snippet}
		{#snippet content()}
			<header class="flex justify-between">
				<h4 class="h4">Reset all?</h4>
			</header>
			<article>
				<p class="opacity-60">It will clear all the local storage data, and start from scratch!</p>
			</article>
			<footer class="flex justify-end gap-4">
				<button type="button" class="btn preset-tonal" onclick={modalClose}>Cancel</button>
				<button
					type="button"
					class="btn preset-filled-warning-500"
					onclick={() => {
						localStorage.clear();
						location.reload();
					}}>Confirm</button
				>
			</footer>
		{/snippet}
	</Modal>
{/snippet}
