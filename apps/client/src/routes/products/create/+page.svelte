<script lang="ts">
import Input from "$components/ui/input/input.svelte";
import Label from "$components/ui/label/label.svelte";

const form = {
	name: "",
	tags: [],
};
</script>


<h1 class="heading-1">Create Product</h1>

<div>
    <form>
        <Label>
            Name
            <Input bind:value={form.name} />
        </Label>
    </form>
</div>

<svelte:head>
    <title>Create Product | Squire</title>
</svelte:head>