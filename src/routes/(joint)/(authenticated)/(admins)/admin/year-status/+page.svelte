<script lang="ts">
    import { goto } from '$app/navigation';

    import Icon from '@/client/components/Icon.svelte';
    import AwaitingApproval from '@/client/icons/AwaitingApproval.js';
    import Open from '@/client/icons/Open.js';
    import Warning from '@/client/icons/Warning.js';
  import NamePlusPicture from './NamePlusPicture.svelte';
  import { user } from '@/client/stores/user';

    export let data;

    $: ({ missingStudents, inflatedUnapprovedProjects } = data);

    const CURRENT_YEAR = new Date().getFullYear();

    let excludeSeniors: boolean;

    let filteredMissingStudents: any[] = [];
    let filteredInflatedUnapprovedProjects: any[] = [];

    $: {
        if(excludeSeniors) {
            filteredMissingStudents = missingStudents.filter(student => student.graduationYear != CURRENT_YEAR && excludeSeniors);
            filteredInflatedUnapprovedProjects = inflatedUnapprovedProjects.filter(project => project.student.graduationYear != CURRENT_YEAR && excludeSeniors);
        } else {
            filteredMissingStudents = missingStudents;
            filteredInflatedUnapprovedProjects = inflatedUnapprovedProjects;
        }
    }
</script>

