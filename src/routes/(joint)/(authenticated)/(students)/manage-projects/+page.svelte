<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang="ts">
    import ProjectCard from '@/client/components/ProjectCard.svelte';
    import { goto, invalidate } from '$app/navigation';
    import type { Project } from '@/interfaces/project.js';
  import { Add, Upload } from 'carbon-icons-svelte';

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

<main class="flex flex-col">
    <div class="p-12 flex flex-col justify-center bg-gray-200 gap-12 mb-12">
        <div class="flex items-center justify-between w-full">
            <h2 class="text-2xl text-gray-600">Manage Projects</h2>
            <div class="flex gap-4">
                <a href='manage-projects/create' class="p-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2">
                    <Add size={24} />
                    <span>Create New Project</span>
                </a>
                <a href='manage-images' class="p-4 py-3 animate-blue-glowing hover:bg-blue-600 text-white rounded-lg flex items-center gap-2">
                    <Upload size={20} />
                    Upload Images
                </a>
            </div>
        </div>
        <div class="flex items-center gap-2 text-lg">
            <span class="text-justify"><strong class="font-bold text-red-700">IMPORTANT: </strong> Completing the forms on google classroom and submitting your project report as a google document is still required. (As of Project Week 2024)</span>
        </div>
    </div>

    <div class="self-center gap-4 grid grid-cols-[repeat(auto-fit,_minmax(40rem,_1fr))] auto-rows-fr max-w-[90rem] w-full">
        {#each projects as project, i}
            <div class="project-cards">
                <ProjectCard {project} />
                <div class="grid grid-rows-4 gap-5 ml-6 mr-2 text-white text-base w-48">
                    {#if project.underReview == true}
                        <button class="disabled-button" disabled>
                            Pending Advisor Review
                        </button>
                    {:else}
                        {#if project.publish == true}
                            <button class="!bg-red-700 hover:!bg-red-600 hover:scale-105 transition-all rounded-lg p-4 px-4" onclick={() => {publish(project)}}>
                                Unpublish
                            </button>
                        {:else}
                            <button class="!bg-green-700 hover:!bg-green-600 hover:scale-105 transition-all rounded-lg p-4 px-4" onclick={() => {publish(project)}}>
                                Publish
                            </button>
                        {/if}
                    {/if}

                    <button class="!bg-blue-700 hover:!bg-blue-600 hover:scale-105 transition-all rounded-lg p-4 px-4" onclick={() => goto(`manage-projects/${project._id}/edit`)}>
                        Edit Details
                    </button>
                    <button class="!bg-blue-700 hover:!bg-blue-600 hover:scale-105 transition-all rounded-lg p-4 px-4 text-sm" onclick={()=> goto(`manage-projects/${project._id}/report`)}>
                        {#if project.fullReport == ""} Add {:else} Edit {/if} Full Report
                    </button>

                    <button class="!bg-red-700 hover:!bg-red-600 hover:scale-105 transition-all rounded-lg p-4 px-4" onclick={() => {initDeleteProject(i)}}>
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
            {#if deleteConfirm == i}
            {@const disabled = deleteConfirmInputValue !== "I want to delete this project" }
            <div class="overlay delete-confirm">
                <div class="bg-gray-300 flex flex-col text-black items-center p-8 gap-4 rounded-md">
                    <div class="grid gap-2 grid-cols-[auto_auto]">
                        <div class="grid grid-cols-subgrid col-span-full">
                            <span class="text-right font-semibold">Project Title: </span>
                            <span class="">{project.title}</span>
                        </div>
                        <div class="grid grid-cols-subgrid col-span-full">
                            <span class="text-right  font-semibold">Enter Below: </span>
                            <span class="">I want to delete this project</span>
                        </div>
                    </div>
                    <input class="text-black p-1 w-3/4 border border-gray-400 border-solid" bind:value={deleteConfirmInputValue} onpaste={(e) => e.preventDefault()}/>
                    <div class="flex flex-col gap-4">
                        <button class="{disabled ? "!bg-gray-200 !cursor-not-allowed" : "blink"}" onclick={() => deleteProject(project)} {disabled}>CONFIRM DELETION</button>
                        <button onclick={() => {
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
    .animate-blue-glowing {
        animation: glowing 1500ms infinite;
    }

    @keyframes glowing {
        0% { background-color: #0024b2; box-shadow: 0 0 3px #0015b2; }
        50% { background-color: #002fff; box-shadow: 0 0 40px #0040ff; }
        100% { background-color: #0047b2; box-shadow: 0 0 3px #003eb2; }
    }

    .trigger:hover .reveal-on-trigger {
        display: flex;
    }
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
        height: 100%;
        width: 100%;
        margin-left: 0.5rem;
        margin-right: 0.5rem;
        padding: 4rem;
        overflow-x: hidden;
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
        height: 22rem;
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
