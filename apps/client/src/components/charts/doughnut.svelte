<script lang="ts">
import { cn } from "$lib/utils.ts";
import Chart from "chart.js/auto";
import { onMount } from "svelte";
import { type ChartProps, chartColours } from "./types.ts";

let {
	id,
	class: className,
	labels,
	datasets,
	options = {
		responsive: true,
		maintainAspectRatio: true,
	},
}: ChartProps = $props();

let chartCanvas: HTMLCanvasElement;

onMount(() => {
	new Chart(chartCanvas, {
		type: "doughnut",
		data: {
			labels,
			datasets: datasets.map((dataset) => ({
				...dataset,
				backgroundColor: chartColours,
				borderColor: chartColours,
			})),
		},
		options,
	});
});
</script>
    
    <div class={cn("", className)}>
        <canvas  bind:this={chartCanvas} id={id}></canvas>
    </div>