<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang="ts">
    import { goto } from '$app/navigation';
    import ProjectCard from '@/client/components/ProjectCard.svelte';
    import { onMount } from 'svelte';
    export let data;

    $: ({student, projects} = data);

    $: projectUnapproved = projects.filter((project) => project.underReview == true);
    $: projectsApproved = projects.filter((project) => project.underReview == false);

    async function changeApproval(project: any, approval: boolean){

        const res = await fetch(`${student._id}/${project._id}/approval`, {
            method: "POST",
            body: JSON.stringify({
                action: approval ? "APPROVE" : "UNAPPROVE",
                projectId: project._id
            })
        });

        await location.reload();
    }
</script>

<main>
    <h1>Adivsee Projects</h1>
    <div class="card-container">
        {#each projectUnapproved as project}
            <div class="project-card">
                <ProjectCard {project} />
                <div class="button-container">
                    <button class="fullreport-button" on:click={async () => await goto(`${student._id}/${project._id}/report`)}>
                        View Full Report
                    </button> 

                    <button class="accept-button" on:click = {() => changeApproval(project, true)}>
                        Approve Project
                    </button>
                    
                </div>
            </div>
        {/each}
        {#each projectsApproved as project}
            <div class="project-card">
                <ProjectCard {project} />
                <div class="button-container">
                    <button class="fullreport-button" on:click={async () => await goto(`${student._id}/${project._id}/report`)}>
                        View Full Report
                    </button> 

                    <button class="deny-button" on:click = {() =>  changeApproval(project, false)}>
                        Unapprove Project
                    </button>
                </div>
            </div>
        {/each}
    </div>
</main>


<style lang="scss">
    .card-container{
        display:flex;
        justify-content: center;
        align-items: center;
        margin-top: 2rem;
        gap: 2rem;
        justify-content: center;
        flex-wrap: wrap;
    }

    .project-card{
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


    .accept-button{
        background-color: var(--color-green-400);
        width:150px;
        height:50px;
        text-align:center;
        font-size: 0.81em;
    }

    .accept-button:hover{
        background-color: var(--color-green-300);
        width:150px;
        height:50px;
        text-align:center;
        font-size: 0.81em;
    }

    .deny-button{
        background-color: var(--color-red-400);
        width:150px;
        height:50px;
        text-align:center;
        font-size: 0.81em;
    }

    .deny-button:hover{
        background-color: var(--color-red-300);
        width:150px;
        height:50px;
        text-align:center;
        font-size: 0.81em;
    }


    .fullreport-button{
        background-color: var(--color-blue-400);
        width:150px;
        height:50px;
        text-align:center;
        font-size: 0.81em;
    }

    .fullreport-button:hover{
        background-color: var(--color-blue-500);
        width:150px;
        height:50px;
        text-align:center;
        font-size: 0.81em;
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

</style>