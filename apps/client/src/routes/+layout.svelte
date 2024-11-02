<script lang="ts">
import "../app.css";
import { navigating } from "$app/stores";
import { Shield } from "lucide-svelte";
let { children } = $props();
</script>
<main class="">
	<nav class="flex items-center bg-primary text-primary-foreground justify-between shadow-md">
		<div class="flex items-center p-4">
			<Shield />
			<h3 class="font-bold text-2xl text-muted-foreground">Squire</h3>
		</div>
		<div class="mx-3 text-sm">
			<a class="underline" href="/">Home</a> |
			<a class="underline" href="/docs">Documentation</a> |
			<a class="underline" href="/products">Products</a>
		</div>
	</nav>
	{#if $navigating}
		<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
			<div class="bg-white p-4 rounded-lg">
				Loading...
			</div>
		</div>

	{:else}
		<div class="p-2 w-full h-screen overflow-auto max-w-screen-lg">
			{@render children()}
		</div>
	{/if}

</main>

