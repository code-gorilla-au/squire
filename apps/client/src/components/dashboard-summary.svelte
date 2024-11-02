<script lang="ts">
import { goto } from "$app/navigation";
import Tag from "$components/tag.svelte";
import Button from "$components/ui/button/button.svelte";
import Card from "$components/ui/card/card.svelte";
import SecurityCard from "$components/security-card.svelte";
import PullRequestCard from "$components/pull-request-card.svelte";
import type { DashboardSummary } from "$lib/dashboard/types";

let { pullRequests, securityAdvisories, products }: DashboardSummary = $props();

async function routeToProducts() {
	await goto("/products/create");
}

async function routeToProduct(id: string) {
	await goto(`/products/${id}`);
}
</script>
    

{#if securityAdvisories?.length > 0}
    <div>
        <h2 class="font-semibold my-4">Security Advisories</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {#each securityAdvisories as advisory}
                <SecurityCard security={advisory} />
            {/each}
        </div>
    </div>
{/if}

{#if pullRequests.length > 0}

    <h2 class="font-semibold my-4" >Pull Requests ({pullRequests.length})</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {#each pullRequests as pr}
            <PullRequestCard pullRequest={pr} />
        {/each}
    </div>
    
{/if}
    

{#if products.length > 0}
    <h2 class="font-semibold my-4">Products ({products.length})</h2>
    
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
    <h2>No products found, create your first product</h2>   
    <Button on:click={routeToProducts}>Create</Button>
{/if}

