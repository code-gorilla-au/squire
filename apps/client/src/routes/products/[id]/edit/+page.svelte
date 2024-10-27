<script lang="ts" >
import { Label } from "$components/ui/label";
import type { PageData } from "./$types";

export let data: PageData;

const product = data.props.product;
</script>

<h1 class="heading-1">{product.name}</h1>

<div>
    <form action="update" method="post">
        <Label >
            Name
        </Label>
    </form>
</div>