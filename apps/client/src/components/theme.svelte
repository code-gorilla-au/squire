<script lang="ts">
import { Button } from "$components/ui/button";
import { cn } from "$lib";
import { useTheme } from "$lib/theme";
import Moon from "lucide-svelte/icons/moon";
import Sun from "lucide-svelte/icons/sun";
import { get } from "svelte/store";

let { class: className }: { class?: string } = $props();

const theme = useTheme();

function toggleTheme() {
	if (get(theme.currentTheme) === "dark") {
		theme.update("light");
		return;
	}
	theme.update("dark");
}
</script>
    
    <Button class={cn("dark:bg-accent dark:text-accent-foreground dark:border-accent dark:hover:bg-primary dark:hover:text-primary-foreground bg-primary text-primary-foreground border-primary",className)} on:click={toggleTheme} variant="outline" size="icon">
      <Sun
        class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
      />
      <Moon
        class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
      />
      <span class="sr-only">Toggle theme</span>
    </Button>
    