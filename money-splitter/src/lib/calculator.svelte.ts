import { calculatedResults, type SplitData } from './state.svelte';

export function calculateAllTransactions(d: SplitData) {
	// getting ready
	const totalAmount = d.totalAmount;
	const totalNoOfPeople = d.totalNoOfPeople;
	const averagePay = (totalAmount / totalNoOfPeople).toFixed(2);

	interface paymentInfoCalc {
		id: number;
		name: string;
		paid: number;
		toPay: number;
		solved: boolean;
	}

	const peopleData = JSON.parse(JSON.stringify(d.peopleData)) as paymentInfoCalc[];

	// calculating the toPay and solved values
	peopleData.forEach((element) => {
		element.toPay = Number(averagePay) - element.paid;
		element.solved = false;
	});

	//
	//
	// direct pay
	// ["From", "To", "Amount"]
	const directPayments = [];
	for (let i = 0; i < peopleData.length; i++) {
		if (peopleData[i].solved) continue;

		for (let j = i + 1; j < peopleData.length; j++) {
			if (peopleData[j].solved) continue;

			if (peopleData[i].toPay === -peopleData[j].toPay) {
				peopleData[i].solved = true;
				peopleData[j].solved = true;
				if (peopleData[i].toPay > peopleData[j].toPay) {
					directPayments.push([peopleData[i].name, peopleData[j].name, peopleData[i].toPay]);
				} else {
					directPayments.push([peopleData[j].name, peopleData[i].name, peopleData[j].toPay]);
				}
				break;
			}
		}
	}

	//
	//
	// complicated pay
	// alternatingIterator
	peopleData.sort((a, b) => a.toPay - b.toPay);

	// Separate people into those who need to pay and those who need to be paid
	let payers = peopleData.filter((person) => person.toPay > 0 && !person.solved);
	let receivers = peopleData.filter((person) => person.toPay < 0 && !person.solved);

	// Array to store the complicated payments
	const complicatedPayments = [];

	// Use a small tolerance for floating-point comparisons
	const EPSILON = 0.001;

	while (payers.length > 0 && receivers.length > 0) {
		// Get the person who needs to pay the most and the person who needs to receive the most
		// Since payers are sorted ascending by toPay, the last one needs to pay the most positive amount
		// Since receivers are sorted ascending by toPay, the first one needs to receive the most negative amount
		const payer = payers[payers.length - 1];
		const receiver = receivers[0];

		// Calculate the amount to transfer
		const amount = Math.min(payer.toPay, -receiver.toPay);

		// Record the payment
		complicatedPayments.push([payer.name, receiver.name, amount]);

		// Update the toPay amounts
		payer.toPay -= amount;
		receiver.toPay += amount;

		// Remove solved individuals (or those close to solved) from the lists
		if (payer.toPay < EPSILON) {
			payers.pop(); // Remove the last payer
		}
		if (receiver.toPay > -EPSILON) {
			receivers.shift(); // Remove the first receiver
		}

		// Re-filter and re-sort the lists for robustness, though pop/shift is often sufficient
		payers = peopleData.filter((person) => person.toPay > EPSILON && !person.solved);
		receivers = peopleData.filter((person) => person.toPay < -EPSILON && !person.solved);
		payers.sort((a, b) => a.toPay - b.toPay);
		receivers.sort((a, b) => a.toPay - b.toPay);
	}

	// Combine direct and complicated payments for the final result
	const allPayments = [...directPayments, ...complicatedPayments];

	// console.log('All Payments (From, To, Amount):', allPayments);
	// Ensure allPayments is an array of [string, string, number]
	const filteredPayments: [string, string, number][] = allPayments
		.filter((p) => Array.isArray(p) && p.length === 3)
		.map((p) => [String(p[0]), String(p[1]), Number(p[2])] as [string, string, number]);

	calculatedResults.optimumTransactions = filteredPayments;
	return paymentsToMermaid(filteredPayments);
}

export function paymentsToMermaid(allPayments: [string, string, number][]): string {
	let mermaid = 'flowchart LR\n';
	allPayments.forEach(([from, to, amount]) => {
		const fromId = from.replace(/\s+/g, '_');
		const toId = to.replace(/\s+/g, '_');
		mermaid += `    ${fromId}("${from}") -->|${amount.toFixed(2)}| ${toId}("${to}")\n`;
	});
	// console.log(mermaid);

	return mermaid;
}
