<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang="ts">
    import { goto } from "$app/navigation";
    export let data;
    $: ({ students } = data);

    $: console.log(students);
</script>

<main>
    <h1 class="text-4xl text-center mb-5 p-10 bg-slate-300 rounded-lg">Your Advisees</h1>
    <div id="advisee-container" >
        {#each students as student}
            <div id="student-card-container" class="notification shadow-md">
                <div class="advisee-info-container">
                    {#if student.name}
                        <h3>{student.name}</h3>
                    {/if}
                    <h4>{student.email}</h4>
                </div>
                <div class="advisee-info-container">
                    <h3>Complete: {student.approvedCount}</h3>
                    <h3>Pending: {student.pendingCount}</h3>
                </div>
                <button on:click={() => goto(`manage-advisees/${student._id}`)} class="advisee-button">
                    <span>View Advisee</span>
                    {#if student.pendingCount > 0}
                        <span class="button-badge">!</span>
                    {/if}
                 </button>
            </div>
            
        {/each}
    </div>
</main>


<style lang="scss">
    main{
        margin: 2rem 8rem;
    }
    #student-card-container{
        padding: 20px;
        background-color: #F2F2F2;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
 

    .advisee-info-container {
        padding: 2;
    }

    .advisee-info-container h3 {
        margin-bottom: 5px;
        font-size: 1.2rem;
    }

    .advisee-info-container h4 {
        color: #555;
        font-size: 1rem;
        
    }

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