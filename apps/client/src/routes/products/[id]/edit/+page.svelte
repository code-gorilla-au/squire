<script lang="ts" >
import { Button } from "$components/ui/button";
import { Input } from "$components/ui/input";
import { Label } from "$components/ui/label";
import type { ActionData, PageData } from "./$types";

export let data: PageData;
export let form: ActionData;

const product = data.props.product;
</script>

<h1 class="heading-1">{product.name}</h1>

<div>
    <form class="my-4 max-w-sm" method="post" action="?/update">
        <Label>
            Name
            <Input required name="name" value={product.name}  />
        </Label>
        <Label>
            Tag
            <Input required name="tags" value={product.tags}  />
        </Label>
        {#if form?.success == false}
            <p  class="text-destructive">Form has errors</p>
            <p>{JSON.stringify(form?.errors)}</p>
        {/if}        
        <div class="mt-4 flex items-center justify-between">
            <Button formaction="?/update" type="submit">Update</Button>
            <Button class="bg-muted text-muted-foreground" formaction="?/remove" type="submit">Delete</Button>
        </div>
    </form>
</div>

<svelte:head>
    <title>Edit {product.name} | Squire</title>
</svelte:head>