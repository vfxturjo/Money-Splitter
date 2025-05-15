// Function to generate the Mermaid chart definition string
export function generateMermaidChart(payments: [string, string, number][]) {
	if (!payments || payments.length === 0) {
		return 'graph LR\n  A[No payments to display]';
	}

	let definition = 'graph LR\n'; // Use Left to Right orientation

	payments.forEach(([from, to, amount]) => {
		// Format the amount to 2 decimal places
		const formattedAmount = amount.toFixed(2);
		// Add an edge for each payment: From --> |Amount| To
		definition += `  ${from} --> |${formattedAmount}| ${to}\n`;
	});

	return definition;
}
