<script lang=ts>
    import { goto } from "$app/navigation";
    import Icon from "@/client/components/Icon.svelte";
    import MultiSelect from "@/client/components/MultiSelect.svelte";
    import YearFilter from "@/client/components/YearFilter.svelte";
    import CaretLeft from "@/client/icons/CaretLeft";
    import CaretRight from "@/client/icons/CaretRight";
    import { tags } from "@/lib/tags";

    export let yearUpper: number | undefined;
    export let yearLower: number | undefined;
    export let mentorSearch: string;
    export let studentSearch: string;
    export let selected: string[];
    export let search;

    let showingRefinedSearch = true;
</script>

<div class="transition-side-bar absolute {showingRefinedSearch ? "" : "-translate-x-[17.19rem]"} -translate-y-1/2 transform top-1/2 flex items-center">
    <div class="bg-gray-300 rounded-r-md flex items-center justify-center z-10">
        <div class="flex flex-col transition-opacity w-80 items-center {showingRefinedSearch ? "" : "opacity-0"} justify-center gap-3 py-3">
            <h1 class="text-2xl">Refine Search</h1>

            <hr class="border-[1px] border-black w-3/4 my-2"/>

            <div class="flex flex-col gap-2">
                <div class="flex flex-col gap-2">
                    <span class="">Filter by Year: </span>
                    <YearFilter bind:yearLowerBound={yearLower} bind:yearUpperBound={yearUpper} />
                </div>

                <div class="flex flex-col gap-2">
                    <span class="">Filter by Mentor: </span>
                    <input class="p-1 rounded-md" type="search" placeholder="Search Mentor" bind:value={mentorSearch} />
                </div>

                <div class="flex flex-col gap-2">
                    <span class="">Filter by Student:</span>
                    <input class="p-1 rounded-md" type="search" placeholder="Search Student" bind:value={studentSearch} />
                </div>

                <div class="flex flex-col gap-2">
                    <span class="">Filter by Tags: </span>
                    <MultiSelect options={Array.from(tags.entries()).map(([key, value]) => ({ key, value, }))} bind:selectedValues={selected} />
                </div>
            </div>

            <hr class="border-[1px] border-black w-3/4 my-2"/>

            <div class="flex gap-2">
                <button class="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-md rounded-md" on:click={search}>Search</button>
                <button class="px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-md rounded-md" on:click={() => goto("/projects")}>Clear</button>
            </div>
        </div>
    </div>
    <button class="transition-side-bar -translate-x-[5.5rem] hover:translate-x-0 pr-2 py-2" on:click={() => showingRefinedSearch = !showingRefinedSearch}>
        <div class="relative inline-flex bg-gray-300 rounded-r-md py-3 justify-center items-center" >
            <div class="flex flex-col px-2 ml-1 bg-white rounded-md">
                <span>Refined</span>
                <span>Search</span>
            </div> 
            <div class="pr-1 py-1">
                <Icon src={showingRefinedSearch ? CaretLeft : CaretRight} color="white" size="1.25rem"/>
            </div>
        </div>
    </button>
</div>

<style>
    .transition-side-bar {
        transition: cubic-bezier(1, 0, 0, 1) 0.25s transform;
    }
    .transition-opacity {
        transition: cubic-bezier(1, 0, 0, 1) 0.5s opacity;
    }
</style>