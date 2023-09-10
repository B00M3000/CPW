<script lang="ts">
    import { createEventDispatcher } from "svelte";

    export let disabled: boolean = false;

    let search = "";

    let mentors: any = [];

    async function update() {
        if(!search || search.endsWith("&#8291")) return;
        const res = await fetch(`/mentors.json?query=${search}`);
        ({ mentors } = await res.json());
    }

    const dispatcher = createEventDispatcher()

    let selected;

    function select(mentorId: string) {
        dispatcher('select', { mentorId })
        selected = mentorId;
        search = "";
    }

    $: if(disabled) search = "";
</script>

<input type="text" placeholder="Start typing to search..." bind:value={search} on:keyup={update} {disabled}/>
<div class="mentors">
    {#each mentors as mentor}
    <div class="mentors" style={selected == mentor._id ? "background-color: var(--color-green-600);" : ""}>
        <span>Name: {mentor.name}</span>
        <span>Org: {mentor.organization}</span>
        <button on:click={() => select(mentor._id)}>Select</button>
    </div>
    {/each}
</div>

<style lang="scss">
    .mentors {
        background: #eeeeee;
        &>div:nth-of-type(even) {
            background: #bababa;
        }
    }
</style>