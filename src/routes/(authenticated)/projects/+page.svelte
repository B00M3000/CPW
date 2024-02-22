<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang="ts">
    import { goto } from "$app/navigation";
    import YearFilter from "@/client/components/YearFilter.svelte";
    import MultiSelect from "@/client/components/MultiSelect.svelte";
    import { getTagString, tags } from "@/lib/tags";
    import ProjectCard from "@/client/components/ProjectCard.svelte";
    import { page } from "$app/stores";
    import { user } from "@/client/stores/user";
    import { AccountType } from "@/lib/enums";

    export let data;

    $: ({ projects } = data);

    let query: string;
    let yearUpper: number | undefined;
    let yearLower: number | undefined;
    let mentorSearch: string;
    let studentSearch: string;
    let selected: string[];

    function syncFields(searchParams?: URLSearchParams){
        query = searchParams?.get("query") || "";
        yearUpper = ((yu: string | null) => yu ? parseInt(yu) : undefined || new Date().getFullYear())(searchParams?.get("yearUpper"));
        yearLower = ((yl: string | null) => yl ? parseInt(yl) : undefined || 2019)(searchParams?.get("yearLower"));
        mentorSearch = searchParams?.get("mentorSearch") || "";
        studentSearch = searchParams?.get("studentSearch") || "";
        selected = searchParams?.get("tags")?.split("_") || [];
    }

    $: syncFields($page.url.searchParams);

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


<svelte:window on:load="{()=>syncFields()}"/>
<main>
    
    <div class="head">
        <div class="search">
            <input
                placeholder="Search..."
                size="90"
                id="search-box"
                class="search-box"
                bind:value={query}
                type="search"
            />
            <button class="button bg-sky-600" on:click={search}>Search</button>
            <button class="button button-archive mr-4" on:click={async () => {
                    await goto(`/projects/archived`);
                }}>
                See Archived Projects
            </button>
            {#if $user.accountType == AccountType.Student}
            <button class="button bg-orange-600 rounded-lg" on:click={async () => {
                    await goto(`/manage-projects`);
                }}>
                View My Projects    
            </button>
            {:else if $user.accountType == AccountType.Advisor}
            <button class="button bg-yellow-600 rounded-lg" on:click={async () => {
                    await goto(`/manage-advisees`);
                }}>
                View My Advisees    
            </button>
            {/if}
        </div>


    </div>


    <div class="leftright">
        <div class="sidebar">
            <h1 class="text-2xl">Refine Search</h1>
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
                Filter by Tags:
                <MultiSelect options={Array.from(tags.entries()).map(([key, value]) => ({ key, value, }))} bind:selectedValues={selected} />
            </h1>
            <div class="search-and-clear">
                <div>
                    <button on:click = {search}>Search</button>
                </div>
                <div>
                    <button on:click = {() => goto("/projects")}>Clear</button>
                </div>
            </div>
        </div>

        <div class="results">
            {#if projects.length === 0 && query.length > 0}
                <h1 class="no-results"> No results for {`${ query.length < 20 ? query : query.slice(0, 17) + "..."}`} were found.</h1>
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
        flex-direction: space-between;
        justify-content: center;
        align-items: left;
        background-color: #d0d0d0;
        width: 100%;
        height: calc(8vh - 2px);
        max-height: 8vh;
        z-index: 20;
        border-top: 2px solid black;
    }

    .search {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
    }

    .SearchFilter {
        background-color: rgb(245, 245, 245);
        color: rgb(0, 0, 0);
        padding: 5px;
        font-size: 16px;
        border-radius: 4px;
        margin-bottom: 1rem;
        margin-top: 0.2rem;
        border: 0px solid black;
    }

    .filter-labels {
        margin-top: 1rem;
        margin-bottom: 0.2rem;
        font-size: 15px;
        font-weight: 900;
    }

    .search-box {
        padding: 12px 20px;
        margin: 8px 0rem;
        box-sizing: border-box;
        border: 0px solid rgb(0, 0, 0);
        border-radius: 5px 0px 0px 5px;
        margin-left: 2rem;
        width: 45%;
    }

    *:focus {
        outline: 1px solid rgba(49, 49, 255, 0.213);
    }
    .button {
        color: white;
        padding: 11px 20px;
        border: none;
        border-radius: 0 5px 5px 0;
        cursor: pointer;
        font-size: 15px;
        transition: background-color 0.3s;
    }


    .button:hover {
        background-color: var(--color-blue-400);

    }

    .button-archive {
        background-color: var(--color-blue-grey-300);
        border-radius: 5px 5px 5px 5px;
        cursor: pointer;
        margin-left: 1vw;
    }

    .button-archive:hover {
        background-color: var(--color-blue-grey-200);
        border-radius: 5px 5px 5px 5px;
        cursor: pointer;
        margin-left: 1vw;
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
        max-width: 280px;
        align-items: center;
        height: calc(100vh - 8vh - var(--nav-bar-height));
        background-color: #d0d0d0;
        padding-left: 2rem;
        padding-right: 2rem;
        overflow-y: hidden;
        padding-top: 2rem;
        box-shadow: 2px 0px 5px var(--color-blue-grey-200);
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
        margin: 0.5rem 0;
        width: calc(100vw - 240px);
        max-width: calc(100vw - (100vw - 100%));
        gap: 1em;
        overflow-y: scroll;
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


    .search-and-clear{
        display: flex;
        flex-direction: row;
        align-items: center;
        button {
            border: none;
            padding: 5px;
            margin: 1px;
            background-color: #5d5d5d;
            color: white;
            border-radius: 2px;
        }

    }
 
</style>
