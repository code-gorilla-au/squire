<script>
import { goto } from "$app/navigation";
import Button from "$components/ui/button/button.svelte";

function routeToProducts() {
	goto("/products");
}
</script>

<h1>Squire</h1>

<Button on:click={routeToProducts}>Products</Button>

<svelte:head>
    <title>Squire</title>
</svelte:head>