<script lang="ts">
import ProductCard from "$components/product-card.svelte";
import Title from "$components/title.svelte";

let { data } = $props();
const products = data.props.products;
</script>

<Title>
    Products
</Title>
<div class="mb-4">
    <a class="text-xs text-link" href="/products/create">Add additional products</a>
</div>

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {#each products as product }
        <ProductCard product={product} />
    {/each}
</div>

<svelte:head>
    <title>Products | Squire</title>
</svelte:head>