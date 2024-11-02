<script lang="ts">
import { goto } from "$app/navigation";
import PullRequestCard from "$components/pull-request-card.svelte";
import SecurityCard from "$components/security-card.svelte";
import Button from "$components/ui/button/button.svelte";
import type { DashboardSummary } from "$lib/dashboard/types";
import { ShieldAlert } from "lucide-svelte";
import EmptySlate from "./empty-slate.svelte";
import Grid from "./grid.svelte";
import ProductCard from "./product-card.svelte";

let { pullRequests, securityAdvisories, products }: DashboardSummary = $props();

async function routeToCreateProduct() {
	await goto("/products/create");
}
</script>
    


    <h2 class="font-semibold my-4">Security Advisories ({securityAdvisories?.length})</h2>
{#if securityAdvisories?.length > 0}
    <Grid >
        {#each securityAdvisories as advisory}
            <SecurityCard security={advisory} />
        {/each}
    </Grid>
{:else}
    <EmptySlate title="No security advisories found" description="Stay safe and keep your dependencies up to date" />
{/if}



    <h2 class="font-semibold my-4" >Open pull requests ({pullRequests.length})</h2>
{#if pullRequests.length > 0}    
    <Grid >
        {#each pullRequests as pr}
            <PullRequestCard pullRequest={pr} />
        {/each}
    </Grid>
{:else}
    <EmptySlate title="No open pull requests" />
{/if}

    


    <h2 class="font-semibold my-4">Products ({products.length})</h2>
{#if products.length > 0}    
    <Grid >
        {#each products as product}
            <ProductCard product={product} />
        {/each}
    </Grid>
{:else}
    <div class=" bg-muted rounded-md p-4 text-sm flex items-center flex-col justify-center">
        <ShieldAlert  size="32" /> 
        <h3 class="my-2">No products found, create your first product</h3>
        <Button on:click={routeToCreateProduct}>Create</Button>
    </div> 
   
{/if}

