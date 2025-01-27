<script lang="ts">
import { cn } from "$lib/utils";

interface Props {
	class?: string;
	strokeWidth?: number;
	rectangleWith?: number;
	rectangleHeight?: number;
}

let {
	class: className,
	strokeWidth = 15,
	rectangleWith = 30,
	rectangleHeight = 30,
}: Props = $props();

const squareStyle =
	"dark:text-accent dark:stroke-accent text-primary stroke-primary fill-current h-48 w-48";
</script>

<svg class={cn(squareStyle, className)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    <rect stroke-width={strokeWidth} width={rectangleWith} height={rectangleHeight} x="25" y="50">
        <animate attributeName="y" calcMode="spline" dur="2" values="50;120;50;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate>
    </rect>
    <rect stroke-width={strokeWidth} width={rectangleWith} height={rectangleHeight} x="85" y="50">
        <animate attributeName="y" calcMode="spline" dur="2" values="50;120;50;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate>
    </rect>
    <rect stroke-width={strokeWidth} width={rectangleWith} height={rectangleHeight} x="145" y="50">
        <animate attributeName="y" calcMode="spline" dur="2" values="50;120;50;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate>
    </rect>
</svg>