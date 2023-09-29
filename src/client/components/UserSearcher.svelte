<script lang="ts">
    import { createEventDispatcher } from "svelte";

    export let disabled: boolean = false;

    let search = "";

    let students: any = [];

    async function update() {
        if(!search || search.endsWith("&#8291")) return;
        const res = await fetch(`/api/students?query=${search}`);
        ({ students } = await res.json());
    }

    const dispatcher = createEventDispatcher()

    $: if(search.slice(-1) === '\u2063') {
        dispatcher('select', { email: search.slice(0, search.length - 1) })
        search = "";
    }

    $: if(disabled) search = "";
</script>

<input list="results" type="text" placeholder="Start typing to search..." bind:value={search} on:keyup={update} disabled={disabled}/>
<datalist id="results">
{#each students as student}
    <option value="{student.email}&#8291">{student.name}</option>
    <option value="{student.email}&#8291">{student.email}</option>
{/each}
</datalist>

<style lang="scss">

</style>