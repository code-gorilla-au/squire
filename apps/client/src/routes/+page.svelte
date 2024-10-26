<script lang="ts">
import { goto } from "$app/navigation";
import Button from "$components/ui/button/button.svelte";
import type { PageData } from "./$types";

export let data: PageData;

function routeToProducts() {
	goto("/products/create");
}
</script>

<h1 class="heading-1">Dashboard</h1>

{#if data.props.products.length > 0}
    <h2>Products</h2>
    <ul>
        {#each data.props.products as product}
            <li>{product.name}</li>
        {/each}
    </ul>
{:else}
    <h2>No products found, create your first product</h2>   
    <Button on:click={routeToProducts}>Create</Button>
{/if}


<svelte:head>
    <title>Dashboard | Squire</title>
</svelte:head>