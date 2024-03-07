<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang=ts>
    import { goto } from "$app/navigation";
  import Icon from "@/client/components/Icon.svelte";
    import StudentCard from "@/client/components/StudentCard.svelte";
  import Open from "@/client/icons/Open";

    export let data;

    $: ({inflatedProjects} = data)

    $: completedProjects = inflatedProjects.filter((p) => p.underReview == false);
    $: uncompletedProjects = inflatedProjects.filter((p) => p.underReview == true);

</script>

<main class="flex flex-row justify-around mt-10">
    <div class="inline-flex flex-col">
        <h1 class="text-center text-2xl m-4">Unapproved Projects</h1>
        <div class="max-h-[75vh] overflow-y-auto">
            <table class="inline-table">
                <tr>
                    <th></th>
                    <th>
                        <span>Title</span>   
                    </th>
                    <th>
                        <span>Student </span>
                    </th>
                </tr>
            
                {#each uncompletedProjects as project}
                <tr on:click ={()  => goto(`project-catalog/${project._id}`)}>
                    <td>
                        <button class="rounded-md bg-slate-300 flex gap-2 items-center justify-center p-1 hover:bg-slate-400" on:click={() => window.open(`/admin/project-catalog/${project._id}`, "_blank")}>
                            <Icon src={Open} size="1.5rem"/>
                            <span>Open</span>
                        </button>
                    </td>
                    <td>
                        <p class="max-w-[24rem]">{project.title}</p>
                    </td>
                    <td>
                        <span> <StudentCard student={project.student} /> </span>
                    </td>
                </tr>
                {/each}
            </table>
        </div>
    </div>

    <div class="inline-flex flex-col">
        <h1 class="text-center text-2xl m-4">Approved Projects</h1>

        <div class="max-h-[75vh] overflow-y-auto">
            <table class="inline-table">
                <tr>
                    <th></th>
                    <th>
                        <span>Title</span>   
                    </th>
                    <th>
                        <span>Student </span>
                    </th>
                </tr>
            
                {#each completedProjects as project}
                <tr on:click={()  => goto(`project-catalog/${project._id}`)}>
                    <td>
                        <button class="rounded-md bg-slate-300 flex gap-2 items-center justify-center p-1 hover:bg-slate-400" on:click={() => window.open(`/admin/project-catalog/${project._id}`, "_blank")}>
                            <Icon src={Open} size="1.5rem"/>
                            <span>Open</span>
                        </button>
                    </td>
                    <td>
                        <p class="max-w-[24rem]">{project.title}</p>
                    </td>
                    <td>
                        <StudentCard student={project.student} />
                    </td>
                </tr>
                {/each}
            </table>
        </div>
    </div>
</main>

<style lang=scss>
    table {
        tr {
            td {
                text-align: left;
                padding: 0.5rem 1rem;
            }
            &:nth-child(even) {
                background-color: #ddd;
            }
            
            &:nth-child(odd) {
                background-color: #e9e9e9;
            } 
        }
        tr:hover {
                background-color: rgb(163, 230, 185);
                cursor: pointer;
        }

        th {
            text-align: left;
            padding: 0.5rem 1rem;
            background-color: rgb(163, 162, 162);
        }
    }  
</style>