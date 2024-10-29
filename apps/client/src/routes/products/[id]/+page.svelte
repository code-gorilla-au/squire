<script lang="ts">
import { browser } from "$app/environment";
import Tag from "$components/tag.svelte";
import Card from "$components/ui/card/card.svelte";
import { formatDistanceToNow } from "date-fns";
import ChevronLeftIcon from "lucide-svelte/icons/chevron-left";
import type { PageData } from "./$types";
import PullRequestCard from "$components/pull-request-card.svelte";

export let data: PageData;

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
    <button on:click|preventDefault={goBack}>
        <ChevronLeftIcon  />
    </button>
    <h1 class="heading-1">Product: {data.props.product.name} </h1>
</div>

<div class="my-10">
    <h3 class="heading-3 my-3">Open security issues</h3>
    <div  class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {#each secAdvisory as sec }
            <a href={sec.repoUrl} target="_blank">
                <Card class="p-3">
                    <h3 class="font-semibold underline capitalize mb-2">{sec.packageName}</h3>
                    <div class="text-sm">
                        <div>
                            <span class="font-semibold">Severity:</span>
                            <span class=" lowercase">{sec.severity}</span>
                        </div>
                        <div>
                            <span class="font-semibold">Status:</span>
                            <span class=" lowercase">{sec.state}</span>
                        </div>
                        <div>
                            <span class="font-semibold">Last update:</span>
                            <span class=" lowercase">{formatDistanceToNow(sec.updatedAt)}</span>
                        </div>
                    </div>
                    <Tag>{sec.repoName}</Tag>
                </Card>
            </a>
        {/each}
    </div>
</div>

<div class="my-10">
    <h3 class="heading-3 my-3">Open pull requests</h3>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {#each pullRequests as pullRequest }
            <PullRequestCard pullRequest={pullRequest} />
        {/each}
    </div>
</div>

<div class="my-10">
    <h3 class="heading-3 my-3">Repositories for {product.name}</h3>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {#each repos as repo }
        <a href={repo.url} target="_blank">
            <Card class="p-2">
                <h3 class="text-sm font-semibold underline capitalize mb-2">{repo.name}</h3>
                <Tag >{repo.owner}</Tag>
                <Tag >{repo.topic}</Tag>
            </Card>
        </a>
        {/each}
    </div>

</div>

<svelte:head>
    <title>{product.name} | Squire</title>
</svelte:head>