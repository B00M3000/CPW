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

<div class="flex flex-col p-3 bg-slate-300 rounded-2xl shadow-lg w-[400px]">
    <h3 class="text-xl text-center mb-2">{project.title}</h3>

    <div class="flex justify-center max-h-20 overflow-clip">
        <Tags tagIds={project.tags} />
    </div> 

    <div class="flex flex-col my-3 gap-2">
        <div>
            <span>Student: </span> <StudentCard student={project.student}/>
        </div>
        <div>
            <span>Mentor: </span> <MentorCard mentor={project.mentor}/>
        </div>
    </div>

    {#if displayShortDesc}
    <span class="overflow-ellipsis overflow-hidden text-wrap whitespace-nowrap h-16">{project.shortDesc}</span>
    {/if}
    
    <hr class="bg-black">

    {#if displayLearnMore}
    <div class="flex justify-center mt-2">
        <button class="rounded-md bg-blue-400 p-2 inline-flex" on:click={gotoProject}>View Project Page</button>
    </div>
    {/if}
</div>

<style lang="scss">
    // .card {
    //     display: flex;
    //     flex-direction: column;
    //     justify-content: space-between;
    //     width: 410px;
    //     padding: 0.75rem; 
    //     background-color: aliceblue;
    //     border-radius: 0.5em;
    //     box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);

    //     .title {
    //         font-size: 22px;
    //         text-align: center;
    //     }

    //     #tags {
    //         display: flex;
    //         flex-wrap: wrap;
    //         align-items: center;
    //         justify-content: center;
    //         padding: 0.5rem;
    //     }
        
    //     .persons {
    //         display: flex;
    //         flex-direction: column;
    //         padding: 0.5rem;
    //         align-self: flex-start;
            
    //         .person {
    //             display: flex;
    //             align-items: center;
    //             margin: 0.2rem;

    //             span {
    //                 margin-right: 0.2rem;
    //                 font-weight: bold;
    //             }
    //         }
    //     }

    //     .short-description {
    //         position: relative;
    //         margin: 0.5rem;
    //         word-wrap: break-word; 
    //         word-break: break-word; 
    //         max-height: 5em;
    //         text-overflow: ellipsis;
    //         overflow-y: hidden;
    //         display: inline-flex;
    //         padding: 5px 0px;

    //         &::before {
    //             content: '';
    //             width: 100%;
    //             height: 100%;    
    //             position: absolute;
    //             left: 0;
    //             top: 0;
    //             background: linear-gradient(transparent 2em, aliceblue);
    //         }

    //         border-bottom: 2px solid grey;
    //     }

    //     button {
    //         display: inline-flex;
    //         align-items: center;
    //         width: 8rem;
    //         justify-content: center;
    //         border-radius: 0.5rem;
    //         color: white;
    //         background-color: var(--color-blue-500);
    //         border: none;
    //         cursor: pointer;
    //         padding: 0.5rem;
    //         box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    //     }

    //     .button-container{
    //         display: flex;
    //         justify-content: center;;
    //     }
    // }
</style>    