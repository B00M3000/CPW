<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang="ts">
    export let yearLowerBound: number = 2019;
    export let yearUpperBound: number = new Date().getFullYear();

    function updateUpperBound() {
        if (yearUpperBound < yearLowerBound) {
            yearUpperBound = yearLowerBound;
        }
        yearUpperBound = yearUpperBound;
    }

    function updateLowerBound() {
        if (yearLowerBound > yearUpperBound) {
            yearLowerBound = yearUpperBound;
        }
        yearLowerBound = yearLowerBound;
    }

    let yearOptions: number[] = [];

    for (let year = 2019; year <= yearUpperBound; year++) {
        yearOptions.push(year);
    }
</script>

<div class="filter-container">
    <label>
        From:
        <select
            class="yearFilter"
            bind:value={yearLowerBound}
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
            bind:value={yearUpperBound}
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
        justify-content: center;
        gap: 20px;
        width: 215px;
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
