<script lang="ts">
    import { currentYear } from '@/lib/utils';
    import MissingStudents from './MissingStudents.svelte';
    import UnapprovedStudents from './UnapprovedStudents.svelte';
    import { ArrowLeft } from 'lucide-svelte';
    import IgnoredStudents from './IgnoredStudents.svelte';

    let { data } = $props();
    let { missingStudents, inflatedUnapprovedProjects, ignoredStudents } = $derived(data);

    const CURRENT_YEAR = currentYear();

    let excludeSeniors: boolean = $state(false);

    let filteredMissingStudents: any[] = $state([]);
    let filteredInflatedUnapprovedProjects: any[] = $state([]);

    $effect(applyFilter);

    function applyFilter() {
        if(excludeSeniors) {
            filteredMissingStudents = missingStudents.filter(student => student.graduationYear != CURRENT_YEAR && excludeSeniors);
            filteredInflatedUnapprovedProjects = inflatedUnapprovedProjects.filter(project => project.student.graduationYear != CURRENT_YEAR && excludeSeniors);
        } else {
            filteredMissingStudents = missingStudents;
            filteredInflatedUnapprovedProjects = inflatedUnapprovedProjects;
        }
    }

    applyFilter()
</script>

<main class="p-8 bg-white">
    <div class="relative rounded-xl bg-gray-200 p-8 flex flex-col items-center">
        <a class="absolute top-0 left-0 bg-blue-500 hover:bg-blue-600 p-2 px-3 m-8 rounded-lg flex gap-2 items-center text-white" href=/admin>
            <ArrowLeft />
            <span>Back to Admin Dashboard</span>
        </a>
        <h1 class="text-4xl text-center mb-5">Project Week {CURRENT_YEAR}</h1>
        <div class="flex flex-col gap-4 m-5 w-[54rem] bg-gray-300 p-8 rounded-xl">
            <span class="text-xl">Filters:</span>
            <div class="flex items-center gap-2 ml-4">
                <label for="excludeSeniors">Exclude Seniors: </label>
                <input type="checkbox" bind:checked={excludeSeniors}>
            </div>
        </div>
        <div class="flex flex-col gap-4 m-5 w-[54rem] bg-gray-300 p-8 rounded-xl">
            <span class="text-xl">Students Needing Attention:</span>
            <div class="flex flex-col gap-3 justify-start ml-4">
                <span>Total Count: {filteredMissingStudents.length + filteredInflatedUnapprovedProjects.length}</span>
                <span>No Project: {filteredMissingStudents.length}</span>
                <span>Awaiting Approval: {filteredInflatedUnapprovedProjects.length}</span>
            </div>
        </div>
        <UnapprovedStudents inflatedUnapprovedProjects={filteredInflatedUnapprovedProjects} />
        <MissingStudents missingStudents={filteredMissingStudents} ignoredStudents={ignoredStudents}/>
        <IgnoredStudents ignoredStudents={ignoredStudents} />
    </div>
</main>
