<script lang="ts">
    import {
        ArrowLeft,
        CircleCheckBig,
        CircleX,
        Trash2,
        BookUser,
    } from "lucide-svelte";
    import MentorSearch from "./MentorSearch.svelte";
    import MentorMerger from "./MentorMerger.svelte";
    import { Circle3 } from "svelte-loading-spinners";
    import { browser } from "$app/environment";

    async function loadUnlinkedMentorCount() {
        const res = await fetch("/admin/api/mentor/unlinked");
        if (!res.ok) {
            throw new Error(`Unable to load unlinked mentors (${res.status}).`);
        }
        return await res.json();
    }

    let unlinkedMentorPromise = $state(new Promise(() => {}));
    if (browser) unlinkedMentorPromise = loadUnlinkedMentorCount();

    async function purge() {
        const res = await fetch("/admin/api/mentor/unlinked", {
            method: "DELETE",
        });
        if (!res.ok) {
            throw new Error(
                `Unable to purge unlinked mentors (${res.status}).`,
            );
        }
        unlinkedMentorPromise = loadUnlinkedMentorCount();
    }

    // Shared merge selection state lifted from MentorSearch → MentorMerger
    let primaryMentor: any = $state(undefined);
    let duplicateMentor: any = $state(undefined);
</script>

<main class="w-full h-full p-4">
    <div
        class="relative w-full h-full rounded-xl p-8 grid grid-rows-[auto_minmax(0,_1fr)]"
    >
        <h1 class="text-4xl mb-8 flex items-center justify-center gap-4">
            <BookUser size={48} /> Mentor Center
        </h1>
        <div class="mentor-center-content-grid h-full min-h-0">
            <div
                class="grid-search h-full min-h-0 w-full p-8 px-12 rounded-lg bg-gray-200 border border-solid border-gray-400 overflow-hidden"
            >
                <MentorSearch
                    onSelectPrimary={(m) => (primaryMentor = m)}
                    onSelectDuplicate={(m) => (duplicateMentor = m)}
                    primaryId={primaryMentor?._id}
                    duplicateId={duplicateMentor?._id}
                />
            </div>
            <div
                class="grid-edit h-full w-full p-8 rounded-lg bg-gray-200 border border-solid border-gray-400 flex flex-col items-start"
            >
                <h2 class="text-xl mb-4 text-center font-semibold">Extras:</h2>
                <span class="mb-2 text-sm"
                    >To create a mentor, go to the relevant project in the
                    project center.</span
                >
                <div class="flex items-center">
                    {#await unlinkedMentorPromise}
                        <span class="mr-2">Unlinked Mentors: ...</span>
                        <Circle3 size={24} />
                    {:then data}
                        <span class="mr-2"
                            >Unlinked Mentors: {(data as any)
                                .unlinkedCount}</span
                        >
                        {#if (data as any).unlinkedCount > 0}
                            <button
                                class="bg-red-500 hover:bg-red-500 flex items-center gap-1 p-1 text-white rounded-md"
                                onclick={purge}
                            >
                                <Trash2 size={16} />
                                <span class="text-xs">Purge</span>
                            </button>
                        {:else}
                            <CircleCheckBig
                                size={20}
                                strokeWidth={3}
                                color="#383"
                            />
                        {/if}
                    {:catch err}
                        <span class="mr-2"
                            >{(err as Error)?.message ||
                                "Error when counting unlinked mentors."}</span
                        >
                        <CircleX color="red" size={20} />
                    {/await}
                </div>
            </div>
            <div
                class="grid-deduplication h-full min-h-0 w-full p-6 rounded-lg bg-gray-200 border border-solid border-gray-400 overflow-hidden"
            >
                <MentorMerger
                    bind:primary={primaryMentor}
                    bind:duplicate={duplicateMentor}
                />
            </div>
        </div>
        <a
            class="absolute top-0 left-0 bg-blue-500 hover:bg-blue-600 p-2 px-3 m-8 rounded-lg flex gap-2 items-center text-white"
            href="/admin"
        >
            <ArrowLeft />
            <span>Back to Admin Dashboard</span>
        </a>
    </div>
</main>

<style>
    .mentor-center-content-grid {
        display: grid;
        grid-template-columns: 4fr 3fr;
        grid-template-rows: auto minmax(0, 1fr);
        grid-template-areas:
            "search edit"
            "search deduplication";
        gap: 1.5rem;
    }

    .grid-search {
        grid-area: search;
    }
    .grid-edit {
        grid-area: edit;
    }
    .grid-deduplication {
        grid-area: deduplication;
    }
</style>
