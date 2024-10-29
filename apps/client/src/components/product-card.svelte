<script lang="ts">
import Tag from "$components/tag.svelte";
import Card from "$components/ui/card/card.svelte";
import { formatDistanceToNow } from "date-fns";
import PencilIcon from "lucide-svelte/icons/pencil";
import type { ProductDto } from "squire";

export let product: ProductDto;
</script>

<Card class="p-3">
    <div class="flex justify-between">
        <h3 class="font-semibold capitalize mb-2">{product.name}</h3>
        <PencilIcon size={16} />
    </div>
    <div class="text-xs">
        <div class="mb-2">
            <span class="font-semibold">Last updated:</span>
            <span class="">{formatDistanceToNow(product.updatedAt)}</span>
        </div>  
        <Tag >{product.tags}</Tag>
    </div>
</Card>