<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang="ts">
    import { goto } from '$app/navigation';
    import ProjectCard from '@/client/components/ProjectCard.svelte';
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

<main>
    <h1 class="text-4xl text-center mb-5 p-10 bg-slate-300 rounded-lg">Adivsee Projects</h1>
    <div class="card-container">
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
</main>


<style lang="scss">
    main {
        padding:1rem 5rem;

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
