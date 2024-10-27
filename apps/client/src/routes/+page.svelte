<script lang="ts">
import { goto } from "$app/navigation";
import Tag from "$components/tag.svelte";
import Button from "$components/ui/button/button.svelte";
import Card from "$components/ui/card/card.svelte";
import type { PageData } from "./$types";

export let data: PageData;

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

{#if data.props.products.length > 0}
    <h2 class="font-semibold my-4">Products ({data.props.products.length})</h2>
   
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {#each data.props.products as product}
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


<svelte:head>
    <title>Dashboard | Squire</title>
</svelte:head>