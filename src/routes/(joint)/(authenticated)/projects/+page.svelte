<script lang=ts>
    import { goto } from "$app/navigation";
    import { user } from "@/client/stores/user";
    import { AccountType } from "@/lib/enums";
    import SearchBar from './SearchBar.svelte';
    import RefinedSearch from './RefinedSearch.svelte';
    import { page } from "$app/stores";
    import ProjectCard from "@/client/components/ProjectCard.svelte"
    import { browser } from "$app/environment";
    
    export let data;
    $: ({ projects } = data);

    let query: string;
    let yearUpper: number | undefined;
    let yearLower: number | undefined;
    let mentorSearch: string;
    let studentSearch: string;
    let selected: string[];

    $: theSearch = $page.url.searchParams.get("query") || "";

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

        spinnerActive = true;

        await goto(`/projects?${searchParams}`, { replaceState: true });

        spinnerActive = false;
    }

    let spinnerActive = false;
</script>

{#if spinnerActive}
<div class="absolute z-[50] w-[100vw] h-[100vh] bg-opacity-45 bg-white flex items-center justify-center">
    <img src="/assets/loading.gif"/>
</div>
{/if}

<main class="h-full w-full">
    <SearchBar bind:query={query} {search}/>
    <div class="w-full bg-gray-500 flex flex-col items-center overflow-y-auto">
        <div class="max-w-[65rem] bg-gray-400 flex flex-wrap justify-center items-center">
            {#each projects as project}
            <div class="m-3 max-sm:mx-10">
                <ProjectCard {project} />
            </div>
            {:else}
            <h1 class="no-results"> No results for {`${ theSearch.length < 20 ? theSearch : theSearch.slice(0, 17) + "..."}`} were found.</h1>
            {/each}
        </div>
    </div>
</main>

<RefinedSearch 
    {search}
    bind:yearUpper={yearUpper}
    bind:yearLower={yearLower}
    bind:mentorSearch={mentorSearch}
    bind:studentSearch={studentSearch}
    bind:selected={selected}
/>