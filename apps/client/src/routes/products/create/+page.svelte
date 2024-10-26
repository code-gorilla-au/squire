<script lang="ts">
import Button from "$components/ui/button/button.svelte";
import { Input } from "$components/ui/input";
import { Label } from "$components/ui/label";
import type { ActionData } from "./$types";

export let form: ActionData;
</script>


<h1 class="heading-1">Create Product</h1>

<div>
    <form method="POST">
        <Label>
            Name
            <Input required name="name"  />
        </Label>
        <Label>
            Tag
            <Input required name="tags"  />
        </Label>
        {#if form?.success == false}
            <p  class="text-destructive">Form has errors</p>
            <p>{JSON.stringify(form?.errors)}</p>
        {/if}
        <Button type="submit">Submit</Button>
    </form>
</div>

<svelte:head>
    <title>Create Product | Squire</title>
</svelte:head>