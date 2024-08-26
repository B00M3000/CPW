<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang="ts">
    import ProjectCard from '@/client/components/ProjectCard.svelte';
    import { goto, invalidate } from '$app/navigation';
    import type { Project } from '@/interfaces/project.js';

    export let data;

    $: ({ projects } = data);

    async function initDeleteProject(i: number) {
        if(initDeleteConfirm == i) {
            deleteConfirm = i;
        } else {
            initDeleteConfirm = i;
        }
    }

    async function deleteProject(project: Project){
        await fetch(`/manage-projects/${project._id}`, { method: "DELETE" });
        invalidate('user:projects')
    }

    async function publish(project: Project){
        const res = await fetch('/manage-projects', {
            method: "POST",
            body: JSON.stringify({
                action: "PUBLISH",
                projectId: project._id
            })
        });
        invalidate('user:projects')
    }

    let initDeleteConfirm: number | null;
    let deleteConfirm: number | null;
    let deleteConfirmInputValue: string;
</script>

<main>
    <div class="dashboard-actions">
        <h2 class="text-2xl text-gray-600">Manage Projects</h2>
        <div class="flex gap-4">
            <a href='manage-projects/create' class="p-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
                Create New Project
            </a>
            <a href='manage-images' class="p-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
                Upload Images
            </a>
        </div>
    </div>

    <div style="background-color: lightgrey; padding: 3rem; padding-top: 0; margin-bottom: 3rem;">
        <div class="flex items-center gap-2 text-lg">
            <span><strong class="font-bold text-red-700">IMPORTANT: </strong> Completing the forms on google classroom and submitting your project report as a google document is still required. (As of Project Week 2024)</span>
        </div>
    </div>

    <div class="flex items-center justify-center gap-8">
        {#each projects as project, i}
            <div class="project-card">
                <div class="project-cards">
                    <div class="shadow-2xl border border-gray-400 rounded-md">
                        <ProjectCard {project} />
                    </div>
                    <div class="button-container">
                        {#if project.underReview == true}
                            <button class="disabled-button" disabled>
                               Pending Advisor Review
                            </button>
                        {:else}
                            {#if project.publish == true}
                                <button class="unpublish-button text-2xl" on:click={() => {publish(project)}}>
                                    Unpublish
                                </button>
                            {:else}
                                <button class="publish-button text-2xl" on:click={() => {publish(project)}}>
                                    Publish
                                </button>
                            {/if}
                        {/if}

                        <button class="edit-button" on:click={() => goto(`manage-projects/${project._id}/edit`)}>
                            Edit Details
                        </button>
                        <button class="fullreport-button" on:click={()=> goto(`manage-projects/${project._id}/report`)}>
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
                <div class="bg-gray-500 flex flex-col items-center p-8 gap-8 rounded-md">
                    <div class="flex flex-col items-start gap-2">
                        <div class="flex items-center gap-1">
                            <span>Project Title: </span>
                            <span class="p-1 bg-gray-500 rounded-md">{project.title}</span>
                        </div>
                        <div class="flex items-center gap-1">
                            <span>Enter: </span>
                            <span class="p-1 bg-gray-600 rounded-md">I want to delete this project</span>
                        </div>
                    </div>
                    <input class="text-black p-1 w-3/4" bind:value={deleteConfirmInputValue} on:paste={(e) => e.preventDefault()}/>
                    <div class="flex flex-col gap-4">
                        {#if deleteConfirmInputValue == "I want to delete this project"}
                        <button class="blink" on:click={deleteProject(project)}>CONFIRM DELETION</button>
                        {/if}
                        <button on:click={() => {
                            deleteConfirm = null;
                            initDeleteConfirm = null;
                        }}>GO BACK</button>
                    </div>
                </div>
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
        gap:1.5rem;
        color: white;
    }
    .blink {
        animation: blink-animation 1s steps(25, start) infinite;
    }
    @keyframes blink-animation {
        to {
            color: red;
        }
        25% {
            color: white;
        }
        75% {
            color: white;
        }
        from {
            color:red;
        }
    }
    main {
        margin-left: 0.5rem;
        margin-right: 0.5rem;
        padding: 4rem;
        overflow-x: hidden;
    }

    .dashboard-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;

        padding: 3rem;

        background-color: lightgrey;
    }

    button {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #007BFF;
        color: white;
        padding: 8px 24px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        transition: background-color 0.3s ease;
    }

    button:disabled {
        cursor: auto;
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

    .publish-button{
        background-color: var(--color-green-400);
        width:150px;
        height:50px;
        text-align:center;
    }

    .unpublish-button{
        background-color: var(--color-commschool-nav);
        width:150px;
        height:50px;
        text-align:center;
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

    .overlay {
        position:fixed;
        margin: 0;
        top:0;
        left:0;
        right:0;
        bottom:0;
        background-color:rgba(0, 0, 0, 0.6);
        z-index:9999;
    }
</style>
