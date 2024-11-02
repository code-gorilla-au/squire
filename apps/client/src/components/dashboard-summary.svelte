<script lang="ts">
import { goto } from "$app/navigation";
import PullRequestCard from "$components/pull-request-card.svelte";
import SecurityCard from "$components/security-card.svelte";
import Tag from "$components/tag.svelte";
import Button from "$components/ui/button/button.svelte";
import Card from "$components/ui/card/card.svelte";
import type { DashboardSummary } from "$lib/dashboard/types";
import { CircleCheckBig } from "lucide-svelte";
import { ShieldAlert } from "lucide-svelte";

let { pullRequests, securityAdvisories, products }: DashboardSummary = $props();

async function routeToProducts() {
	await goto("/products/create");
}

async function routeToProduct(id: string) {
	await goto(`/products/${id}`);
}
</script>
    


    <h2 class="font-semibold my-4">Security Advisories ({securityAdvisories?.length})</h2>
{#if securityAdvisories?.length > 0}
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {#each securityAdvisories as advisory}
            <SecurityCard security={advisory} />
        {/each}
    </div>
{:else}
    <div class=" bg-muted rounded-md p-4 text-sm flex items-center flex-col justify-center">
        <CircleCheckBig class="text-green-700" size="32" /> 
        <h3 class="my-2">No security advisories found</h3>
        <p class="text-xs text-muted-foreground">Stay safe and keep your dependencies up to date</p>
    </div> 
{/if}



    <h2 class="font-semibold my-4" >Open pull requests ({pullRequests.length})</h2>
{#if pullRequests.length > 0}    
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {#each pullRequests as pr}
            <PullRequestCard pullRequest={pr} />
        {/each}
    </div>
{:else}
    <div class=" bg-muted rounded-md p-4 text-sm flex items-center flex-col justify-center">
        <CircleCheckBig class="text-green-700" size="32" /> 
        <h3 class="my-2">No open pull requests</h3>
    </div> 
{/if}

    


    <h2 class="font-semibold my-4">Products ({products.length})</h2>
{#if products.length > 0}    
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {#each products as product}
            <Card on:click={(event: Event) => {
                event.preventDefault();
                routeToProduct(product.id)
            }} class="p-3 cursor-pointer">
                <h3 class="font-semibold">{product.name}</h3>
                <Tag>{product.tags}</Tag>
            </Card>
        {/each}
    </div>
{:else}
<div class=" bg-muted rounded-md p-4 text-sm flex items-center flex-col justify-center">
    <ShieldAlert  size="32" /> 
    <h3 class="my-2">No products found, create your first product</h3>
    <Button on:click={routeToProducts}>Create</Button>
</div> 
   
{/if}

