<script lang="ts">
	import { example_Data } from '$lib/state.svelte';

	let totalAmount = $state(0);
	let totalNoOfPeople = $state(2);
	let amountToPayPerPerson = $derived(Number((totalAmount / totalNoOfPeople).toFixed(2)));

	interface paymentData {
		id: number;
		name: string;
		paid: number;
	}

	let peopleData = $state([
		{
			id: 0,
			name: '',
			paid: 0
		},
		{
			id: 1,
			name: '',
			paid: 0
		}
	] as paymentData[]);

	// LOADING EXAMPLES!!!!!
	totalAmount = example_Data['totalAmount'];
	totalNoOfPeople = example_Data['totalNoOfPeople'];
	peopleData = example_Data['peopleData'];

	let peopleData_sumPaid = $derived(peopleData.reduce((sum, person) => sum + person.paid, 0));

	function handle_totalNoOfPeople_change() {}

	// Function to update a person's data
	function updatePerson(id: number, field: string, value: any) {
		const index = peopleData.findIndex((p: paymentData) => p.id === id);
		if (index !== -1) {
			peopleData[index] = { ...peopleData[index], [field]: value };
		}
		// peopleData = peopleData;
	}

	function resetPeopleData(clean: boolean = false) {
		const currentPeople = peopleData;
		const currentCount = currentPeople.length;
		const targetCount = Math.max(1, Math.floor(totalNoOfPeople)); // Ensure at least 1 person

		if (currentCount !== targetCount) {
			const newPeople = [];
			for (let i = 0; i < targetCount; i++) {
				// Preserve existing data if available, otherwise create a new entry
				if (clean && currentPeople[i]) {
					newPeople.push(currentPeople[i] as paymentData);
				} else {
					newPeople.push({ id: i + 1, name: '', paid: 0 } as paymentData);
				}
			}

			// reset the id to be serially 1 to n
			newPeople.forEach((person, index) => {
				person.id = index + 1;
			});
			peopleData = newPeople;
		}
	}
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
			bind:value={totalAmount}
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
			bind:value={totalNoOfPeople}
			onchange={handle_totalNoOfPeople_change}
		/>
	</label>

	<p class="text-center">
		Amount to be paid per person: <span class="font-bold">{amountToPayPerPerson}</span>
	</p>

	<button class="btn preset-filled w-full" onclick={() => resetPeopleData(false)}
		>Start Input!</button
	>
</form>

<div class="table-wrap">
	<table class="table caption-bottom"></table>
</div>

<div class="card space-y-4 p-4">
	<h2 class="h2">People Details</h2>
	<table class="table-hover table">
		<thead>
			<tr>
				<th>ID</th>
				<th>Name</th>
				<th>Amount Paid</th>
				<th>Amount Owing</th>
			</tr>
		</thead>
		<tbody class="[&>tr]:hover:preset-outlined-primary-50-950">
			{#each peopleData as person (person.id)}
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
						class="{peopleData_sumPaid == totalAmount ? 'text-green-500' : 'text-red-500'} mx-3"
					>
						{peopleData_sumPaid}
					</span>
				</td>
				<td class="text-right">
					<span class={peopleData_sumPaid == totalAmount ? 'text-green-500' : 'text-red-500'}>
						{peopleData_sumPaid == totalAmount
							? ''
							: 'Mismatch! Offset ' + (totalAmount - peopleData_sumPaid)}
					</span>
				</td>
			</tr>
		</tbody>
	</table>
</div>

<button class="btn" onclick={() => console.log($state.snapshot(peopleData))}> Log it!</button>
