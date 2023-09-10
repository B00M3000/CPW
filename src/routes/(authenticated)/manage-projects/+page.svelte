<script lang="ts">
    import ProjectCard from '@/client/components/ProjectCard.svelte';
    import { goto } from '$app/navigation';
    import type { Project } from '@/interfaces/project.js';
    import { action_destroyer } from 'svelte/internal';

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
                        <button class="edit-button" on:click={() => goto(`manage-projects/edit/${project._id}`)}>
                            Edit
                        </button>
                        <button class="delete-button" on:click={() => deleteProject(project)}>
                            Delete
                        </button>

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
    }

    h1 {
        font-size: 32px;
        color: #333;
        margin-bottom: 20px;
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
        gap: 1rem;
    }
    .edit-button {
        background-color: #17a2b8;
        width:120px;
        height:50px;
        text-align:center;
        line-height:1.1em;
        font-size:1.1em;
    }

    .delete-button {
        background-color: #dc3545;
        width:120px;
        height:50px;
        text-align:center;
        line-height:1.1em;
        font-size:1.1em;
    }

    .card-container{
        display:flex;
        gap: 2rem;
        justify-content: center;
    }
</style>



