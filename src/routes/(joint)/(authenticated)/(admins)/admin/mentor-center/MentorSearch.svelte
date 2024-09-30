<script lang=ts>
    import { PUBLIC_ORIGIN } from "$env/static/public";
    import MentorModal from "./MentorModal.svelte";
    import { Circle } from "svelte-loading-spinners";

    let query = $state("");
    let mentors = $state([]);

    let loading = $state(false);

    function queryMentors(event?: SubmitEvent) {
        event?.preventDefault();
        if(!query) return;
        const url = new URL("/admin/api/mentor/search", PUBLIC_ORIGIN);
        url.searchParams.set('q', query);
        loading = true;
        fetch(url)
            .then(data => data.json())
            .then(json => {
                mentors = json.mentors
                loading = false;
            });
    }

    let activeMentor = $state();
</script>

{#if activeMentor}
<MentorModal mentor={activeMentor} onclose={() => {
    activeMentor = undefined
    queryMentors();
}}/>
{/if}

<div class="h-full w-full grid grid-rows-[auto_auto_minmax(0,_1fr)] gap-2">
    <h2 class="text-xl mb-4 text-center">Mentor Search</h2>

    <form class="flex w-full" onsubmit={queryMentors}>
        <input
            placeholder="Search..."
            class="w-full p-2 px-3 box-border rounded-l-lg outline-none"
            bind:value={query}
            type="search"
            autofocus
        />
        <button class="text-white text-base rounded-r-lg p-2 bg-sky-600 hover:bg-sky-700" type="submit">Search</button>
    </form>

    {#if loading}
    <div class="flex flex-col items-center justify-start">
        <div class="p-10">
            <Circle />
        </div>
    </div>
    {:else if mentors.length > 0}
    <div class="h-full overflow-y-scroll">
        <div class="grid grid-cols-2 items-center justify-center gap-2 p-2">
            {#each mentors as mentor}
            <button class="grid grid-cols-subgrid col-span-full p-2 rounded-l-full rounded-r-full bg-slate-200 hover:bg-slate-300" onclick={() => activeMentor = mentor}>
                <div class="flex items-center">
                    <span class="text-nowrap overflow-clip overflow-ellipsis w-full px-4 text-left">{mentor.name}</span>
                </div>
                <div class="flex items-center">
                    <span class="text-nowrap overflow-clip overflow-ellipsis w-full px-4 text-left">{mentor.organization}</span>
                </div>
            </button>
            {/each}
        </div>
    </div>
    {:else}
    <div class="flex flex-col items-center justify-start">
        <div class="p-2">
            <span class="text-gray-500">Enter a search query to start...</span>
        </div>
    </div>
    {/if}
</div>
