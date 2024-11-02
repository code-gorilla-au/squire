<script lang="ts">
import type { DashboardSummary } from "$lib/dashboard/types.js";
import { source } from "sveltekit-sse";
import { derived } from "svelte/store";
import { ShieldEllipsis } from "lucide-svelte";
import { EVENT_DASHBOARD_SUMMARY_UPDATE } from "$lib/events.js";
import Dashboard from "$components/dashboard-summary.svelte";

const eventSource = source("/events/dashboard-summary");
const channel = eventSource.select(EVENT_DASHBOARD_SUMMARY_UPDATE);
const summary = channel.transform((value: string) => {
	const d = JSON.parse(value) as DashboardSummary;
	return {
		pullRequests: d.pullRequests ?? [],
		securityAdvisories: d.securityAdvisories ?? [],
		products: d.products ?? [],
	};
});

const pullRequests = derived(
	summary,
	($summary?) => $summary?.pullRequests ?? [],
);
const securityAdvisories = derived(
	summary,
	($summary?) => $summary?.securityAdvisories ?? [],
);
const products = derived(summary, ($summary?) => $summary?.products ?? []);
</script>

<h1 class="heading-1">Dashboard</h1>

<div>
    <a class="text-xs text-link" href="/products/create">Add additional products</a>
</div>

{#if $summary === null}
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