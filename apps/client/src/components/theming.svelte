<script lang="ts">
import { Button } from "$components/ui/button";
import { saveTheme, useTheme } from "$lib/theming";
import Moon from "lucide-svelte/icons/moon";
import Sun from "lucide-svelte/icons/sun";

let { class: className }: { class?: string } = $props();

let theme = useTheme();

function toggleTheme() {
	if (theme === "dark") {
		saveTheme("light");
		theme = "light";
		return;
	}

	theme = "dark";
	saveTheme("dark");
}
</script>
    
    <Button class={className} on:click={toggleTheme} variant="outline" size="icon">
      <Sun
        class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
      />
      <Moon
        class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
      />
      <span class="sr-only">Toggle theme</span>
    </Button>
    