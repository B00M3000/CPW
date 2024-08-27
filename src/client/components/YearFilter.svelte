<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang="ts">
    import { currentYear } from "@/lib/utils";

    export let yearLowerBound: number = 2019;
    export let yearUpperBound: number = currentYear();

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
        <select
            class="yearFilter"
            on:change={updateLowerBound}
        >
            {#each yearOptions as year}
                <option value={year} selected={yearLowerBound == year}>{year}</option>
            {/each}
        </select>
    </label>
    <p> to </p>
    <label>
        <select
            class="yearFilter"
            bind:value={yearUpperBound}
            on:change={updateUpperBound}
        >
            {#each yearOptions as year}
                <option value={year} selected={yearUpperBound == year}>{year}</option>
            {/each}
        </select>
    </label>
</div>

<style>
    .filter-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 160px;
        border-radius: 5px;
    }

    p {
        padding: 0px;
        margin: 0px;
        font-weight: 900;
        font-size: 14px;
    }

    .yearFilter {
        padding: 4px;
        border: 1px solid rgb(245, 245, 245);
        border-radius: 4px;
        background-color: rgb(245, 245, 245);
        font-weight: 800;
        color: black;

    }
    label {
        color: black;
        background-color: rgb(245, 245, 245);
        border-radius: 5px;
    }
</style>
