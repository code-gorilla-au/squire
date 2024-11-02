<script lang="ts">
import PullRequestCard from "$components/pull-request-card.svelte";
import SecurityCard from "$components/security-card.svelte";
import Tag from "$components/tag/tag.svelte";
import Card from "$components/ui/card/card.svelte";
import Grid from "$components/grid.svelte";
import EmptySlate from "$components/empty-slate.svelte";
import { Title } from "$components/title";

let { data } = $props();

const product = data.props.product;
const repos = data.props.repositories;
const secAdvisory = data.props.securityAdvisory;
const pullRequests = data.props.pullRequests;
</script>

<Title>
    Product: {data.props.product.name}
</Title>


<div class="my-10">
    <h3 class="font-semibold my-3">Open security issues ({secAdvisory.length})</h3>
    {#if secAdvisory.length > 0 }
        <Grid >
            {#each secAdvisory as sec }
                <SecurityCard security={sec} />
            {/each}
        </Grid>
    {:else}
        <EmptySlate title="No security advisories found" description="Stay safe and keep your dependencies up to date" />
    {/if}


</div>

<div class="my-10">
    <h3 class="font-semibold my-3">Open pull requests ({ pullRequests.length })</h3>
    {#if pullRequests.length > 0 }
        <Grid>
            {#each pullRequests as pullRequest }
                <PullRequestCard pullRequest={pullRequest} />
            {/each}
        </Grid>
    {:else}
        <EmptySlate title="No open pull requests" />
    {/if}    

  
</div>

<div class="my-10">
    <h3 class="font-semibold my-3">Repositories ({repos.length})</h3>
    {#if repos.length > 0 }
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
    {:else}
        <EmptySlate caution title="No repositories found" description="Check if the product has the correct topic added" />
    {/if}
  

</div>

<svelte:head>
    <title>{product.name} | Squire</title>
</svelte:head>