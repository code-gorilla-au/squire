<script lang="ts">
import { ProductSummary } from "$components/products";

let { data } = $props();

const product = $derived(data.product);
const repos = $derived(data.repositories);
const secAdvisory = $derived(data.securityAdvisory);
const pullRequests = $derived(data.pullRequests);

const insights = $derived(data.insights);
</script>

<ProductSummary {product} {repos} {secAdvisory} {pullRequests} {insights} />

<svelte:head>
    <title>{product.name} | Squire</title>
</svelte:head>