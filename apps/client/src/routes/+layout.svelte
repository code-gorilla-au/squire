<script lang="ts">
import "../app.css";
import { navigating } from "$app/stores";
import Theme from "$components/theme.svelte";
import { Shield } from "lucide-svelte";
let { children } = $props();
</script>
<main class="">
	<nav class="dark:bg-accent dark:text-accent-foreground bg-primary shadow-md">
		<div class="mx-auto max-w-screen-lg flex items-center justify-between">
			<div class="flex items-center p-4">
				<Shield class="text-primary-foreground dark:text-accent-foreground" />
				<h3 class="font-bold text-2xl text-muted-foreground">Squire</h3>
			</div>
			<div class="mx-3 flex items-center">
				<div class="text-sm text-primary-foreground/90 dark:text-accent-foreground">
					<a class="underline" href="/">Home</a> |
					<a class="underline" href="/docs">Documentation</a> |
					<a class="underline" href="/products">Products</a>
				</div>
				<Theme class="ml-2" />
			</div>
		
		</div>
	</nav>
	{#if $navigating}
		<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
			<div class="bg-white p-4 rounded-lg">
				Loading...
			</div>
		</div>

	{:else}
		<div class="p-2 w-full h-screen overflow-auto max-w-screen-lg mx-auto">
			{@render children()}
		</div>
	{/if}

</main>

