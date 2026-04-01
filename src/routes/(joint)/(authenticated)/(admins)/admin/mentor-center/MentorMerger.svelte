<script lang=ts>
    import { Circle } from "svelte-loading-spinners";
    import { Merge, CircleCheckBig, CircleX } from "lucide-svelte";
    import { PUBLIC_ORIGIN } from "$env/static/public";

    interface MentorResult {
        _id: string;
        name: string;
        organization: string;
        email: string;
    }

    let primaryQuery = $state("");
    let duplicateQuery = $state("");

    let primaryResults: MentorResult[] = $state([]);
    let duplicateResults: MentorResult[] = $state([]);

    let primaryLoading = $state(false);
    let duplicateLoading = $state(false);

    let selectedPrimary: MentorResult | undefined = $state(undefined);
    let selectedDuplicate: MentorResult | undefined = $state(undefined);

    enum MergeStatus { Idle, Merging, Success, Error }
    let mergeStatus = $state(MergeStatus.Idle);
    let mergeError = $state("");

    async function searchMentors(query: string, setResults: (r: MentorResult[]) => void, setLoading: (v: boolean) => void) {
        if (!query.trim()) return;
        setLoading(true);
        try {
            const url = new URL("/admin/api/mentor/search", PUBLIC_ORIGIN);
            url.searchParams.set("q", query);
            const res = await fetch(url);
            if (!res.ok) throw new Error(`Search failed: ${res.status}`);
            const data = await res.json();
            setResults(data.mentors);
        } catch {
            setResults([]);
        } finally {
            setLoading(false);
        }
    }

    function searchPrimary(e?: SubmitEvent) {
        e?.preventDefault();
        searchMentors(primaryQuery, (r) => primaryResults = r, (v) => primaryLoading = v);
    }

    function searchDuplicate(e?: SubmitEvent) {
        e?.preventDefault();
        searchMentors(duplicateQuery, (r) => duplicateResults = r, (v) => duplicateLoading = v);
    }

    async function mergeMentors() {
        if (!selectedPrimary || !selectedDuplicate) return;
        mergeStatus = MergeStatus.Merging;
        mergeError = "";
        const res = await fetch("/admin/api/mentor/merge", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                primaryId: selectedPrimary._id,
                duplicateId: selectedDuplicate._id,
            }),
        });
        if (res.ok) {
            mergeStatus = MergeStatus.Success;
            selectedPrimary = undefined;
            selectedDuplicate = undefined;
            primaryResults = [];
            duplicateResults = [];
            primaryQuery = "";
            duplicateQuery = "";
        } else {
            const body = await res.json().catch(() => ({ message: "Unknown error" }));
            mergeError = body.message ?? "Merge failed";
            mergeStatus = MergeStatus.Error;
        }
    }

    function reset() {
        mergeStatus = MergeStatus.Idle;
        mergeError = "";
        selectedPrimary = undefined;
        selectedDuplicate = undefined;
    }
</script>

