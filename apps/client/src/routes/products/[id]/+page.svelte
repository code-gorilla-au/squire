<script lang="ts">
import Card from "$components/ui/card/card.svelte";
import type { PageData } from "./$types";

export let data: PageData;
</script>

<h1>Product: {data.props.product.name} </h1>

<div>

    <Card>

    </Card>
</div>

<svelte:head>
    <title>Product | Squire</title>
</svelte:head>