<script lang=ts>
    import { Circle } from "svelte-loading-spinners";
    import { Merge, CircleCheckBig, CircleX, X } from "lucide-svelte";

    interface MentorProject { _id: string; title: string; year: number; studentName: string; }
    interface Mentor {
        _id: string;
        name: string;
        organization: string;
        email: string;
        phoneNumber?: string;
        projects?: MentorProject[];
        projectCount?: number;
    }

    let {
        primary = $bindable(undefined),
        duplicate = $bindable(undefined),
    }: {
        primary?: Mentor;
        duplicate?: Mentor;
    } = $props();

    enum MergeStatus { Idle, Merging, Success, Error }
    let mergeStatus = $state(MergeStatus.Idle);
    let mergeError = $state("");

    async function mergeMentors() {
        if (!primary || !duplicate) return;
        mergeStatus = MergeStatus.Merging;
        mergeError = "";
        const res = await fetch("/admin/api/mentor/merge", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ primaryId: primary._id, duplicateId: duplicate._id }),
        });
        if (res.ok) {
            mergeStatus = MergeStatus.Success;
            primary = undefined;
            duplicate = undefined;
        } else {
            const body = await res.json().catch(() => ({ message: "Unknown error" }));
            mergeError = body.message ?? "Merge failed";
            mergeStatus = MergeStatus.Error;
        }
    }

    function reset() {
        mergeStatus = MergeStatus.Idle;
        mergeError = "";
        primary = undefined;
        duplicate = undefined;
    }

    // Combine projects from both mentors for the preview
    let allProjects = $derived([
        ...(primary?.projects ?? []).map(p => ({ ...p, keepMentor: primary?.name })),
        ...(duplicate?.projects ?? []).map(p => ({ ...p, keepMentor: primary?.name })),
    ]);
</script>

<div class="flex flex-col gap-3 w-full h-full">
    <h2 class="text-xl font-semibold text-center">Mentor Deduplication</h2>

    {#if mergeStatus === MergeStatus.Success}
    <div class="flex flex-col items-center gap-2 py-4">
        <CircleCheckBig size={40} color="#383" />
        <span class="text-green-700 font-semibold">Mentors merged successfully!</span>
        <button class="bg-blue-500 hover:bg-blue-600 text-white rounded-md p-2 px-4 text-sm" onclick={reset}>Merge another</button>
    </div>
    {:else}

    <p class="text-xs text-gray-500">Use the Mentor Search panel on the left to select which mentor to keep as <span class="font-semibold text-green-700">Primary</span> and which to remove as the <span class="font-semibold text-red-700">Duplicate</span>.</p>

    <!-- Selected mentors preview -->
    <div class="grid grid-cols-2 gap-2">
        <!-- Primary -->
        <div class="flex flex-col gap-1">
            <span class="text-xs font-bold text-green-700 uppercase">Keep (Primary)</span>
            {#if primary}
            <div class="bg-green-50 border border-green-400 rounded-lg p-3 flex flex-col gap-1 relative">
                <button class="absolute top-1 right-1 text-gray-400 hover:text-gray-700" onclick={() => primary = undefined}><X size={12}/></button>
                <span class="font-bold text-sm pr-4">{primary.name}</span>
                <span class="text-xs text-gray-600">{primary.organization}</span>
                <span class="text-xs text-gray-500">{primary.email}</span>
            </div>
            {:else}
            <div class="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-3 flex items-center justify-center min-h-16">
                <span class="text-xs text-gray-400">Select from search →</span>
            </div>
            {/if}
        </div>

        <!-- Duplicate -->
        <div class="flex flex-col gap-1">
            <span class="text-xs font-bold text-red-700 uppercase">Remove (Duplicate)</span>
            {#if duplicate}
            <div class="bg-red-50 border border-red-400 rounded-lg p-3 flex flex-col gap-1 relative">
                <button class="absolute top-1 right-1 text-gray-400 hover:text-gray-700" onclick={() => duplicate = undefined}><X size={12}/></button>
                <span class="font-bold text-sm pr-4">{duplicate.name}</span>
                <span class="text-xs text-gray-600">{duplicate.organization}</span>
                <span class="text-xs text-gray-500">{duplicate.email}</span>
            </div>
            {:else}
            <div class="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-3 flex items-center justify-center min-h-16">
                <span class="text-xs text-gray-400">Select from search →</span>
            </div>
            {/if}
        </div>
    </div>

    <!-- Projects that will be re-linked -->
    {#if allProjects.length > 0 && primary && duplicate}
    <div class="flex flex-col gap-1">
        <span class="text-xs font-semibold text-gray-600 uppercase">Projects to be re-linked to {primary.name}:</span>
        <div class="flex flex-wrap gap-1 max-h-24 overflow-y-auto border border-gray-200 rounded-md p-2 bg-gray-50">
            {#each allProjects as proj}
            <span class="text-xs bg-blue-100 border border-blue-200 rounded-full px-2 py-0.5 text-blue-800" title="{proj.studentName}">
                {proj.title} <span class="text-blue-500">({proj.year})</span>
            </span>
            {/each}
        </div>
    </div>
    {/if}

    {#if mergeStatus === MergeStatus.Error}
    <div class="flex items-center gap-2 text-red-600 text-sm">
        <CircleX size={18} />
        <span>{mergeError}</span>
    </div>
    {/if}

    <button
        class="flex items-center gap-2 self-start bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-md p-2 px-4 text-sm"
        disabled={!primary || !duplicate || primary?._id === duplicate?._id || mergeStatus === MergeStatus.Merging}
        onclick={mergeMentors}
    >
        {#if mergeStatus === MergeStatus.Merging}<Circle size={16} />{:else}<Merge size={16} />{/if}
        <span>Merge (keep primary, remove duplicate)</span>
    </button>

    <span class="text-xs text-gray-400">All projects linked to the duplicate will be re-linked to the primary. The duplicate's information will be archived before deletion.</span>
    {/if}
</div>
