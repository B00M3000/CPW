<script lang=ts>
    import { ArrowLeft, Plus, Info, Copy } from "lucide-svelte";
    import { currentYear } from "@/lib/utils";
    import Warning from "@/client/icons/Warning";
    import AwaitingApproval from "@/client/icons/AwaitingApproval";
    import Icon from "@/client/components/Icon.svelte";
    import NamePlusPicture from "./NamePlusPicture.svelte";
    import Open from "@/client/icons/Open";
    import toast from "svelte-french-toast";

    const CURRENT_YEAR = currentYear();

    let { data } = $props();

    let missingStudents = $derived(data.missingStudents);
    let inflatedUnapprovedProjects = $derived(data.inflatedUnapprovedProjects)

    let excludeSeniors: boolean = $state(false);

    let filteredMissingStudents: any[] = $derived(excludeSeniors ? missingStudents.filter(student => student.graduationYear != CURRENT_YEAR && excludeSeniors) : missingStudents);
    let filteredInflatedUnapprovedProjects: any[] = $derived(excludeSeniors? inflatedUnapprovedProjects.filter(project => project.student.graduationYear != CURRENT_YEAR && excludeSeniors) : inflatedUnapprovedProjects);
</script>

<main class="w-full h-full p-4">
    <div class="relative w-full h-full bg-gray-300 rounded-xl p-8 grid grid-rows-[auto_minmax(0,_1fr)]">
        <h1 class="text-4xl mb-8 flex items-center justify-center gap-4"><Info size={48} /> Year {CURRENT_YEAR} Status</h1>
        <div class="project-center-content-grid h-full">
            <div class="grid-create h-full w-full p-12 py-8 rounded-lg flex flex-col items-left gap-2">
                <h2 class="text-xl mb-2 text-left">Email List Compiler:</h2>
                <button class="bg-blue-500 hover:bg-blue-500 flex items-center gap-1 p-2 text-white rounded-md" onclick={() => {
                    navigator.clipboard.writeText(filteredMissingStudents.map(s => s.email).join(','))
                    toast.success("Copied email addresses of those who haven't created a project yet (respecting filter)!")
                }}>
                    <Copy size={32}/>
                    <span class="text-sm">Copy email addresses of those who haven't created a project yet (respecting filter).</span>
                </button>
                <button class="bg-blue-500 hover:bg-blue-500 flex items-center gap-1 p-2 text-white rounded-md" onclick={() => {
                    navigator.clipboard.writeText(filteredInflatedUnapprovedProjects.map(p => p.student.email).join(','))
                    toast.success("Copied email addresses of those who haven't obtained advisor approval yet (respecting filter)!")
                }}>
                    <Copy size={32}/>
                    <span class="text-sm">Copy email addresses of those who haven't obtained advisor approval yet (respecting filter).</span>
                </button>
            </div>
            <div class="grid-other h-full w-full p-8 px-12 rounded-lg flex flex-col items-start">
                <h2 class="text-xl mb-4 text-center">Options:</h2>
                <div class='flex items-center gap-2'>
                    <input type="checkbox" class="w-4 h-4" bind:checked={excludeSeniors}/>
                    <span>Exclude Seniors</span>
                </div>
            </div>
            <div class="grid-search h-full w-full p-8 px-12 rounded-lg flex flex-col items-start gap-4">
                <h2 class="text-xl mb-4 text-center">Students Needing Attention</h2>
                <div class="flex justify-center gap-5">
                    <span class="text-center">Total Count: {filteredMissingStudents.length + filteredInflatedUnapprovedProjects.length}</span>
                    <span class="text-center">No Project: {filteredMissingStudents.length}</span>
                    <span class="text-center">Awaiting Approval: {filteredInflatedUnapprovedProjects.length}</span>
                </div>
                <div class="flex gap-6 justify-around bg-stone-300 rounded-lg p-2 w-full">
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
                {#if filteredMissingStudents.length == 0 && filteredInflatedUnapprovedProjects.length == 0}
                <span class="flex justify-center items-center text-center bg-gray-300 w-[36rem] p-2">Everything looks good!</span>
                {:else}
                <div class="attention-grid">
                    {#each filteredMissingStudents as student}
                    <div class="attention-list-element col-span-full grid grid-cols-subgrid items-center justify-between gap-2">
                        {#if currentYear(new Date(student.lastVisit)) == currentYear()}
                            <Icon src={Warning} color="orange" size="2rem"/>
                        {:else}
                            <Icon src={Warning} color="red" size="2rem"/>
                        {/if}

                        <div class="col-span-3">
                            <NamePlusPicture user={student}/>
                        </div>

                        <div></div>
                    </div>
                    {/each}
                    {#each filteredInflatedUnapprovedProjects as project}
                    <div class="attention-list-element col-span-full grid grid-cols-subgrid items-center justify-center">
                        <Icon src={AwaitingApproval} color="goldenrod" size="2rem"/>
                        <NamePlusPicture user={project.student}/>
                        <span class="max-w-[16rem] overflow-ellipsis overflow-clip">{project.title}</span>
                        <NamePlusPicture user={project.advisor}/>
                        <a class="rounded-md bg-slate-300 flex gap-2 items-center justify-center p-2 hover:bg-slate-400" href='/admin/project-center/{project._id}?close-window=true' target=_blank>
                            <Icon src={Open} size="1.5rem"/>
                            <span>Open</span>
                        </a>
                    </div>
                    {/each}
                </div>
                {/if}
            </div>
        </div>
        <a class="absolute top-0 left-0 bg-blue-500 hover:bg-blue-600 p-2 px-3 m-8 rounded-lg flex gap-2 items-center text-white" href=/admin>
            <ArrowLeft />
            <span>Back to Admin Dashboard</span>
        </a>
    </div>
</main>

<slot />

<style>
    .attention-grid {
        display: grid;
        grid-template-columns: auto auto minmax(0, 1fr) auto auto;
        height: 100%;
        overflow-y: auto;
        width: 100%;
        align-items: center;
        justify-content: center;
    }
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

    .project-center-content-grid {
        display: grid;
        grid-template-columns: 7fr 3fr;
        grid-template-rows: auto minmax(0, 1fr);
        grid-template-areas:
            "search create"
            "search other";
        gap: 1.5rem;
    }

    .grid-create { grid-area: create; background-color: #bdc4cd; }
    .grid-search { grid-area: search; background-color: #bdc4cd; }
    .grid-other { grid-area: other; background-color: #bdc4cd; }
</style>
