<script lang="ts">
import { browser } from "$app/environment";
import ChevronLeftIcon from "lucide-svelte/icons/chevron-left";
import type { Snippet } from "svelte";

let { children }: { children: Snippet } = $props();

function goBack() {
	if (!browser) {
		return;
	}

	window.history.back();
}
</script>

<div class="flex items-center">
    <button onclick={goBack}>
        <ChevronLeftIcon  />
    </button>
    <h1 class="heading-1">{@render children()}</h1>
</div>