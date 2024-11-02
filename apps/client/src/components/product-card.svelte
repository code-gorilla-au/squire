<script lang="ts">
import Tag from "$components/tag.svelte";
import Card from "$components/ui/card/card.svelte";
import { formatDistanceToNow } from "date-fns";
import PencilIcon from "lucide-svelte/icons/pencil";
import type { ProductDto } from "squire";

export let product: ProductDto;
</script>

<a href={`/products/${product.id}`}>
    <Card class="p-3 hover:bg-accent/30">
        <div class="flex justify-between">
            <h3 class="font-semibold capitalize mb-2">{product.name}</h3>
            <a href={`/products/${product.id}/edit`} class="bg-muted text-muted-foreground rounded-md shadow-sm flex items-center p-2 hover:bg-primary/90">
                <PencilIcon size={16} />
            </a>
        </div>
        <div class="text-xs">
            <div class="mb-2">
                <span class="font-semibold">Last updated:</span>
                <span class="">{formatDistanceToNow(product.updatedAt)}</span>
            </div>  
            <Tag >{product.tags}</Tag>
        </div>
    </Card>
</a>
