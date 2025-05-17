import { beforeNavigate, goto } from '$app/navigation';
import { page } from '$app/state';

interface BackNavigationOptions {
	/** The URL to navigate to when the back button is pressed.
	 * If not provided, will navigate to the home page ('/').
	 */
	targetBackUrl?: string;
	/** The path of your application's home page. Defaults to '/'. */
	homePath?: string;
}

/**
 * Manages custom back button behavior for a Svelte component.
 *
 * - If `targetBackUrl` is provided, the back button will navigate to this URL.
 * - Otherwise, it will navigate to the `homePath` (default '/').
 * - If currently on the `homePath` and no `targetBackUrl` is set,
 * it will attempt to close the PWA.
 *
 * @param options Configuration for the back navigation.
 */
export function useControlledBackNavigation(options?: BackNavigationOptions) {
	const { targetBackUrl, homePath = '/' } = options || {};
	let isActive = $state(true); // Use Svelte 5 $state rune for reactivity if needed externally or for cleanup logic

	// $effect rune for lifecycle management (setup and cleanup)
	$effect(() => {
		if (!isActive) return;

		beforeNavigate((navigation) => {
			if (!isActive) return;

			// Check if this navigation was triggered by a back button (popstate)
			// or a swipe gesture that simulates a back navigation.
			// SvelteKit's navigation.type for back/forward is 'popstate'
			// For this specific PWA back button control, we are primarily interested in 'popstate'.
			// However, `navigation.willUnload` might also be relevant if it's an external back.
			// We focus on in-app back behavior.
			if (navigation.type === 'popstate') {
				const currentPagePath = page.url.pathname;

				if (targetBackUrl) {
					navigation.cancel(); // Cancel the default back navigation
					goto(targetBackUrl, { replaceState: true }); // Navigate to the specified URL
					console.log('Going back to manual URL: ', targetBackUrl);
				} else if (currentPagePath !== homePath) {
					navigation.cancel();
					goto(homePath, { replaceState: true }); // Navigate to home
					console.log('Going back to home URL: ', homePath);
				} else {
					// On home page, and no specific targetBackUrl, attempt to close the PWA
					// This is a best-effort attempt, as browser support/behavior can vary.
					// For PWAs that are "installed", this has a higher chance of working
					// if the history stack is minimal.
					navigation.cancel(); // Cancel any potential default navigation first

					// Attempt to close. This might not work in all browser contexts.
					// Especially if the PWA is just a tab in a browser.
					// It's more likely to work for installed PWAs on mobile.
					try {
						window.close();
						// If window.close() doesn't work (e.g. due to browser restrictions),
						// the app will remain on the home page. You might want to add
						// a small delay and then try a less direct method, or inform the user.
						// For example, some PWAs use `navigator.app.exitApp()` if available,
						// but this is not a standard web API.
						// For now, we stick to window.close().
					} catch (e) {
						console.warn(
							'Attempted to close the PWA, but window.close() was blocked or failed.',
							e
						);
						// Optionally, navigate to a "confirm exit" page or show a message
					}
				}
			}
		});

		// Cleanup function for $effect
		return () => {
			// No unsubscribe needed for beforeNavigate as it returns void
		};
	});

	// Function to deactivate the hook if needed from the component
	function deactivate() {
		isActive = false;
	}

	return {
		deactivate
	};
}
