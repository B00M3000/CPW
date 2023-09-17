<script lang="ts">
    import ProjectCard from '@/client/components/ProjectCard.svelte';
    import { goto } from '$app/navigation';
    import type { Project } from '@/interfaces/project.js';
    import { action_destroyer } from 'svelte/internal';
    import { onMount } from 'svelte';

    export let data;

    interface Action {
        action: string;
        project: Project;
    }

    let actions: Action[] = [];

    $: ({ projects } = data);
    async function deleteProject(project: Project){
        actions.push({
            action: "DELETE",
            project: project
        })
        actions = actions

        const res = await fetch('/manage-projects', {
            method: "POST",
            body: JSON.stringify(actions)
        });

        location.reload();
    }

    
    async function publish(project: Project){
        actions.push({
            action: "PUBLISH",
            project: project
        })
        actions = actions

        const res = await fetch('/manage-projects', {
            method: "POST",
            body: JSON.stringify(actions)
        });

        location.reload();
    }


</script>
<main>
    <div class="dashboard-actions">
        <h2>Manage Projects</h2>
        <button on:click={() => goto('manage-projects/create')}>
            Create New Project
        </button>
    </div>
    <div class="card-container">
        {#each projects as project}
            <div class="project-card">
                <div class="project-cards">
                    <div class="card-content">
                        <ProjectCard {project} />
                    </div>
                    <div class="button-container">
                        {#if project.underReview == true}
                            <button class="disabled-button" disabled>
                               Pending Advisor Review
                            </button>
                        {:else}
                            {#if project.publish == true}
                                <button class="unpublish-button" on:click={() => {publish(project)}}>
                                    Unpublish Project
                                </button>
                            {:else}
                                <button class="publish-button" on:click={() => {publish(project)}}>
                                    Publish Project
                                </button>
                            {/if}
                        {/if}
                        <button class="edit-button" on:click={() => goto(`manage-projects/edit/${project._id}`)}>
                            Edit
                        </button>
                        <button class="fullreport-button" on:click={()=> goto(`manage-projects/report/${project._id}`)}>
                            {#if project.fullReport == ""} Add {:else} Edit {/if} Full Report
                        </button>


                        <div class="tooltip">
                            
                            <button class="delete-button" on:click={() => {deleteProject(project)}}>
                                Delete
                            </button>
                            <div class="tooltiptext"> ⚠<strong><i><u>CAUTION</u></i>: This Action is <i> IRREVERSIBLE </i> </strong></div>
                        </div>

                    </div>
                </div>
            </div>
        {/each}
    </div>
</main>

<style lang="scss">
    main {
        margin-left: 1rem;
        margin-right: 1rem;
        padding: 4rem;
        overflow-x: hidden;
    }

    .dashboard-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }

    .dashboard-actions h2 {
        font-size: 24px;
        color: #666;
        margin: 0;
    }

    button {
        background-color: #007BFF;
        color: white;
        padding: 12px 24px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        transition: background-color 0.3s ease;
    }

    button:hover {
        background-color: #0056b3;
    }

    .project-cards {
        background-color: #fff;
        border: 1px solid #ccc;
        padding: 20px;
        margin-bottom: 20px;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        display: flex; 
        display: flex;
        flex-direction: row; 
        justify-content: space-between;
        align-items: center;
        max-width: 40rem;
        height: 20rem;
    }

    .button-container {
        margin-left: 1rem;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 1.2rem;
    }
    .edit-button {
        background-color: #5783db;
        width:150px;
        height:50px;
        text-align:center;
        line-height:1.1em;
        font-size:1.1em;
    }

    .fullreport-button{
        background-color: #5783db;
        width:150px;
        height:50px;
        text-align:center;
        font-size: 0.9em;
    }

    .delete-button {
        background-color: #dc3545;
        width:150px;
        height:50px;
        text-align:center;
        font-size:1.1em;

    }
    .delete-button:hover {
        background-color: hsl(354, 100%, 50%);
        width:150px;
        height:50px;
        text-align:center;
        font-size:1.1em;

    }

    .card-container{
        display:flex;
        gap: 2rem;
        justify-content: center;
        flex-wrap: wrap;
    }

    .publish-button{
        background-color: var(--color-green-400);
        width:150px;
        height:50px;
        text-align:center;
        font-size: 0.81em;
    }

    .unpublish-button{
        background-color: var(--color-commschool-nav);
        width:150px;
        height:50px;
        text-align:center;
        font-size: 0.81em;
    }
    .unpublish-button:hover{
        background-color: var(--color-red-400);
        width:150px;
        height:50px;
        text-align:center;
        
    }

    .disabled-button{
        background-color: gray;
        width:150px;
        height:50px;
        text-align:center;
        font-size: 0.81em;
    }

    .disabled-button:hover{
        background-color: gray;
    }

    .publish-button:hover{
        background-color: var(--color-green-600);
        width:150px;
        height:50px;
        text-align:center;
        
    }
    .tooltip {
        position: relative;
        display: inline-block;
    }

    

    .tooltip .tooltiptext {
        visibility: hidden;
        width: 180px;
        background-color: rgb(255, 221, 0);
        border: #ff0026 solid 5px;
        color: #ff2c2c;
        text-align: center;
        padding: 5px 0;
        border-radius: 0px;
    
   
        position: absolute;
        z-index: 1;
    }

    .tooltip:hover .tooltiptext {
        visibility: visible;
        top: -6px;
        left: 105%;
    }
</style>



