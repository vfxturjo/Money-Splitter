<script lang="ts">
	import InputParts from './inputParts.svelte';
</script>

<div class="container mx-auto grid grid-cols-1">
	<!-- INTRO SECTION -->
	<div class="*:p-2">
		<h1 class="h1">Welcome to Money Splitter App!</h1>
		<p>
			Ever shared costs with friends - maybe for a trip, dinner, or just splitting groceries - and
			ended up with a tangled mess of who owes what? We've all been there! Sometimes things don't
			split perfectly at the moment, and figuring out the fairest way to settle up later, especially
			with a group, can be a real headache.
		</p>

		<p>
			That's exactly what the Money Splitter App is for! It's your simple sidekick for handling
			group expenses. Just pop in the total cost and how many people are splitting it. The app
			figures out the basic split. Then, tell it who paid what. Shazam! The app instantly shows you
			the <mark class="mark">smartest</mark>
			way for everyone to pay each other back, cutting down on unnecessary transfers and making settling
			up smooth and easy. No more awkward money chats!
		</p>
	</div>

	<!-- Main input -->
	<div class="*:p-2">
		<InputParts />
	</div>
</div>
<!-- Footer -->
<!-- <footer class="bg-blue-500 p-4">(footer)</footer> -->
