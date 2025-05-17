// src/lib/NavigationService.ts
import { goto } from '$app/navigation';
import { page } from '$app/state'; // To get current path if needed, though not strictly for setting parent

// interface NavigationState {
// 	parentPaths: Map<string, string>; // Maps a current path to its desired parent path
// }

export class NavigationService {
	#parentPaths = $state<Map<string, string>>(new Map());
	#historyStack: string[] = $state([]); // A simplified history stack for our hierarchical navigation

	constructor() {
		// Optionally, you could try to initialize or restore state here if needed,
		// e.g., from localStorage for persistence across sessions, though for PWA
		// in-app navigation, this might be overkill.
		if (typeof window !== 'undefined') {
			// Initialize with the current path if it's the first load on a deep link
			// This helps in establishing a base if the app is opened not from home.
			const currentPath = page.url.pathname;
			if (currentPath !== '/' && this.#historyStack.length === 0) {
				this.#historyStack = this.buildHierarchy(currentPath);
			} else if (currentPath === '/' && this.#historyStack.length === 0) {
				this.#historyStack = ['/'];
			}
		}
	}

	/**
	 * Registers the parent path for a given child path.
	 * This should be called when a page that can be navigated "up" from is mounted.
	 * @param childPath The current page's path.
	 * @param parentPath The path to navigate to when "back" is pressed hierarchically.
	 */
	public setParentPath(childPath: string, parentPath: string): void {
		this.#parentPaths.set(childPath, parentPath);
		console.log(`Parent for ${childPath} set to ${parentPath}`);
	}

	/**
	 * A more integrated way to manage navigation.
	 * Call this when navigating to a new page.
	 * It updates the internal hierarchical stack.
	 * @param toPath The path being navigated to.
	 */
	public navigatedTo(toPath: string): void {
		if (toPath === '/') {
			this.#historyStack = ['/'];
			return;
		}

		// If navigating to a path that is already "above" the current top, reset stack
		const currentTop = this.#historyStack[this.#historyStack.length - 1];
		if (
			currentTop &&
			toPath !== currentTop &&
			!currentTop.startsWith(toPath) &&
			toPath.startsWith(currentTop.substring(0, currentTop.lastIndexOf('/')))
		) {
			// This means we navigated "up" using a link, so trim the stack
			while (
				this.#historyStack.length > 0 &&
				this.#historyStack[this.#historyStack.length - 1] !== toPath
			) {
				if (!toPath.startsWith(this.#historyStack[this.#historyStack.length - 1])) {
					this.#historyStack.pop();
				} else {
					// This case is tricky, ideally direct "up" navigation should be handled
					// by backHierarchically or by explicitly setting the stack.
					// For now, if it's a prefix, let's assume it's a valid higher level.
					break;
				}
			}
			if (this.#historyStack[this.#historyStack.length - 1] !== toPath) {
				// If after popping, the top isn't the toPath, it means we jumped.
				// Rebuild the hierarchy to the new path.
				this.#historyStack = this.buildHierarchy(toPath);
			}
		} else if (!this.#historyStack.includes(toPath)) {
			// If it's a deeper navigation, add to stack
			// Ensure the new path is a descendant of the current top or it's a sibling or new branch from root
			const expectedParent = toPath.substring(0, toPath.lastIndexOf('/')) || '/';
			if (
				this.#historyStack.length === 0 ||
				this.#historyStack[this.#historyStack.length - 1] === expectedParent ||
				expectedParent === '/'
			) {
				this.#historyStack.push(toPath);
			} else {
				// Navigated to a different branch not directly from the current stack top's hierarchy.
				// Reset stack to the new path's hierarchy.
				this.#historyStack = this.buildHierarchy(toPath);
			}
		}
		// Remove duplicates if any, keeping the last occurrence (which would be the new top)
		this.#historyStack = [...new Set(this.#historyStack)];
		console.log('Navigation stack updated:', [...this.#historyStack]);
	}

	/**
	 * Builds the hierarchical path from the root to the given path.
	 * e.g., /page-1/page-1.1 -> ['/', '/page-1', '/page-1/page-1.1']
	 * @param path The current path.
	 * @returns Array of paths representing the hierarchy.
	 */
	private buildHierarchy(path: string): string[] {
		if (path === '/') return ['/'];
		const segments = path.split('/').filter(Boolean);
		const hierarchy: string[] = ['/'];
		let current = '';
		for (const segment of segments) {
			current += `/${segment}`;
			hierarchy.push(current);
		}
		return hierarchy;
	}

	/**
	 * Navigates one step up in the hierarchy.
	 * It uses the internal history stack.
	 */
	public backHierarchically(): void {
		console.log('Current hierarchical stack before back:', [...this.#historyStack]);
		if (this.#historyStack.length > 1) {
			this.#historyStack.pop(); // Remove current page
			const parentPath = this.#historyStack[this.#historyStack.length - 1]; // Get new top
			if (parentPath) {
				console.log(`Navigating hierarchically to: ${parentPath}`);
				goto(parentPath, { replaceState: true }); // replaceState to avoid polluting browser history with this intermediate step
			} else {
				console.log('No parent path in custom stack, navigating to /');
				goto('/', { replaceState: true });
			}
		} else if (this.#historyStack.length === 1 && this.#historyStack[0] !== '/') {
			// Only one item left and it's not home, go home.
			this.#historyStack = ['/'];
			console.log('Last item, navigating to /');
			goto('/', { replaceState: true });
		} else {
			console.log('Already at root or stack empty.');
			// Optionally, allow native back behavior or do nothing
			// window.history.back(); // if you want to allow native back as a last resort
		}
	}

	/**
	 * Navigates one step up in the hierarchy based on registered parent paths.
	 * @param currentPath The current page's path.
	 * @param fallbackPath The path to navigate to if no parent is defined (e.g., '/').
	 */
	public goUp(currentPath: string, fallbackPath: string = '/'): void {
		const parent = this.#parentPaths.get(currentPath);
		if (parent) {
			console.log(`Navigating from ${currentPath} up to ${parent}`);
			// We use replaceState: true to ensure that the browser's history
			// doesn't get cluttered with these hierarchical "up" movements,
			// mimicking the "shortest path" behavior you described.
			goto(parent, { replaceState: true });
		} else {
			console.warn(
				`No parent path defined for ${currentPath}. Navigating to fallback: ${fallbackPath}`
			);
			goto(fallbackPath, { replaceState: true });
		}
	}

	// Getter for the reactive stack if needed in components
	get historyStack(): ReadonlyArray<string> {
		return this.#historyStack;
	}
}

// Export a singleton instance if you prefer that, or instantiate it where needed.
// For a global state, a singleton is common.
export const navigationService = new NavigationService();
