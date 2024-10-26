<script lang="ts">
import "../app.css";
let { children } = $props();
</script>
<main class="flex">
	<aside class="bg-primary w-36 h-screen">
		<h3 class="text-primary-foreground font-bold text-2xl p-4">Squire</h3>
		<nav class="text-primary-foreground">
			<ul class="">
				<li><a href="/">Home</a></li>
				<li><a href="/products">Products</a></li>
			</ul>
		</nav>
	</aside>
	<div class="p-2">
		{@render children()}
	</div>
</main>

