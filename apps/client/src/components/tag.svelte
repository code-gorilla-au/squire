<script lang="ts">
import { cn } from "$lib/utils";
import type { Snippet } from "svelte";

let { children, class: className } = $props<{
	children: Snippet;
	class?: string;
}>();
</script>

<span class={cn("text-xs bg-muted p-1 text-muted-foreground rounded-lg", className)}>
    {@render children?.()}
</span>