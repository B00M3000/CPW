<script lang="ts">
    import ProjectCard from '@/client/components/ProjectCard.svelte';
    import { goto } from '$app/navigation';
    import type { Project } from '@/interfaces/project.js';

    export let data;

    $: ({ projects } = data);

    async function initDeleteProject(i: number) {
        if(initDeleteConfirm == i) {
            deleteConfirm = i
        } else {
            initDeleteConfirm = i
        }
    }

    async function deleteProject(project: Project){
        const res = await fetch('/manage-projects', {
            method: "POST",
            body: JSON.stringify({
                action: "DELETE",
                project: project
            })
        });

        location.reload();
    }

    
    async function publish(project: Project){
        const res = await fetch('/manage-projects', {
            method: "POST",
            body: JSON.stringify({
                action: "PUBLISH",
                project: project
            })
        });

        location.reload();
    }

    let initDeleteConfirm: number;
    let deleteConfirm: number;
    let deleteConfirmInputValue: string;
</script>
<main>
    <div class="dashboard-actions">
        <h2>Manage Projects</h2>
        <button on:click={() => goto('manage-projects/create')}>
            Create New Project
        </button>
    </div>
    <div class="card-container">
        {#each projects as project, i}
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
 
                        <button class="delete-button" on:click={() => {initDeleteProject(i)}}>
                            {#if initDeleteConfirm == i}
                            <span class="delete-button-warning blink">
                                <strong>⚠ Are you sure? This action is IRREVERSIBLE ⚠</strong>
                            </span>   
                            {:else}
                            Delete
                            {/if}
                        </button>
                    </div>
                </div>
            </div>

            {#if deleteConfirm == i}
            <div class="overlay delete-confirm">
                <p>Enter the project id to delete. ID: {project._id}</p>
                <input bind:value={deleteConfirmInputValue} on:paste={(e) => e.preventDefault()}/>
                {#if deleteConfirmInputValue == project._id}
                <button class="blink" on:click={deleteProject(project)}>CONFIRM DELETION</button>
                {/if}
                <button class="blink" on:click={() => {
                    deleteConfirm = null;
                    initDeleteConfirm = null;
                }}>GO BACK</button>
            </div>
            {/if}
        {/each}
    </div>
</main>

<style lang="scss">
    .delete-confirm {
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        color: white;
    }
    .blink {
        animation: blink-animation 1.5s steps(25, start) infinite;
    }
    @keyframes blink-animation {
        to {
            color: white;
        }
        from {
            color: red
        }
    }
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
    .delete-button-warning {
        font-size: 0.6em;
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
        display: flex;
        align-items: center;
        font-size:1.1em;
        justify-content: center;
    }
    .delete-button:hover {
        background-color: hsl(354, 100%, 50%);
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

    .overlay {
        position:fixed;
        margin: 0;
        top:0;
        left:0;
        right:0;
        bottom:0;
        background-color:rgba(0, 0, 0, 0.85);
        z-index:9999;
    }
</style>



