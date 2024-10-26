<script lang="ts">
import { goto } from "$app/navigation";
import Button from "$components/ui/button/button.svelte";
import Card from "$components/ui/card/card.svelte";
import type { PageData } from "./$types";

export let data: PageData;

function routeToProducts() {
	goto("/products/create");
}
</script>

<h1 class="heading-1">Dashboard</h1>

<div>
    <a class="text-xs text-link" href="/products/create">Add additional products</a>
</div>

{#if data.props.products.length > 0}
   
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {#each data.props.products as product}
        <Card class="p-3">
            <h3 class="font-semibold">{product.name}</h3>
            <span class=" text-xs bg-muted p-1 text-muted-foreground">{product.tags}</span>
        </Card>
    {/each}
</div>
   
    

{:else}
    <h2>No products found, create your first product</h2>   
    <Button on:click={routeToProducts}>Create</Button>
{/if}


<svelte:head>
    <title>Dashboard | Squire</title>
</svelte:head>