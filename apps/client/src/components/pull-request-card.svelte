<script lang="ts">
import { Tag } from "$components/tag";
import Card from "$components/ui/card/card.svelte";
import { formatDistanceToNow } from "date-fns";
import type { PullRequestDto } from "squire";

export let pullRequest: PullRequestDto;

function truncateString(str: string, num = 20): string {
	if (str.length <= num) {
		return str;
	}
	return `${str.slice(0, num)}...`;
}
</script>
    
<a href={pullRequest.url} target="_blank">
    <Card class="p-2">
        <h3 class="text-sm font-semibold underline capitalize mb-2">{truncateString(pullRequest.title)}</h3>
        <div>
            <span class="font-semibold text-xs">Status:</span>
            <span class="lowercase text-xs">{pullRequest.state}</span>
        </div>
        <div>
            <span class="font-semibold text-xs">Created:</span>
            <span class="lowercase text-xs">{formatDistanceToNow(pullRequest.createdAt)}</span>
        </div>
        <Tag>{pullRequest.repoOwner}</Tag>
        <Tag>{pullRequest.repoName}</Tag>
    </Card>
</a>