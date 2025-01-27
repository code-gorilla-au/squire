<script lang="ts">
import Dashboard from "$components/dashboard-summary.svelte";
import InsightsCard from "$components/insights-card.svelte";
import { summaryStore } from "$lib/dashboard/store";
import { ShieldEllipsis } from "lucide-svelte";
import { derived as storeDerived } from "svelte/store";

const pullRequests = storeDerived(
	summaryStore,
	($summary?) => $summary?.pullRequests ?? [],
);

const securityAdvisories = storeDerived(
	summaryStore,
	($summary?) => $summary?.securityAdvisories ?? [],
);

const products = storeDerived(
	summaryStore,
	($summary?) => $summary?.products ?? [],
);

const { data } = $props();

const insights = $derived(data.insights);
</script>

<h1 class="heading-1">Dashboard</h1>

<div>
    <a class="text-xs text-link" href="/products/create">Add additional products</a>
</div>

<h3 class="font-bold my-4">Insights (last 90 days)</h3>
<InsightsCard insights={insights} />

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