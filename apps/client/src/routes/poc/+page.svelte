<script lang="ts">
import {
	ComplexForm,
	type ComplexFormSchema,
} from "$lib/complex-forms/forms.svelte.ts";
import { Input } from "$components/ui/input";
import { Label } from "$components/ui/label";

const form = new ComplexForm({
	startDate: new Date(),
	endDate: new Date(),
	allowDependabot: true,
	allowSecurity: true,
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
        <Input id="startDate" type="date" placeholder="Start date"  onchange={((e) => {
            form.data.startDate = new Date(e.currentTarget.value);
        } )} />
    </Label>
    <Label for="name">
        End date
        <Input id="endDate" type="date" placeholder="End date"  onchange={((e) => {
            form.data.endDate = new Date(e.currentTarget.value);
        } )} />
    </Label>
</form>

<code>
    <pre>{JSON.stringify(form.data, null, 2)}</pre>
</code>

<svelte:head>
    <title>POC | oOh!</title>
</svelte:head>