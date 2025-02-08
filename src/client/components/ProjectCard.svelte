<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang="ts">
    import type { Project } from "@/interfaces/project";
    import Tags from "@/client/components/Tags.svelte";
    import StudentCard2 from "@/client/components/StudentCard2.svelte";
    import MentorCard2 from "@/client/components/MentorCard2.svelte";
    import { goto } from "$app/navigation";

    export let project: Project;

    export let displayLearnMore: boolean = true;
    export let displayShortDesc: boolean = true;
</script>

<div class="flex flex-col justify-between bg-slate-50 rounded-md p-4 w-full h-full shadow-xl border border-gray-400">
    <div class="flex flex-col">
        <div class="flex justify-between mb-1">
            <h3 class="text-xl">{project.title}</h3>
            <h2 class="text-sm text-gray-400 font-bold">{project.year}</h2>
        </div>

        <div class="flex mb-4 justify-start">
            <Tags tagIds={project.tags} />
        </div>

        {#if displayShortDesc}
        <p class="text-wrap mb-4 whitespace-nowrap text-sm max-h-24 overflow-clip overflow-ellipsis break-words">{project.shortDesc}</p>
        {/if}
    </div>

    <div class="flex flex-col gap-4">
        <div class="flex items-center justify-center gap-4">
            <StudentCard2 student={project.student}/>
            <MentorCard2 mentor={project.mentor}/>
        </div>

        {#if displayLearnMore}
        <a class="w-full justify-center rounded-md bg-blue-400 hover:bg-blue-500 py-1 px-2 inline-flex text-gray-900" href="/projects/{project._id}" data-sveltekit-preload-code>View Project Page</a>
        {/if}
    </div>
</div>
