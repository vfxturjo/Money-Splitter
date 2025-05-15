export function alternatingIterator<T>(arr: T[]): T[] {
	const result: T[] = [];
	let left = 0;
	let right = arr.length - 1;

	while (left <= right) {
		if (left === right) {
			result.push(arr[left]);
			break;
		}
		result.push(arr[left]);
		result.push(arr[right]);
		left++;
		right--;
	}

	return result;
}
