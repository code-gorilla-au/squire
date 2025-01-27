<script lang="ts">
import { BarChart, DoughnutChart } from "$components/charts";
import { Card } from "$components/ui/card";
import type { InsightsDto } from "products";

let { insights }: { insights: InsightsDto } = $props();

let pullRequests = $derived(insights.pullRequests);
let securityAdvisories = $derived(insights.securityAdvisories);
</script>
    
    
    <Card>
        <div class="w-full flex items-center justify-evenly p-4">
            <BarChart id="pullRequestChart" labels={["Avg. Days Open", "Max Days Open", "Min Days Open"]} datasets={[
                { 
                    label: "Pull requests", 
                    data: [pullRequests.daysToMerge, pullRequests.maxDaysToMerge, pullRequests.minDaysToMerge],
                    backgroundColor: "rgb(10, 169, 255)",
                },
                { label: "Security Advisories", data: [securityAdvisories.daysToMerge, securityAdvisories.maxDaysToMerge, securityAdvisories.minDaysToMerge], backgroundColor: "rgb(245, 17, 17)" },
    
            ]} />
            <DoughnutChart class="max-h-52" id="securityAdvisoriesChart" labels={["Resolved", "Open"]} datasets={[
                { label: "Security Advisories", data: [securityAdvisories.resolved, securityAdvisories.open], backgroundColor: ["rgb(10, 169, 255)", "rgb(245, 17, 17)"] },
            ]} />
        </div>
    </Card>