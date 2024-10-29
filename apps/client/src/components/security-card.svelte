<script lang="ts">
import Tag from "$components/tag.svelte";
import Card from "$components/ui/card/card.svelte";
import { cn } from "$lib/utils";
import { formatDistanceToNow } from "date-fns";
import type { SecurityAdvisoryDto } from "squire";

export let security: SecurityAdvisoryDto;

function styleTagBySeverity(severity: string) {
	switch (severity) {
		case "MODERATE":
			return "bg-yellow-100 text-yellow-800";
		case "HIGH":
			return "bg-destructive text-destructive-foreground";
		case "CRITICAL":
			return "bg-destructive text-destructive-foreground";
		default:
			return "";
	}
}
</script>


<a href={security.repoUrl} target="_blank">
    <Card class="p-3">
        <h3 class="font-semibold underline capitalize mb-2">{security.packageName}</h3>
        <div class="text-sm">
            <div>
                <span class="font-semibold">Severity:</span>
                <Tag class={cn("lowercase", styleTagBySeverity(security.severity))}>{security.severity}</Tag>
            </div>
            <div>
                <span class="font-semibold">Status:</span>
                <span class=" lowercase">{security.state}</span>
            </div>
            <div>
                <span class="font-semibold">Last update:</span>
                <span class=" lowercase">{formatDistanceToNow(security.createdAt)}</span>
            </div>
        </div>
        <Tag>{security.repoName}</Tag>
    </Card>
</a>