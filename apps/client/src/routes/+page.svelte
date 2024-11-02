<script lang="ts">
import Dashboard from "$components/dashboard-summary.svelte";
import { ShieldEllipsis } from "lucide-svelte";
import { derived } from "svelte/store";
import { summaryStore } from "$lib/dashboard/store";

const pullRequests = derived(
	summaryStore,
	($summary?) => $summary?.pullRequests ?? [],
);

const securityAdvisories = derived(
	summaryStore,
	($summary?) => $summary?.securityAdvisories ?? [],
);

const products = derived(summaryStore, ($summary?) => $summary?.products ?? []);
</script>

<h1 class="heading-1">Dashboard</h1>

<div>
    <a class="text-xs text-link" href="/products/create">Add additional products</a>
</div>

{#if $summaryStore === null}
    <div class="w-full my-44 flex flex-col items-center justify-center">
        <ShieldEllipsis size="150" />
        <h3 class="heading-3">Loading...</h3>
    </div>
{:else} 
    <Dashboard pullRequests={$pullRequests} securityAdvisories={$securityAdvisories} products={$products} />
{/if}



<svelte:head>
    <title>Dashboard | Squire</title>
</svelte:head>