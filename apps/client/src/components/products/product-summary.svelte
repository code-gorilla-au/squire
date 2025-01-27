<script lang="ts">
import EmptySlate from "$components/empty-slate.svelte";
import { FileDown } from "lucide-svelte";
import Grid from "$components/grid.svelte";
import PullRequestCard from "$components/pull-request-card.svelte";
import SecurityCard from "$components/security-card.svelte";
import { Tag } from "$components/tag";
import { Title } from "$components/title";
import * as Accordion from "$components/ui/accordion";
import Card from "$components/ui/card/card.svelte";
import type {
	ProductDto,
	PullRequestDto,
	RepositoryDto,
	SecurityAdvisoryDto,
} from "products";
import { formatFromNow } from "time";

type Props = {
	product: ProductDto;
	repos: RepositoryDto[];
	secAdvisory: SecurityAdvisoryDto[];
	pullRequests: PullRequestDto[];
};

let { product, repos, secAdvisory, pullRequests }: Props = $props();

function downloadSummaryReport() {
	const blob = new Blob(
		[
			JSON.stringify({
				product,
				repositories: repos,
				security_advisory: secAdvisory,
				pull_requests: pullRequests,
			}),
		],
		{ type: "application/json" },
	);
	return URL.createObjectURL(blob);
}
</script>
        
    <div class="flex items-baseline">
        <Title>
            Product: {product.name}
        </Title>
       <a class="flex items-center ml-3 p-2 rounded-full bg-accent/70 hover:bg-accent" href={downloadSummaryReport()} download={`${product.name}_summary.json`}>
            <FileDown />
       </a>
    </div>
    <div class="flex justify-between items-baseline">
        <p class="text-xs text-muted-foreground">Last updated: {formatFromNow(product.createdAt)}</p>
    </div>
    
    <Accordion.Root type="multiple" value={["secAdvisory", "pullRequests", "repos"]}>
        <Accordion.Item class="my-4" value="secAdvisory">
            <Accordion.Trigger data-state="open">
                <h2 class="font-semibold">Security Advisories ({secAdvisory?.length})</h2>
            </Accordion.Trigger>
            <Accordion.Content>
                {#if secAdvisory?.length > 0}
                    <Grid >
                        {#each secAdvisory as advisory}
                            <SecurityCard security={advisory} />
                        {/each}
                    </Grid>
                {:else}
                    <EmptySlate title="No security advisories found" description="Stay safe and keep your dependencies up to date" />
                {/if}
            </Accordion.Content>
        </Accordion.Item> 
    
        <Accordion.Item class="my-4" value="pullRequests">
            <Accordion.Trigger>
                <h2 class="font-semibold">Open pull requests ({pullRequests.length})</h2>
            </Accordion.Trigger>
            <Accordion.Content>
                {#if pullRequests.length > 0}    
                    <Grid >
                        {#each pullRequests as pr}
                            <PullRequestCard pullRequest={pr} />
                        {/each}
                    </Grid>
                {:else}
                    <EmptySlate title="No open pull requests" />
                {/if}
            </Accordion.Content>
        </Accordion.Item> 
    
        <Accordion.Item class="my-4" value="repos">
            <Accordion.Trigger>
                <h2 class="font-semibold">Repositories ({repos.length})</h2>
            </Accordion.Trigger>
            <Accordion.Content>
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
            </Accordion.Content>
        </Accordion.Item>
    </Accordion.Root>
        
        
    <svelte:head>
        <title>{product.name} | Squire</title>
    </svelte:head>