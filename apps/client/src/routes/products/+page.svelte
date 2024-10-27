<script lang="ts">
import ProductCard from "$components/product-card.svelte";
import type { PageData } from "./$types";

export let data: PageData;
const products = data.props.products;
</script>

<h1 class="heading-1">Products</h1>

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {#each products as product }
        <a href={`/products/${product.id}`} >
            <ProductCard product={product} />
        </a>
    {/each}
</div>