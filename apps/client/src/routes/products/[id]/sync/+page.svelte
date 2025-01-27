<script lang="ts">
import { LoaderSquare } from "$components/loaders";
import { Title } from "$components/title";
import { type ApiError, HTTP_METHOD_POST } from "$lib/apis";
import { fetcher } from "$lib/apis/fetcher";
import CircleCheckBig from "lucide-svelte/icons/circle-check-big";
import { onMount } from "svelte";
import type { PageProps } from "./$types";

let { data }: PageProps = $props();

let product = $derived(data.product);

const syncState = $state<{ loading: boolean; error: Error | null }>({
	loading: true,
	error: null,
});

onMount(async () => {
	try {
		syncState.loading = true;

		await fetcher(`/api/products/${product?.id}/sync`, {
			method: HTTP_METHOD_POST,
		});
	} catch (error) {
		const err = error as ApiError;
		syncState.error = err;
	} finally {
		syncState.loading = false;
	}
});
</script>


<Title>{product?.name}</Title>

{#if !syncState.loading}
	<div class="mt-10 flex flex-col justify-center h-full items-center">
		<CircleCheckBig class="text-green-700 my-4" size="120" /> 
		<h2 class="heading-2">Product synced</h2>
		<p>Product has been synced successfully, <a class="text-link" href={`/products/${product?.id}`}>see product dashboard</a></p>
	</div>

{:else}
    
    <div class="mt-10 flex flex-col justify-center h-full items-center">
        <LoaderSquare />
        <h2 class="heading-2">Syncing product please wait</h2>
    </div>
{/if}


{#if syncState.error}
    <p>Could not sync product: {syncState.error.message}</p>
{/if}


<svelte:head>
    <title>{product?.name} | Squire</title>
</svelte:head>