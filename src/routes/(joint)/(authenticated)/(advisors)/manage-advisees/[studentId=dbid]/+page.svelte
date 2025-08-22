<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang="ts">
    import { goto } from '$app/navigation';
    import ProjectCard from '@/client/components/ProjectCard.svelte';
    import { ArrowLeft } from 'lucide-svelte';
    export let data;

    $: ({student, projects} = data);

    $: projectUnapproved = projects.filter((project) => project.underReview == true);
    $: projectsApproved = projects.filter((project) => project.underReview == false);

    function gotoInspectProject(studentId: string, projectId: string) {
        goto(`${studentId}/${projectId}/inspect`);
    }

    async function changeApproval(project: any, approval: boolean){
        const res = await fetch(`/manage-advisees/${student._id}/${project._id}/approval`, {
            method: "POST",
            body: JSON.stringify({
                action: approval ? "APPROVE" : "UNAPPROVE",
                projectId: project._id
            })
        });

        await location.reload();
    }
</script>

<main class="sm:p-8 p-4 relative flex items-center flex-col w-full min-h-full">
    <div class="grid grid-cols-[1fr_auto_1fr] w-full mb-24">
        <div class="flex justify-start">
            <a class="bg-blue-500 hover:bg-blue-600 p-2 px-3 rounded-lg inline-flex gap-2 items-center text-white" href=/manage-advisees>
                <ArrowLeft />
                <span>Back to My Advisees Page</span>
            </a>
        </div>
        <h1 class="text-4xl text-center">Advisee Projects</h1>
        <div></div>
    </div>
    <div class="max-w-[80rem] w-full">
        <div class="flex flex-col items-center">
            <div class="gap-4 grid grid-cols-[repeat(auto-fit,_minmax(38rem,_1fr))] auto-rows-fr max-w-[77rem] w-full">
                {#each projectUnapproved as project}
                    <div class="project-card">
                        <ProjectCard {project} displayLearnMore={false} />
                        <div class="button-container">
                            <button class="fullreport-button" on:click={() => gotoInspectProject(student._id, project._id)}>
                                Inspect Project
                            </button>

                            <button class="accept-button" on:click = {() => gotoInspectProject(student._id, project._id)}>
                                Approve Project
                            </button>
                        </div>
                    </div>
                {/each}
                {#each projectsApproved as project}
                    <div class="project-card">
                        <ProjectCard {project} />
                        <div class="button-container">
                            <button class="fullreport-button" on:click={() => gotoInspectProject(student._id, project._id)}>
                                Inspect Project
                            </button>

                            <button class="deny-button" on:click = {() => changeApproval(project, false)}>
                                Unapprove Project
                            </button>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</main>


<style lang="scss">
    main {
        .project-card {
            width: 100%;
            height: 100%;
            background-color: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            max-width: 40rem;
        }

        .button-container {
            margin-left: 1rem;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 1.2rem;
        }


        .accept-button{
            display: flex;
            align-items: center;
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
            display: flex;
            align-items: center;
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
    }


</style>
