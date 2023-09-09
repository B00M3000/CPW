<script lang="ts">
    let search = "";

    let students: any = [];

    async function update() {
        if(!search) return;
        const res = await fetch(`/students.json?query=${search}`);
        ({ students } = await res.json());
    }

    $: console.log(students)
</script>

<input list="results" type="text" placeholder="Start typing to search..." bind:value={search} on:keyup={update} />
<datalist id="results">
{#each students as student}
    <option>{student.name}</option>
    <option>{student.email}</option>
{/each}
</datalist>

<style lang="scss">
    /* <datalist> and <option> styling */
    datalist {
        position: absolute;
        max-height: 20em;
        border: 0 none;
        overflow-x: hidden;
        overflow-y: auto;
    }

    datalist option {
        font-size: 0.8em;
        padding: 0.3em 1em;
        background-color: #ccc;
        cursor: pointer;
    }

    datalist option:hover, datalist option:focus {
        color: #fff;
        background-color: #036;
        outline: 0 none;
    }
</style>