<div class="flex flex-col gap-4 w-full">
    {#if mergeStatus === MergeStatus.Success}
    <div class="flex flex-col items-center gap-2 py-4">
        <CircleCheckBig size={40} color="#383" />
        <span class="text-green-700 font-semibold">Mentors merged successfully!</span>
        <button class="bg-blue-500 hover:bg-blue-600 text-white rounded-md p-2 px-4 mt-2" onclick={reset}>Merge another</button>
    </div>
    {:else}
    <div class="grid grid-cols-2 gap-4">
        <!-- Primary Mentor -->
        <div class="flex flex-col gap-2">
            <span class="font-semibold text-sm text-gray-700">Keep (Primary):</span>
            {#if selectedPrimary}
            <div class="bg-green-100 border border-green-400 rounded-lg p-3 flex flex-col gap-1 relative">
                <span class="font-bold text-sm">{selectedPrimary.name}</span>
                <span class="text-xs text-gray-600">{selectedPrimary.organization}</span>
                <span class="text-xs text-gray-500">{selectedPrimary.email}</span>
                <button class="absolute top-1 right-2 text-gray-400 hover:text-gray-700 text-xs" onclick={() => selectedPrimary = undefined}>✕</button>
            </div>
            {:else}
            <form class="flex" onsubmit={searchPrimary}>
                <input
                    placeholder="Search primary..."
                    class="flex-1 p-1 px-2 rounded-l-md border border-gray-300 outline-none text-sm"
                    bind:value={primaryQuery}
                    type="search"
                />
                <button class="bg-sky-600 hover:bg-sky-700 text-white text-sm px-3 rounded-r-md" type="submit">Search</button>
            </form>
            {#if primaryLoading}
            <div class="flex justify-center py-2"><Circle size={20} /></div>
            {:else if primaryResults.length > 0}
            <div class="flex flex-col gap-1 max-h-40 overflow-y-auto">
                {#each primaryResults as m}
                <button
                    class="text-left p-2 rounded-md bg-gray-100 hover:bg-gray-200 border border-gray-300 text-sm"
                    onclick={() => { selectedPrimary = m; primaryResults = []; }}
                >
                    <span class="font-medium">{m.name}</span>
                    <span class="text-gray-500 ml-1 text-xs">— {m.organization}</span>
                </button>
                {/each}
            </div>
            {/if}
            {/if}
        </div>

        <!-- Duplicate Mentor -->
        <div class="flex flex-col gap-2">
            <span class="font-semibold text-sm text-gray-700">Remove (Duplicate):</span>
            {#if selectedDuplicate}
            <div class="bg-red-100 border border-red-400 rounded-lg p-3 flex flex-col gap-1 relative">
                <span class="font-bold text-sm">{selectedDuplicate.name}</span>
                <span class="text-xs text-gray-600">{selectedDuplicate.organization}</span>
                <span class="text-xs text-gray-500">{selectedDuplicate.email}</span>
                <button class="absolute top-1 right-2 text-gray-400 hover:text-gray-700 text-xs" onclick={() => selectedDuplicate = undefined}>✕</button>
            </div>
            {:else}
            <form class="flex" onsubmit={searchDuplicate}>
                <input
                    placeholder="Search duplicate..."
                    class="flex-1 p-1 px-2 rounded-l-md border border-gray-300 outline-none text-sm"
                    bind:value={duplicateQuery}
                    type="search"
                />
                <button class="bg-sky-600 hover:bg-sky-700 text-white text-sm px-3 rounded-r-md" type="submit">Search</button>
            </form>
            {#if duplicateLoading}
            <div class="flex justify-center py-2"><Circle size={20} /></div>
            {:else if duplicateResults.length > 0}
            <div class="flex flex-col gap-1 max-h-40 overflow-y-auto">
                {#each duplicateResults as m}
                <button
                    class="text-left p-2 rounded-md bg-gray-100 hover:bg-gray-200 border border-gray-300 text-sm"
                    onclick={() => { selectedDuplicate = m; duplicateResults = []; }}
                >
                    <span class="font-medium">{m.name}</span>
                    <span class="text-gray-500 ml-1 text-xs">— {m.organization}</span>
                </button>
                {/each}
            </div>
            {/if}
            {/if}
        </div>
    </div>

    {#if mergeStatus === MergeStatus.Error}
    <div class="flex items-center gap-2 text-red-600 text-sm">
        <CircleX size={18} />
        <span>{mergeError}</span>
    </div>
    {/if}

    <button
        class="flex items-center gap-2 self-start bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-md p-2 px-4"
        disabled={!selectedPrimary || !selectedDuplicate || mergeStatus === MergeStatus.Merging}
        onclick={mergeMentors}
    >
        {#if mergeStatus === MergeStatus.Merging}
        <Circle size={18} />
        {:else}
        <Merge size={18} />
        {/if}
        <span class="text-sm">Merge (keep primary, remove duplicate)</span>
    </button>

    <span class="text-xs text-gray-500">All projects linked to the duplicate will be re-linked to the primary. The duplicate's information will be archived before deletion.</span>
    {/if}
</div>
