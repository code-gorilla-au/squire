<script lang="ts">
import Card from "$components/ui/card/card.svelte";
import { format } from "date-fns";
import type { ProductDto } from "squire";

export let product: ProductDto;
</script>

<Card class="p-3">
    <h3 class="font-semibold capitalize mb-2">{product.name}</h3>
    <div class="text-sm">
        <div>
            <span class="font-semibold">Last updated:</span>
            <span class="">{format(product.updatedAt, 'yyyy-MM-dd')}</span>
        </div>  
    </div>
</Card>