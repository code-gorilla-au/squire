<script lang="ts">
import { browser } from "$app/environment";
import PullRequestCard from "$components/pull-request-card.svelte";
import SecurityCard from "$components/security-card.svelte";
import Tag from "$components/tag.svelte";
import Card from "$components/ui/card/card.svelte";
import ChevronLeftIcon from "lucide-svelte/icons/chevron-left";
import Grid from "$components/grid.svelte";

let { data } = $props();

const product = data.props.product;
const repos = data.props.repositories;
const secAdvisory = data.props.securityAdvisory;
const pullRequests = data.props.pullRequests;

function goBack() {
	if (!browser) {
		return;
	}

	window.history.back();
}
</script>

<div class="flex items-center">
    <button onclick={goBack}>
        <ChevronLeftIcon  />
    </button>
    <h1 class="heading-1">Product: {data.props.product.name} </h1>
</div>

<div class="my-10">
    {#if secAdvisory.length > 0 }
        <h3 class="heading-3 my-3">Open security issues</h3>
    {:else}
        <h3 class="heading-3 my-3">No security issues</h3>
    {/if}

    <Grid >
        {#each secAdvisory as sec }
            <SecurityCard security={sec} />
        {/each}
    </Grid>
</div>

<div class="my-10">
    {#if pullRequests.length > 0 }
        <h3 class="heading-3 my-3">Open pull requests</h3>
    {:else}
        <h3 class="heading-3 my-3">No pull requests</h3>
    {/if}    

    <Grid>
        {#each pullRequests as pullRequest }
            <PullRequestCard pullRequest={pullRequest} />
        {/each}
    </Grid>
</div>

<div class="my-10">
    <h3 class="heading-3 my-3">Repositories for {product.name}</h3>
    <Grid >
        {#each repos as repo }
        <a href={repo.url} target="_blank">
            <Card class="p-2">
                <h3 class="text-sm font-semibold underline capitalize mb-2">{repo.name}</h3>
                <Tag >{repo.owner}</Tag>
                <Tag >{repo.topic}</Tag>
            </Card>
        </a>
        {/each}
    </Grid>

</div>

<svelte:head>
    <title>{product.name} | Squire</title>
</svelte:head>