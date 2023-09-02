<script lang="ts">
    export let yearLowerBound: number;
    export let yearUpperBound: number;
    let yearSearchLower = 2019;
    let yearSearchUpper = new Date().getFullYear();

    function updateUpperBound() {
        if (yearSearchUpper < yearSearchLower) {
            yearSearchUpper = yearSearchLower;
        }
        yearUpperBound = yearSearchUpper;
    }

    function updateLowerBound() {
        if (yearSearchLower > yearSearchUpper) {
            yearSearchLower = yearSearchUpper;
        }
        yearLowerBound = yearSearchLower;
    }

    let yearOptions: number[] = [];

    for (let year = 2019; year <= yearSearchUpper; year++) {
        yearOptions.push(year);
    }
</script>

<div class="filter-container">
    <label>
        From:
        <select
            class="yearFilter"
            bind:value={yearSearchLower}
            on:change={updateLowerBound}
        >
            {#each yearOptions as year}
                <option value={year}>{year}</option>
            {/each}
        </select>
    </label>
    <label>
        To:
        <select
            class="yearFilter"
            bind:value={yearSearchUpper}
            on:change={updateUpperBound}
        >
            {#each yearOptions as year}
                <option value={year}>{year}</option>
            {/each}
        </select>
    </label>
</div>

<style>
    .filter-container {
        display: flex;
        align-items: center;
        gap: 20px;
        width: 208px;
        background-color: #525252;
        padding: 2px;
        border-radius: 5px;
        margin-bottom: 2rem;
    }

    .yearFilter {
        padding: 1px;
        border: 1px solid gray;
        border-radius: 4px;
        background-color: gray;
        font-weight: 800;
        color: white;
        
    }
    label {
        color: white;
        font-weight: 900;
        background-color: gray;
        padding-left: 5px;
        border-radius: 5px;
    }
</style>
