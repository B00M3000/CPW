<script lang=ts>
    import { ArrowLeft, CircleCheckBig, CircleX, Trash2, BookUser } from "lucide-svelte";
    import MentorSearch from "./MentorSearch.svelte";
    import { Circle3 } from "svelte-loading-spinners";
    import { browser } from "$app/environment";

    let unlikedMentorPromise = $state(new Promise(() => {}));
    if(browser) unlikedMentorPromise = fetch('/admin/api/mentor/unlinked').then(res => res.json());

    async function purge() {
        await fetch('/admin/api/mentor/unlinked', { method: "DELETE" })
        unlikedMentorPromise = fetch('/admin/api/mentor/unlinked').then(res => res.json());
    }
</script>

<main class="w-full h-full p-4">
    <div class="relative w-full h-full bg-gray-300 rounded-xl p-8 grid grid-rows-[auto_minmax(0,_1fr)]">
        <h1 class="text-4xl mb-8 flex items-center justify-center gap-4"><BookUser size={48} /> Mentor Center</h1>
        <div class="mentor-center-content-grid h-full">
            <div class="grid-search h-full w-full p-8 px-12 rounded-lg">
                <MentorSearch />
            </div>
            <div class="grid-edit h-full w-full p-8 rounded-lg flex flex-col items-start">
                <h2 class="text-xl mb-4 text-center">Extras:</h2>
                <span class="mb-2">If you want to create a mentor, go to the relavent project in the project center.</span>
                <div class="flex items-center">
                    {#await unlikedMentorPromise}
                    <span class="mr-2">Unlinked Mentors: ...</span>
                    <Circle3 size={24}/>
                    {:then data}
                    <span class="mr-2">Unlinked Mentors: {data.unlinkedCount}</span>
                    {#if data.unlinkedCount > 0}
                    <button class="bg-red-500 hover:bg-red-500 flex items-center gap-1 p-1 text-white rounded-md" onclick={purge}>
                        <Trash2 size={16}/>
                        <span class="text-xs">Purge</span>
                    </button>
                    {:else}
                    <CircleCheckBig size={20} strokeWidth={3} color="#383" />
                    {/if}
                    {:catch}
                    <span class="mr-2">Error when counting unlinked mentors.</span>
                    <CircleX color=red size={20}/>
                    {/await}
                </div>
            </div>
            <div class="grid-deduplication h-full w-full p-8 rounded-lg flex flex-col items-start">
                <h2 class="text-xl mb-4 text-center">Mentor Deduplication</h2>
                <div class="flex items-center justify-center mt-8 w-full">
                    <span>To be implemented.</span>
                </div>
            </div>
        </div>
        <a class="absolute top-0 left-0 bg-blue-500 hover:bg-blue-600 p-2 px-3 m-8 rounded-lg flex gap-2 items-center text-white" href=/admin>
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

    .grid-search { grid-area: search; background-color: #bdc4cd; }
    .grid-edit { grid-area: edit; background-color: #bdc4cd; }
    .grid-deduplication { grid-area: deduplication; background-color: #bdc4cd; }
</style>
