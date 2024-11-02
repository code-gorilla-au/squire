<script lang="ts">
import CircleCheckBig from "lucide-svelte/icons/circle-check-big";
import ShieldAlert from "lucide-svelte/icons/shield-alert";

type EmptySlateProps = {
	title: string;
	description?: string;
	caution?: boolean;
};

const { title, description, caution = false }: EmptySlateProps = $props();
</script>

<div class=" bg-muted rounded-md p-4 text-sm flex items-center flex-col justify-center">
    {#if caution}
        <ShieldAlert class="text-muted-foreground" size="32" />
    {:else}
        <CircleCheckBig class="text-green-700" size="32" /> 
    {/if}

    <h3 class="my-2">{title}</h3>
    {#if description}
        <p class="text-xs text-muted-foreground">{description}</p>
    {/if}
</div> 