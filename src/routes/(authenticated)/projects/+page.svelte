<script lang="ts">
    import { goto } from "$app/navigation";
    import YearFilter from "@/client/components/YearFilter.svelte";
    import MultiSelect from "@/client/components/MultiSelect.svelte";
    import tags from "@/lib/tags.js";
    import ProjectCard from "@/client/components/ProjectCard.svelte";
    import { page } from "$app/stores";

    export let data;

    $: ({ projects } = data);

    $: searchParams = $page.url.searchParams

    let query: string;
    let yearUpper: number | undefined;
    let yearLower: number | undefined;
    let mentorSearch: string;
    let studentSearch: string;
    let selected: string[];

    function syncFields(){
        query = searchParams?.get("query") || "";
        yearUpper = ((yu: string | null) => yu ? parseInt(yu) : undefined || new Date().getFullYear())(searchParams?.get("yearUpper"));
        yearLower = ((yl: string | null) => yl ? parseInt(yl) : undefined || 2019)(searchParams?.get("yearLower"));
        mentorSearch = searchParams?.get("mentorSearch") || "";
        studentSearch = searchParams?.get("studentSearch") || "";
        selected = searchParams?.get("tags")?.split("_") || [];
    }

    syncFields();

    async function search(e: Event){
        e.preventDefault();

        const searchParams = new URLSearchParams();

        if(selected.length > 0) searchParams.set("tags", selected.join("_"));
        if(yearUpper) searchParams.set("yearUpper", yearUpper.toString());
        if(yearLower) searchParams.set("yearLower", yearLower.toString())
        if(mentorSearch) searchParams.set("mentorSearch", mentorSearch);
        if(studentSearch) searchParams.set("studentSearch", studentSearch);
        if(query) searchParams.set("query", query)

        await goto(`/projects?${searchParams}`, { replaceState: true });
    }
</script>



<main>
    
    <div class="head">
        <div class="search">
            <input
                placeholder="Search..."
                size="90"
                id="search-box"
                class="search-box"
                bind:value={query}
                type="text"
            />
            <button class="button" on:click={search}>Search</button>

            <button class="button" on:click={async () => {
                await goto(`/projects`);
                syncFields();
            }}>Clear</button>
        </div>
    </div>


    <div class="leftright">
        <div class="sidebar">
            <h1>Refine Search</h1>
            <hr />
            <h1 class="filter-labels">
                Filter by Year:
                <YearFilter bind:yearLowerBound={yearLower} bind:yearUpperBound={yearUpper}/>
            </h1>

            <label class="filter-labels">
                Filter by Mentor:
                <input class="SearchFilter" type="search" placeholder="Search Mentor" bind:value={mentorSearch}/>
            </label>

            <label class="filter-labels">
                Filter by Student:
                <input
                    class="SearchFilter"
                    type="search"
                    placeholder="Search Student"
                    bind:value={studentSearch}
                />
            </label>

            <h1 class="filter-labels">
                Filter by tags:
                <MultiSelect options={Object.entries(tags).map(([key, value]) => ({ key, value, }))} bind:selectedValues={selected} />
            </h1>
            <div>
                <button on:click = {search}>Search</button>
            </div>
        </div>

        <div class="results">
            {#if projects.length === 0}
                <h1 class="no-results"> No results for "{`${ query.length < 20 ? query : query.slice(0, 17) + "..."}`}" were found.</h1>
            {:else}
                {#each projects as project}
                    <ProjectCard {project} />
                {/each}
            {/if}
            
        </div>
        
    </div>
</main>


<style lang="scss">
    .head {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: left;
        background-color: #d0d0d0;
        width: 100%;
        height: 8vh;
        max-height: 8vh;
        outline: 2px solid black;
        z-index: 20;
    }

    .search {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
    }

    .SearchFilter {
        background-color: #525252;
        color: white;
        padding: 2px;
        font-size: 16px;
        border-radius: 5px;
        margin-bottom: 1rem;
        border: 2px solid black;
        border-radius: 5px;
    }

    .filter-labels {
        margin-top: 1rem;
        font-size: 15px;
        font-weight: 900;
    }

    .search-box {
        padding: 10px 20px;
        margin: 8px 2rem;
        box-sizing: border-box;
        border: 2px solid rgb(0, 0, 0);
        border-radius: 0px;
    }

    .button {
        padding: 10px 5px;
        margin: 8px;
        box-sizing: border-box;
    }

    main {
        display: flex;

        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .leftright {
        display: flex;
        max-width: calc(100vw - (100vw - 100%));
    }

    .sidebar {
        flex: 0 0 240px;
        max-width: 240px;
        height: calc(100vh - 8vh - var(--nav-bar-height));
        background-color: #777777;
        padding-left: 2rem;
        overflow-y: hidden;
        padding-top: 0px;
    }

    .sidebar h1 {
        margin-bottom: 15px;
        font-weight: bold;
    }

    .sidebar hr {
        border: none;
        border-top: 2px #ff0000 solid;
        height: 8px;
        width: 120px;
        align-self: left;
        margin-left: 1px;
    }

    .sidebar label {
        display: block;
        margin-bottom: 10px;
    }

    .sidebar input {
        margin-right: 5px;
    }

    .results {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        width: calc(100vw - 240px);
        max-width: calc(100vw - (100vw - 100%));
        gap: 1em;
        overflow-y: scroll;
        padding-top: 20px;
        padding-bottom: 10px;
        height: calc(100vh - 8vh - var(--nav-bar-height) - 20px - 10px);
    }

    .no-results {
        font-size: 3rem;
        padding: 90px;
        font-family: "monospace", sans-serif;
        opacity: 0.4;
        width: 100%;
        text-align: center;
    }



 
</style>
