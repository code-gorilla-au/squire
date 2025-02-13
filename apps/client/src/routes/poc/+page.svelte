<script lang="ts">
import { ComplexForm } from "$lib/complex-forms/forms.svelte.ts";
import { Label } from "$components/ui/label";
import { Input } from "$components/ui/input";

const form = new ComplexForm({
	startDate: new Date(),
	endDate: new Date(),
	allowDependabot: true,
	allowSecurity: true,
	sprintAllocation: {
		dependabot: 10,
		security: 10,
	},
	chores: {
		dependabot: [],
		security: [],
	},
});
</script>



<h1 class="heading-1 mt-4 mb-2">Proof of Concept</h1>
<h2>Complex Forms</h2>


<form>
    <div>
        <Label for="allowDependabot">
            Allow dependabot chores
            <input name="allowDependabot" bind:checked={form.data.allowDependabot} type="checkbox" />
        </Label>
    </div>
    <div>
        <Label for="allowSecurity">
            Allow security chores
            <input name="allowSecurity" bind:checked={form.data.allowSecurity} type="checkbox" />
        </Label>
    </div>
    <Label for="name">
        Start date
        <input  id="startDate" type="date" placeholder="Start date"  oninput={((e) => {
            form.data.startDate = new Date(e.currentTarget.value);
        } )} />
    </Label>
    <Label for="name">
        End date
        <input id="endDate" type="date" placeholder="End date" oninput={((e) => {
            form.data.endDate = new Date(e.currentTarget.value);
        } )} />
    </Label>
    {#each form.data.chores.dependabot as dependabot, i}
        <Label for="name">
            Dependabot chore {i + 1}
            <input type="checkbox" bind:checked={dependabot.completed} />
            <Input type="text" readonly bind:value={dependabot.week} />
        </Label>
    {/each}
    {#each form.data.chores.security as security, i}
        <Label for="name">
            Security chore {i + 1}
            <input type="checkbox" bind:checked={security.completed} />
            <Input type="text" readonly bind:value={security.week} />
        </Label>
    {/each}
</form>

<code>
    <pre>{JSON.stringify(form.data, null, 2)}</pre>
</code>

<svelte:head>
    <title>POC | oOh!</title>
</svelte:head>