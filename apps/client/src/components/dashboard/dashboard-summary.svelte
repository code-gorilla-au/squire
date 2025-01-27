<script lang="ts">
import { goto } from "$app/navigation";
import PullRequestCard from "$components/pull-request-card.svelte";
import SecurityCard from "$components/security-card.svelte";
import Button from "$components/ui/button/button.svelte";
import type { DashboardSummary } from "$lib/dashboard/types";
import { ShieldAlert } from "lucide-svelte";
import EmptySlate from "../empty-slate.svelte";
import Grid from "$components/grid.svelte";
import ProductCard from "$components/product-card.svelte";
import * as Accordion from "$components/ui/accordion";

let { pullRequests, securityAdvisories, products }: DashboardSummary = $props();

async function routeToCreateProduct() {
	await goto("/products/create");
}
</script>
    
<Accordion.Root type="multiple" value={["securityAdvisories", "pullRequests", "products", "products"]} >
    <Accordion.Item class="my-4" value="securityAdvisories">
        <Accordion.Trigger data-state="open">
            <h2 class="font-semibold">Security Advisories ({securityAdvisories?.length})</h2>
        </Accordion.Trigger>
        <Accordion.Content>
            {#if securityAdvisories?.length > 0}
                <Grid >
                    {#each securityAdvisories as advisory}
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
            <h2 class="font-semibold" >Open pull requests ({pullRequests.length})</h2>
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
    
    <Accordion.Item class="my-4" value="products">
        <Accordion.Trigger>
            <h2 class="font-semibold">Products ({products.length})</h2>
        </Accordion.Trigger>
        <Accordion.Content>
            {#if products.length > 0}    
                <Grid >
                    {#each products as product}
                        <ProductCard product={product} />
                    {/each}
                </Grid>
            {:else}
                <div class="bg-muted rounded-md p-4 text-sm flex items-center flex-col justify-center">
                    <ShieldAlert  size="32" /> 
                    <h3 class="my-2">No products found, create your first product</h3>
                    <Button onclick={routeToCreateProduct}>Create</Button>
                </div> 
            {/if}
        </Accordion.Content>
    </Accordion.Item>     
</Accordion.Root>
