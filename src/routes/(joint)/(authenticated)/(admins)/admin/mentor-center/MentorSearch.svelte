<script lang="ts">
    import { browser } from "$app/environment";
    import { ExternalLink, Pencil } from "lucide-svelte";
    import { Circle } from "svelte-loading-spinners";
    import { onMount } from "svelte";
    import MentorModal from "./MentorModal.svelte";

    interface MentorProject {
        _id: string;
        title: string;
        year: number;
        studentName: string;
    }
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
        onSelectPrimary,
        onSelectDuplicate,
        primaryId = $bindable(),
        duplicateId = $bindable(),
    }: {
        onSelectPrimary?: (m: Mentor) => void;
        onSelectDuplicate?: (m: Mentor) => void;
        primaryId?: string;
        duplicateId?: string;
    } = $props();

    let query = $state("");
    let mentors: Mentor[] = $state([]);
    let loading = $state(false);
    let activeMentor: Mentor | undefined = $state(undefined);

    const QUERY_PARAM_NAME = "q";

    function setQueryParam(nextQuery: string) {
        if (!browser) return;

        const url = new URL(window.location.href);
        if (nextQuery) url.searchParams.set(QUERY_PARAM_NAME, nextQuery);
        else url.searchParams.delete(QUERY_PARAM_NAME);

        window.history.replaceState(window.history.state, "", url);
    }

    onMount(() => {
        if (!browser) return;

        const initialQuery =
            new URL(window.location.href).searchParams
                .get(QUERY_PARAM_NAME)
                ?.trim() || "";

        if (initialQuery) {
            query = initialQuery;
            queryMentors();
        }
    });

    async function queryMentors(event?: SubmitEvent) {
        event?.preventDefault();

        const trimmedQuery = query.trim();
        if (!trimmedQuery) {
            mentors = [];
            setQueryParam("");
            return;
        }

        query = trimmedQuery;
        setQueryParam(trimmedQuery);

        loading = true;
        try {
            const res = await fetch(
                `/admin/api/mentor/search?q=${encodeURIComponent(trimmedQuery)}`,
            );
            if (!res.ok) throw new Error();
            const data = await res.json();
            mentors = data.mentors ?? [];
        } catch {
            mentors = [];
        }
        loading = false;
    }
</script>

{#if activeMentor}
    <MentorModal
        mentor={activeMentor}
        onclose={() => {
            activeMentor = undefined;
            queryMentors();
        }}
    />
{/if}

<div
    class="h-full min-h-0 w-full grid grid-rows-[auto_auto_minmax(0,_1fr)] gap-2"
>
    <h2 class="text-xl mb-2 text-center font-semibold">Mentor Search</h2>

    <form class="flex w-full" onsubmit={queryMentors}>
        <input
            placeholder="Search by name or organization..."
            class="w-full p-2 px-3 box-border rounded-l-lg outline-none text-sm"
            bind:value={query}
            type="search"
            autofocus
        />
        <button
            class="text-white text-sm rounded-r-lg px-3 bg-sky-600 hover:bg-sky-700"
            type="submit">Search</button
        >
    </form>

    {#if loading}
        <div class="flex justify-center p-6"><Circle /></div>
    {:else if mentors.length > 0}
        <div class="h-full min-h-0 overflow-y-auto flex flex-col gap-2 p-1">
            {#each mentors as mentor}
                {@const isPrimary = primaryId === mentor._id}
                {@const isDuplicate = duplicateId === mentor._id}
                <div
                    class="rounded-xl border {isPrimary
                        ? 'border-green-400 bg-green-50'
                        : isDuplicate
                          ? 'border-red-400 bg-red-50'
                          : 'border-gray-300 bg-white'} p-3 flex flex-col gap-2"
                >
                    <!-- Mentor header -->
                    <div class="flex items-start justify-between gap-2">
                        <div class="flex-1 min-w-0">
                            <button
                                type="button"
                                class="text-left font-semibold text-base hover:underline cursor-pointer leading-tight inline-flex items-center gap-1"
                                onclick={() => (activeMentor = mentor)}
                            >
                                {mentor.name}
                                <Pencil size={13} class="text-gray-500" />
                            </button>
                            <p class="text-xs text-gray-600 truncate">
                                {mentor.organization}
                            </p>
                            <p class="text-xs text-gray-500">
                                {mentor.email}{#if mentor.phoneNumber}
                                    · {mentor.phoneNumber}{/if}
                            </p>
                        </div>
                        {#if isPrimary}
                            <span
                                class="text-xs font-bold text-green-700 bg-green-200 px-2 py-0.5 rounded-full shrink-0"
                                >Primary</span
                            >
                        {:else if isDuplicate}
                            <span
                                class="text-xs font-bold text-red-700 bg-red-200 px-2 py-0.5 rounded-full shrink-0"
                                >Duplicate</span
                            >
                        {/if}
                    </div>

                    <!-- Project pills -->
                    {#if mentor.projects && mentor.projects.length > 0}
                        <div class="flex flex-wrap gap-1">
                            {#each mentor.projects as proj}
                                <a
                                    href={`/admin/project-center/${proj._id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="text-xs bg-gray-100 border border-gray-200 rounded-full px-2 py-0.5 text-gray-700 hover:bg-gray-200 hover:border-gray-300 transition-colors max-w-[20rem] inline-flex items-center gap-2"
                                    title="Open project: {proj.title} ({proj.year}) — {proj.studentName}"
                                >
                                    <p>
                                        {proj.title}
                                        <span class="text-gray-400"
                                            >({proj.year})</span
                                        >
                                        <span class="text-gray-500">- {proj.studentName}</span>
                                    </p>
                                    <ExternalLink size={16} class="text-gray-500 shrink-0" />
                                </a>
                            {/each}
                            {#if (mentor.projectCount ?? 0) > (mentor.projects?.length ?? 0)}
                                <span class="text-xs text-gray-400 px-1"
                                    >+{(mentor.projectCount ?? 0) -
                                        (mentor.projects?.length ?? 0)} more</span
                                >
                            {/if}
                        </div>
                    {:else}
                        <span class="text-xs text-gray-400 italic"
                            >No projects</span
                        >
                    {/if}

                    <!-- Action buttons -->
                    {#if onSelectPrimary || onSelectDuplicate}
                        <div class="flex gap-1 flex-wrap">
                            {#if onSelectPrimary}
                                <button
                                    type="button"
                                    class="text-xs px-2 py-1 rounded-md {isPrimary
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-200 hover:bg-green-100 text-gray-700'}"
                                    onclick={() => onSelectPrimary!(mentor)}
                                >
                                    {isPrimary ? "✓ Primary" : "Set as Primary"}
                                </button>
                            {/if}
                            {#if onSelectDuplicate}
                                <button
                                    type="button"
                                    class="text-xs px-2 py-1 rounded-md {isDuplicate
                                        ? 'bg-red-500 text-white'
                                        : 'bg-gray-200 hover:bg-red-100 text-gray-700'}"
                                    onclick={() => onSelectDuplicate!(mentor)}
                                >
                                    {isDuplicate
                                        ? "✓ Duplicate"
                                        : "Set as Duplicate"}
                                </button>
                            {/if}
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
    {:else if query}
        <div class="flex justify-center p-4">
            <span class="text-gray-500 text-sm">No mentors found.</span>
        </div>
    {:else}
        <div class="flex justify-center p-4">
            <span class="text-gray-500 text-sm"
                >Enter a search query to start...</span
            >
        </div>
    {/if}
</div>
