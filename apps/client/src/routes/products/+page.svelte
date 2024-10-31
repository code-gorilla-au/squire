<script lang="ts">
import ProductCard from "$components/product-card.svelte";

let { data } = $props();
const products = data.props.products;
</script>

<h1 class="heading-1">Products</h1>
<div class="mb-4">
    <a class="text-xs text-link" href="/products/create">Add additional products</a>
</div>

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {#each products as product }
        <a href={`/products/${product.id}/edit`} >
            <ProductCard product={product} />
        </a>
    {/each}
</div>

<svelte:head>
    <title>Products | Squire</title>
</svelte:head>