<script lang="ts">
import Title from "$components/title/title.svelte";
import Button from "$components/ui/button/button.svelte";
import { Input } from "$components/ui/input";
import { Label } from "$components/ui/label";
import type { ActionData } from "./$types";

let form: ActionData = $props();
</script>


<Title>Create Product</Title>

<div class="">
    <form class="my-4 max-w-sm mx-auto" method="POST">
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
        <Button class="mt-4" type="submit">Submit</Button>
    </form>
</div>

<svelte:head>
    <title>Create Product | Squire</title>
</svelte:head>