<!-- <main>
    <h1 class="text-4xl text-center mb-5 p-10 bg-slate-300 rounded-lg">Project Week {CURRENT_YEAR} Status</h1>

    <div class="flex flex-col">
        <h2 class="text-2xl text-center">Students Needing Attention!</h2>

        <div class="flex justify-center gap-5">
            <span class="text-center">Total Count: {filteredMissingStudents.length + filteredInflatedUnapprovedProjects.length}</span>
            <span class="text-center">No Project: {filteredMissingStudents.length}</span>
            <span class="text-center">Awaiting Approval: {filteredInflatedUnapprovedProjects.length}</span>
        </div>

        <div class="flex gap-6 justify-center bg-stone-300 rounded-lg p-2">
            <div class="flex justify-center items-center gap-2">
                <Icon src={Warning} color="red" size="2rem"/>
                <span>Has Not Logged In</span>
            </div>
            <div class="flex justify-center items-center gap-2">
                <Icon src={Warning} color="orange" size="2rem"/>
                <span>No Project Created</span>
            </div>
            <div class="flex justify-center items-center gap-2">
                <Icon src={AwaitingApproval} color="goldenrod" size="2rem"/>
                <span>Awaiting Advisor Approval</span>
            </div>
        </div>

        <div class="flex flex-row-reverse items-center">
            <div class="inline-flex flex-col bg-zinc-400 p-6 rounded-2xl justify-center gap-2">
                <h2>Filters: </h2>
    
                <div class='flex items-center gap-2'>
                    <input type="checkbox" class="w-4 h-4" bind:checked={excludeSeniors}/>
                    <span>Exclude Seniors</span>
                </div>
            </div>

            <table class="rounded-xl">
                <thead>
                    <tr>
                        <th>&nbsp;</th>
                        <th>Student</th>
                        <th>Project Name</th>
                        <th>Advisor</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {#each filteredMissingStudents as student}
                        <tr>
                            <td></td>
                            <td>
                                <span>{student.name || student.email}</span>
                            </td>
                            <td></td>
                            <td></td>
                            <td>
                                {#if student.name}
                                    <Icon src={Warning} color="orange" size="2rem"/>
                                {:else}
                                    <Icon src={Warning} color="red" size="2rem"/>
                                {/if}
                            </td>
                        </tr>
                    {/each}
                    {#each filteredInflatedUnapprovedProjects as project}
                        <tr>
                            <td>
                                <button class="rounded-md bg-slate-300 flex gap-2 items-center justify-center p-1 hover:bg-slate-400" on:click={() => window.open(`/admin/project-catalog/${project._id}`, "_blank")}>
                                    <Icon src={Open} size="1.5rem"/>
                                    <span>Open</span>
                                </button>
                            </td>
                            <td>
                                <span>{project.student.name}</span>
                            </td>
                            <td>
                                <span>{project.title}</span>
                            </td>
                            <td>
                                <span>{project?.advisor?.name || project?.advisor?.email}</span>
                            </td>
                            <td>
                                <Icon src={AwaitingApproval} color="goldenrod" size="2rem"/>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</main> -->

<main class="flex flex-col">
    <h1 class="text-3xl text-center my-4">Project Week {CURRENT_YEAR} Status</h1>

    <div class="flex justify-center">
        <div class="inline-flex flex-col bg-zinc-400 p-6 rounded-2xl justify-center gap-4">
            <h2 class="text-2xl text-center">Students Needing Attention!</h2>

            <div class="flex justify-center gap-5">
                <span class="text-center">Total Count: {filteredMissingStudents.length + filteredInflatedUnapprovedProjects.length}</span>
                <span class="text-center">No Project: {filteredMissingStudents.length}</span>
                <span class="text-center">Awaiting Approval: {filteredInflatedUnapprovedProjects.length}</span>
            </div>

            <div class="flex gap-6 justify-center bg-stone-300 rounded-lg p-2">
                <div class="flex justify-center items-center gap-2">
                    <Icon src={Warning} color="red" size="2rem"/>
                    <span>Has Not Logged In</span>
                </div>
                <div class="flex justify-center items-center gap-2">
                    <Icon src={Warning} color="orange" size="2rem"/>
                    <span>No Project Created</span>
                </div>
                <div class="flex justify-center items-center gap-2">
                    <Icon src={AwaitingApproval} color="goldenrod" size="2rem"/>
                    <span>Awaiting Advisor Approval</span>
                </div>
            </div>

            <div class="flex flex-row">
                {#if filteredMissingStudents.length == 0 && filteredInflatedUnapprovedProjects.length == 0}
                    <span class="flex justify-center items-center text-center bg-gray-300 w-[36rem] p-2">Everything looks good!</span>
                {:else}
                    <div class="inline-flex flex-col h-[50vh] overflow-y-auto rounded-xl" id="attention-list">
                        {#each filteredMissingStudents as student}
                            <div class="attention-list-element justify-between gap-2">
                                <div />

                                <NamePlusPicture user={student}/>

                                {#if student.name}
                                    <Icon src={Warning} color="orange" size="2rem"/>
                                {:else}
                                    <Icon src={Warning} color="red" size="2rem"/>
                                {/if}
                            </div>
                        {/each}
                        {#each filteredInflatedUnapprovedProjects as project}
                            <div class="attention-list-element">
                                <button class="rounded-md bg-slate-300 flex gap-2 items-center justify-center p-2 hover:bg-slate-400" on:click={() => window.open(`/admin/project-catalog/${project._id}`, "_blank")}>
                                    <Icon src={Open} size="1.5rem"/>
                                    <span>Open</span>
                                </button>
                                <div class="flex justify-between items-center gap-12">
                                    <NamePlusPicture user={project.student}/>
                                    <span class="max-w-48">{project.title}</span>
                                    <NamePlusPicture user={project.advisor}/>
                                </div>
                                <Icon src={AwaitingApproval} color="goldenrod" size="2rem"/>
                            </div>
                        {/each}
                    </div>
                {/if}

                <div class="inline-flex flex-col bg-zinc-400 p-6 rounded-2xl justify-center gap-2">
                    <h2>Filters: </h2>
        
                    <div class='flex items-center gap-2'>
                        <input type="checkbox" class="w-4 h-4" bind:checked={excludeSeniors}/>
                        <span>Exclude Seniors</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<style lang="scss">
    .attention-list-element {
        display: flex;
        padding: 1rem;
        justify-content: space-between;
        gap: 2rem;

        &:nth-child(even) {
            background-color: #ddd;
        }
        
        &:nth-child(odd) {
            background-color: #e9e9e9;
        } 
    }
</style>
