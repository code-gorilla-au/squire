<script lang="ts">
import type { PageData } from "./$types";

export let data: PageData;
</script>

<h1>Product: {data.props.product.name} </h1>

<svelte:head>
    <title>Product | Squire</title>
</svelte:head>