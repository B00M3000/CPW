<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang="ts">
    import { goto } from "$app/navigation";
    export let data;
    $: ({ students } = data);
</script>

<main>
    <h1>Your Advisees: </h1>
    <div id="advisee-container" >
        {#each students as student}
            <div id="student-card-container" class="notification">
                <div class="advisee-info-container">
                    <h3> {student.student.name}</h3>
                    <h4> {student.student.email}</h4>
                </div>
                <button on:click={() => goto(`manage-advisees/${student.student._id}`)} class="advisee-button">
                    <span>View Advisee</span>
                    {#if student.counter > 0}
                        <span class="button-badge">!</span>
                    {/if}
                 </button>
            </div>
            
        {/each}
    </div>
</main>


<style lang="scss">
    main{
        margin: 2rem;
    }
    #student-card-container{
        padding: 20px;
        border: 2px black solid;
        background-color: var(--color-blue-grey-200);
        display: flex;
        justify-content: space-between;
        align-items: center
    }

    #advisee-container{
        background-color: var(--color-blue-grey-200);
        padding: 1rem;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .advisee-button {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 150px;
        height: 50px;
        color: #333333;
        background: #dddddd;
        border: none;
        outline: none;
        border-radius: 5px;
        color: white;
        font-weight: bold;
    }

    .advisee-button:hover {
        cursor: pointer;
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