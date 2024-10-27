<script lang="ts">
import "../app.css";
import { navigating } from "$app/stores";
let { children } = $props();
</script>
<main class="flex">
	<aside class="bg-primary w-36 h-screen rounded-md shadow-md">
		<h3 class="text-primary-foreground font-bold text-2xl p-4">Squire</h3>
		<nav class="text-primary-foreground">
			<ul class="">
				<li><a href="/">Home</a></li>
				<li><a href="/products">Products</a></li>
			</ul>
		</nav>
	</aside>
	
	{#if $navigating}
		<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
			<div class="bg-white p-4 rounded-lg">
				Loading...
			</div>
		</div>

	{:else}
		<div class="p-2 w-full h-screen overflow-auto">
			{@render children()}
		</div>
	{/if}

</main>

