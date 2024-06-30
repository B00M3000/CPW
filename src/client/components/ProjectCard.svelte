<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang="ts">
    import type { Project } from "@/interfaces/project";
    import Tags from "@/client/components/Tags.svelte";
    import StudentCard from "@/client/components/StudentCard.svelte";
    import MentorCard from "@/client/components/MentorCard.svelte";
    import { goto } from "$app/navigation";
    
    export let project: Project;

    export let displayLearnMore: boolean = true;
    export let displayShortDesc: boolean = true;

    async function gotoProject() {
        await goto(`/projects/${project._id}`)
    }
</script>

<div class="flex flex-col bg-slate-50 rounded-md max-w-96 gap-5 p-6">
    <div class="flex items-start flex-col gap-2">
        <h3 class="text-md">{project.title}</h3>

        <div class="flex justify-center max-h-20 overflow-clip">
            <Tags tagIds={project.tags} />
        </div> 

        {#if displayShortDesc}
        <span class="overflow-ellipsis text-wrap whitespace-nowrap text-sm">{project.shortDesc}</span>
        {/if}
    </div>
    
    <div class="flex items-center justify-center gap-4">
        <StudentCard student={project.student}/>
    
        <MentorCard mentor={project.mentor}/>
    </div>

    {#if displayLearnMore}
    <button class="w-full justify-center rounded-md bg-blue-400 hover:bg-blue-500 py-1 px-2 inline-flex text-gray-900" on:click={gotoProject}>View Project Page</button>
    {/if}
</div>

<!-- <button class="flex p-3 bg-slate-300 rounded-2xl shadow-lg" on:click={gotoProject}>
    <div class="flex flex-col gap-2">
        <h3 class="text-md text-center mb-2">{project.title}</h3>

        <div class="flex justify-center items-center gap-2">
            <span>Student: </span>
            <StudentCard student={project.student}/>
        </div>
        
        <div class="flex justify-center items-center gap-2">
            <span>Mentor: </span>
            <MentorCard mentor={project.mentor}/>
        </div>
    </div>
    

    <div class="flex justify-center max-h-20 overflow-clip">
        <Tags tagIds={project.tags} />
    </div> 

    {#if displayShortDesc}
    <span class="overflow-ellipsis overflow-hidden text-wrap whitespace-nowrap h-16">{project.shortDesc}</span>
    {/if}
    
    <hr class="bg-black">

    {#if displayLearnMore}
    <div class="flex justify-center mt-2">
        <button class="rounded-md bg-blue-400 hover:bg-blue-300 p-2 inline-flex text-gray-900" on:click={gotoProject}>View Project Page</button>
    </div>
    {/if}
</button> -->