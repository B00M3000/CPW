<script lang="ts">
    import { goto } from '$app/navigation';

    import Icon from '@/client/components/Icon.svelte';
    import AwaitingApproval from '@/client/icons/AwaitingApproval.js';
    import Open from '@/client/icons/Open.js';
    import Warning from '@/client/icons/Warning.js';

    export let data;

    $: ({ missingStudents, inflatedUnapprovedProjects } = data);

    const CURRENT_YEAR = new Date().getFullYear();

    let excludeSeniors: boolean;

    let filteredMissingStudents: any[];
    let filteredInflatedUnapprovedProjects: any[];

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

<main class="flex flex-col">
    <h1 class="text-3xl text-center my-4">Project Week {CURRENT_YEAR} Status</h1>

    <div class="flex justify-around">
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
            
            <div class="inline-flex flex-col h-[50vh] overflow-y-auto rounded-xl" id="attention-list">
                {#each filteredMissingStudents as student}
                    {#if student.name}
                        <div class="attention-list-element">
                            <div class="flex flex-grow justify-center items-center">
                                <span>{student.name}</span>
                            </div>
                            <Icon src={Warning} color="orange" size="2rem"/>
                        </div>
                    {:else} 
                        <div class="attention-list-element gap-2">
                            <div class="flex flex-grow justify-center items-center">
                                <span>{student.email}</span>
                            </div>
                            <Icon src={Warning} color="red" size="2rem"/>
                        </div>
                    {/if}
                {/each}
                {#each filteredInflatedUnapprovedProjects as project}
                    <div class="attention-list-element gap-2">
                        <button class="rounded-md bg-slate-300 flex gap-2 items-center justify-center p-1 hover:bg-slate-400" on:click={() => window.open(`/admin/project-catalog/${project._id}`, "_blank")}>
                            <Icon src={Open} size="1.5rem"/>
                            <span>Open</span>
                        </button>
                        <div class="flex flex-grow justify-center items-center">
                            <span>{project.student.name} - {project.title}</span>
                        </div>
                        <Icon src={AwaitingApproval} color="goldenrod" size="2rem"/>
                    </div>
                {/each}
            </div>
        </div>
        <div class="inline-flex flex-col bg-zinc-400 p-6 rounded-2xl justify-center gap-2">
            <h2>Filters: </h2>

            <div class='flex items-center gap-2'>
                <input type="checkbox" class="w-4 h-4" bind:checked={excludeSeniors}/>
                <span>Exclude Seniors</span>
            </div>
        </div>
    </div>
</main>

<style lang="scss">
    .attention-list-element {
        display: flex;
        align-items: center;
        justify-content: space-between;

        padding: 0.5rem;

        &:nth-child(even) {
            background-color: #ddd;
        }
        
        &:nth-child(odd) {
            background-color: #e9e9e9;
        } 
    }
</style>