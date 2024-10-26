<script>
import { goto } from "$app/navigation";
import Button from "$components/ui/button/button.svelte";

function routeToProducts() {
	goto("/products");
}
</script>

<h1>Dashboard</h1>

<Button on:click={routeToProducts}>Products</Button>

<svelte:head>
    <title>Dashboard | Squire</title>
</svelte:head>