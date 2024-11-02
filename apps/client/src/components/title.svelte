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
    <button class="bg-muted p-1 flex items-center justify-center rounded-full hover:bg-primary/90 hover:text-primary-foreground" onclick={goBack}>
        <ChevronLeftIcon  />
    </button>
    <h1 class="ml-1 heading-1">{@render children?.()}</h1>
</div>