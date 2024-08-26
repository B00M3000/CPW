<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang="ts">
    import { goto } from "$app/navigation";
    import { ErrorFilled, WarningAltFilled, CheckmarkFilled } from "carbon-icons-svelte";
    export let data;
    $: ({ students } = data);
</script>

<main class="w-full h-full p-4 sm:p-8">
    <h1 class="text-4xl text-center mb-5 p-10 bg-slate-300 rounded-lg">Your Advisees</h1>
    <div class="max-md:flex max-md:flex-col max-sm:gap-5 md:grid md:grid-cols-[auto_auto_auto] sm:gap-2 sm:mx-12">
        {#each students as student}
        <div class="md:grid max-md:grid-rows-3 md:col-span-full md:grid-cols-subgrid max-md:flex max-md:flex-col gap-5 shadow-md bg-white rounded-lg p-4 sm:p-6 items-center">
            <div class="flex flex-col items-start">
                {#if student.name}
                <span class="text-lg mb-2">{student.name}</span>
                {:else}
                <span class="text-lg mb-2">[has not logged in]</span>
                {/if}
                <span class="text-base text-gray-600">{student.email}</span>
            </div>
            <div class="flex flex-col items-start">
                <div class="flex items-center gap-2">
                    {#if !student.currentPending}
                    <ErrorFilled color="red" size={24} />
                    {:else if !student.currentApproved}
                    <WarningAltFilled color="#C96" size={24} />
                    {:else}
                    <CheckmarkFilled color="green" size={24} />
                    {/if}
                    <span class='text-lg'>{!student.currentPending ? "No project created" : !student.currentApproved ? "Awaiting approval" : "Complete"}</span>
                </div>
            </div>
            <button on:click={() => goto(`manage-advisees/${student._id}`)} class="advisee-button justify-self-center">
                <span>View Advisee</span>
                {#if !student.currentApproved}
                    <span class="button-badge">!</span>
                {/if}
            </button>
        </div>
        {/each}
    </div>
</main>


<style lang="scss">
    .advisee-button {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 150px;
        height: 50px;
        color: #333333;
        background: #a8a8a8;
        border: none;
        outline: none;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        padding: 5px;
        background-color: rgb(100, 100, 255);
    }

    .advisee-button:hover {
        cursor: pointer;
        background-color: rgb(150, 150, 255);
    }

    .button-badge {
        position: absolute;
        top: -10px;
        right: -10px;
        width: 25px;
        height: 25px;
        background: red;
        color: #ffffff;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
    }
</style>
