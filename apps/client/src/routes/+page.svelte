<script lang="ts">
import { goto } from "$app/navigation";
import Button from "$components/ui/button/button.svelte";
import type { PageData } from "./$types";
import SecurityCard from "$components/security-card.svelte";
import PullRequestCard from "$components/pull-request-card.svelte";
import ProductCard from "$components/product-card.svelte";

export let data: PageData;
const pullRequests = data.props.pullRequests;

function routeToProducts() {
	goto("/products/create");
}

function routeToProduct(id: string) {
	goto(`/products/${id}`);
}
</script>

<h1 class="heading-1">Dashboard</h1>

<div>
    <a class="text-xs text-link" href="/products/create">Add additional products</a>
</div>

{#if data.props.securityAdvisories.length > 0}
<div>
    <h2 class="font-semibold my-4">Security Advisories</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {#each data.props.securityAdvisories as advisory}
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
    

{#if data.props.products.length > 0}
    <h2 class="font-semibold my-4">Products ({data.props.products.length})</h2>
   
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {#each data.props.products as product}
            <ProductCard product={product} />
        {/each}
    </div>
   
{:else}
    <h2>No products found, create your first product</h2>   
    <Button on:click={routeToProducts}>Create</Button>
{/if}


<svelte:head>
    <title>Dashboard | Squire</title>
</svelte:head>