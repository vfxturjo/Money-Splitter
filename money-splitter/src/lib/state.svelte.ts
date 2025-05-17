import { PersistedStateObjectAdvanced } from './StoreSavers/persistedStoreAdvanced.svelte';

export const example_data = {
	totalAmount: 100,
	totalNoOfPeople: 10,

	peopleData: [
		{
			id: 1,
			name: 'a',
			paid: 12
		},
		{
			id: 2,
			name: 'b',
			paid: 14
		},
		{
			id: 3,
			name: 'c',
			paid: 6
		},
		{
			id: 4,
			name: 'd',
			paid: 9
		},
		{
			id: 5,
			name: 'e',
			paid: 18
		},
		{
			id: 6,
			name: 'f',
			paid: 7
		},
		{
			id: 7,
			name: 'g',
			paid: 3
		},
		{
			id: 8,
			name: 'h',
			paid: 13
		},
		{
			id: 9,
			name: 'i',
			paid: 5
		},
		{
			id: 10,
			name: 'j',
			paid: 13
		}
	]
};

export interface paymentData {
	id: number;
	name: string;
	paid: number;
}

export interface SplitData {
	totalAmount: number;
	totalNoOfPeople: number;
	peopleData: paymentData[];
}

export const appState = new PersistedStateObjectAdvanced(
	'appState',
	{
		isPWAapp: false,
		showInputTable: false,
		showOutput: false
	},
	{
		syncTabs: false
	}
);

export const default_data: SplitData = {
	totalAmount: 0,
	totalNoOfPeople: 2,

	peopleData: [
		{
			id: 1,
			name: 'person-1',
			paid: 0
		},
		{
			id: 2,
			name: 'person-2',
			paid: 0
		}
	]
};

// MAIN
export const data = new PersistedStateObjectAdvanced(
	'data',
	{
		totalAmount: 0,
		totalNoOfPeople: 2,

		peopleData: [
			{
				id: 1,
				name: 'person-1',
				paid: 0
			},
			{
				id: 2,
				name: 'person-2',
				paid: 0
			}
		]
	} as SplitData,
	{
		syncTabs: false
	}
);

// LOADING EXAMPLES!!!!!
export function loadExampleDataset() {
	data.v.totalAmount = example_data['totalAmount'];
	data.v.totalNoOfPeople = example_data['totalNoOfPeople'];
	data.v.peopleData = example_data['peopleData'];
}

// reset data!
export function resetPeopleData(clean: boolean = false) {
	const currentPeople = data.v.peopleData;
	const currentCount = currentPeople.length;
	const targetCount = Math.max(1, Math.floor(data.v.totalNoOfPeople)); // Ensure at least 1 person

	if (currentCount !== targetCount) {
		const newPeople = [];
		for (let i = 0; i < targetCount; i++) {
			// Preserve existing data if available, otherwise create a new entry
			if (clean && currentPeople[i]) {
				newPeople.push(currentPeople[i] as paymentData);
			} else {
				newPeople.push({ id: i + 1, name: 'person-' + (i + 1), paid: 0 } as paymentData);
			}
		}

		// reset the id to be serially 1 to n
		newPeople.forEach((person, index) => {
			person.id = index + 1;
		});
		data.v.peopleData = newPeople;
	}
}

/////////////////
// OUTPUT
export const mermaidState = $state({
	mermaidLoading: false,
	mermaidString: ''
});

export const calculatedResults = $state({
	optimumTransactions: [] as [string, string, number][],
	fullTableData: [] as [number, string, number, number, { to: string; amount: number }[]][]
});

export function createFullCalculatedTableData() {
	const tableData = data.v.peopleData.map((person) => {
		const amountDue = data.v.totalAmount / data.v.totalNoOfPeople - person.paid;
		const toPay: { to: string; amount: number }[] = [];

		calculatedResults.optimumTransactions.forEach(([from, to, amount]) => {
			if (person.name === from) {
				toPay.push({ to, amount });
			}
		});

		return [person.id, person.name, person.paid, amountDue, toPay] as [
			number,
			string,
			number,
			number,
			{ to: string; amount: number }[]
		];
	});
	// console.log(tableData);

	calculatedResults.fullTableData = tableData;
	return tableData;
}
