<script lang="ts">
import Card from "$components/ui/card/card.svelte";
import ChevronLeftIcon from "lucide-svelte/icons/chevron-left";
import type { PageData } from "./$types";
import { browser } from "$app/environment";
import Tag from "$components/tag.svelte";

export let data: PageData;

const product = data.props.product;
const repos = data.props.repositories;
const secAdvisory = data.props.securityAdvisory;

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

<div>
    <h3 class="heading-3 my-3">Open security issues</h3>
    <div>
        {#each secAdvisory as sec }
        <Card class="p-2">
            <h3 class="font-semibold underline capitalize mb-2">{sec.id}</h3>
            <Tag >{sec.repoName}</Tag>
        </Card>
        {/each}
    </div>
</div>

<div>
    <h3 class="heading-3 my-3">Repositories for {product.name}</h3>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {#each repos as repo }
        <a href={repo.url}>
            <Card class="p-2">
                <h3 class="font-semibold underline capitalize mb-2">{repo.name}</h3>
                <Tag >{repo.owner}</Tag>
                <Tag >{repo.topic}</Tag>
            </Card>
        </a>
        {/each}
    </div>

</div>

<svelte:head>
    <title>Product | Squire</title>
</svelte:head>