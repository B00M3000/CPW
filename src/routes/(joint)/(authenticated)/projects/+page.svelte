<script lang=ts>
    import { goto } from "$app/navigation";
    import Loading2 from "@/client/components/Loading2.svelte";
    import Pagination from "@/client/components/Pagination.svelte";
    import ProjectCard from "@/client/components/ProjectCard.svelte";
    import RefinedSearchMobile from './RefinedSearchMobile.svelte';
    import RefinedSearchNormal from './RefinedSearchNormal.svelte';
    import SearchBar from './SearchBar.svelte';
    import { currentYear } from "@/lib/utils";
    import { browser } from '$app/environment';

    let { data } = $props()

    let inflatedProjects: any[] = $state([])
    let searchParameters: any = $state({
        tags: [],
        yearUpper: 2019,
        yearLower: currentYear(),
        mentorSearch: "",
        studentSearch: "",
        query: "",
        itemsPerPage: 10,
        page: 0
    })
    let totalProjectCount: number = $state(0);

    inflatedProjects = data.inflatedProjects
    searchParameters = data.searchParameters
    totalProjectCount = data.totalProjectCount

    $effect(() => {
        data;
        inflatedProjects = data.inflatedProjects
        searchParameters = data.searchParameters
        totalProjectCount = data.totalProjectCount
    })

    async function search(event?: Event){
        event?.preventDefault();
        const { tags, yearLower, yearUpper, mentorSearch, studentSearch, query, itemsPerPage, page } = searchParameters;

        const searchParams = new URLSearchParams();

        if(tags?.length > 0) searchParams.set("tags", tags.join("_"));
        if(yearLower) searchParams.set("yearLower", yearLower.toString())
        if(yearUpper) searchParams.set("yearUpper", yearUpper.toString());
        if(mentorSearch) searchParams.set("mentorSearch", mentorSearch);
        if(studentSearch) searchParams.set("studentSearch", studentSearch);
        if(query) searchParams.set("q", query)
        if(itemsPerPage) searchParams.set("itemsPerPage", itemsPerPage)
        if(page) searchParams.set("page", page)

        spinnerActive = true;

        await goto(`/projects?${searchParams}`);

        scrollElement?.scrollTo(0, 0);

        spinnerActive = false;
    }

    let spinnerActive = $state(false);

    let innerWindowWidth = $state(0);
    if(browser) innerWindowWidth = window.innerWidth;

    const refinedSearchBreakpoint = 870;
    let refinedSearchNormalOpen = $state(searchParameters.mentorSearch.length > 0 || searchParameters.studentSearch.length > 0 || searchParameters.tags.length > 0 || searchParameters.yearUpper != 2019 || searchParameters.yearLower != currentYear());
    let refinedSearchMobileOpen = $state(false);

    let refinedSearchNormalOpenF = $derived(refinedSearchNormalOpen && innerWindowWidth > refinedSearchBreakpoint);
    let refinedSearchMobileOpenF = $derived(refinedSearchMobileOpen && innerWindowWidth <= refinedSearchBreakpoint)

    function closeRefinedSearch() {
        refinedSearchNormalOpen = false;
        refinedSearchMobileOpen = false;
    };
    function openRefinedSearch() {
        refinedSearchNormalOpen = true;
        refinedSearchMobileOpen = true;
    };

    export const snapshot = {
        capture: () => ({
            itemsPerPage: searchParameters.itemsPerPage,
            refinedSearchNormalOpen
        }),
		restore: (snapshot) => {
            searchParameters.itemsPerPage = snapshot.itemsPerPage
            refinedSearchNormalOpen = snapshot.refinedSearchNormalOpen
        }
    }

    let scrollElement: HTMLDivElement | undefined = $state()
</script>

{#if spinnerActive}
<Loading2 />
{/if}

<main class="h-full w-full grid grid-cols-1 grid-rows-[auto_minmax(0,_1fr)_auto] bg-gray-300 overflow-hidden">
    {#if refinedSearchMobileOpenF}
    <div class="relative">
        <div class="absolute top-0 w-screen z-10">
            <RefinedSearchMobile
                {search}
                close={closeRefinedSearch}
                bind:searchParameters
            />
        </div>
    </div>
    {:else}
    <SearchBar bind:query={searchParameters.query} {search} {openRefinedSearch} />
    {/if}
    <div class="flex h-full">
        {#if refinedSearchNormalOpenF}
        <RefinedSearchNormal
            {search}
            close={closeRefinedSearch}
            bind:searchParameters
        />
        {:else}
        <div class="sm:m-3"></div>
        {/if}
        {#if inflatedProjects.length > 0}
        <div class="sm:rounded-lg h-full w-full bg-gray-400">
            <div class="h-full w-full overflow-y-scroll p-8" bind:this={scrollElement}>
                <div class="grid gap-8 grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] grid-rows-auto justify-center items-center h-full w-full shadow-lg">
                    {#each inflatedProjects as project}
                    <div class="flex items-center justify-center w-full h-full">
                        <ProjectCard {project} />
                    </div>
                    {/each}
                </div>
            </div>
        </div>
        {:else}
        <div class="h-full w-full bg-gray-400 sm:rounded-lg flex items-center justify-center">
            <h1 class="no-results overflow-ellipsis text-white text-xl sm:text-3xl m-8"> No results for {searchParameters.query} were found.</h1>
        </div>
        {/if}
        <div class="sm:m-3"></div>
    </div>
    <div class="flex justify-center w-full bg-gray-300">
        <div class="flex justify-center p-2 sm:p-4 w-full lg:w-2/3 2xl:w-1/2">
            <Pagination
                pluralItemName="projects"
                bind:itemsPerPage={searchParameters.itemsPerPage}
                bind:currentPage={searchParameters.page}
                maxItems={totalProjectCount}
                onchange={() => search()}
            />
        </div>
    </div>
</main>

<svelte:window bind:innerWidth={innerWindowWidth} />
