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

<div class="flex flex-col justify-between bg-slate-50 rounded-md gap-5 p-6 w-full h-full">
    <div class="flex items-start flex-col gap-2">
        <h3 class="text-xl">{project.title}</h3>

        <div class="flex justify-center max-h-20 overflow-clip mb-4">
            <Tags tagIds={project.tags} />
        </div>

        {#if displayShortDesc}
        <span class="text-wrap whitespace-nowrap text-sm max-h-24 overflow-y-clip break-all">{project.shortDesc}</span>
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
