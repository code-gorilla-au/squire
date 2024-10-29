<script lang="ts">
import { goto } from "$app/navigation";
import Tag from "$components/tag.svelte";
import Button from "$components/ui/button/button.svelte";
import Card from "$components/ui/card/card.svelte";
import { formatDistanceToNow } from "date-fns";
import type { PageData } from "./$types";
import { cn } from "$lib/utils";

export let data: PageData;

function routeToProducts() {
	goto("/products/create");
}

function routeToProduct(id: string) {
	goto(`/products/${id}`);
}

function styleTagBySeverity(severity: string) {
	switch (severity) {
		case "MODERATE":
			return "bg-yellow-100 text-yellow-800";
		case "HIGH":
			return "bg-destructive text-text-destructive-foreground";
		case "CRITICAL":
			return "bg-destructive text-text-destructive-foreground";
		default:
			return "";
	}
}
</script>

<h1 class="heading-1">Dashboard</h1>

<div>
    <a class="text-xs text-link" href="/products/create">Add additional products</a>
</div>

{#if data.props.securityAdvisories.length > 0}
<div>
    <h2 class="font-semibold my-4">Security Advisories</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {#each data.props.securityAdvisories as advisory}
            <a href={advisory.repoUrl} target="_blank">
                <Card class="p-3">
                    <h3 class="font-semibold mb-3">{advisory.packageName}</h3>
                    <p class="text-xs">Status: {advisory.state}</p>
                    <p class="text-xs">Created: {formatDistanceToNow(advisory.createdAt)}</p>
                    <Tag class="lowercase">{advisory.repoName}</Tag>
                    <Tag class={cn("lowercase", styleTagBySeverity(advisory.severity))}>{advisory.severity}</Tag>
                </Card>
            </a>
        {/each}
    </div>
</div>
    
{/if}

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