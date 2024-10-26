<script lang="ts">
import { goto } from "$app/navigation";
import Button from "$components/ui/button/button.svelte";
import type { PageData } from "./$types";

export let data: PageData;

function routeToProducts() {
	goto("/products");
}
</script>

<h1>Dashboard</h1>

<h4>total products {JSON.stringify(data)}</h4>

<Button on:click={routeToProducts}>Products</Button>

<svelte:head>
    <title>Dashboard | Squire</title>
</svelte:head>