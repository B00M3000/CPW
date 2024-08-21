<script lang=ts>
    import { enhance } from "$app/forms";
    import { goto } from "$app/navigation";
    import YearFilter from "@/client/components/YearFilter.svelte";
    import { tags } from "@/lib/tags";
    import { Close } from "carbon-icons-svelte";
    import { onMount } from "svelte";
    import MultiSelect from 'svelte-multiselect'

    const tagOptions = Array.from(tags.entries()).map(([k, v]) => ({ id: k, label: v, value: v }))

    let { 
        searchParameters = $bindable(),
        search,
        close
    }: {
        searchParameters: any,
        search: () => void
        close: () => void
    } = $props();

    let innerWindowWidth = $state(0);
    let clientHeight = $state(0);
    let reduceSpacing = $derived(innerWindowWidth <= 930 || clientHeight <= 600);

    onMount(() => {
        selected = searchParameters.tags.map((tagId: string) => tagOptions.find(option => option.id === tagId));
    })

    $effect(() => {
        searchParameters.tags = selected.map((option: any) => option.id);
    })

    let selected = $state([]);
</script>

<div class="bg-[rgb(183,188,197)] flex items-center justify-center shadow-xl m-7 my-4 ml-0 rounded-r-xl" bind:clientHeight={clientHeight}>
    <form class="flex flex-col w-80 mx-12 items-center justify-center {reduceSpacing ? "gap-3" : "gap-5"}" onsubmit={(event) => { event.preventDefault(); search() }}>
        <div class="flex justify-end self-start w-full">
            <button onclick={close} type="button" class="bg-red-600 hover:bg-red-700 flex gap-2 items-center text-white p-2 py-1 rounded-md">
                <Close />
                <span>Close</span>
            </button>
        </div>

        <h1 class="{reduceSpacing ? "text-xl" : "text-2xl"}">Refined Search</h1>

        <hr class="border-[1px] border-black w-3/4"/>

        <div class="flex flex-col {reduceSpacing ? "gap-3" : "gap-5"} w-full">
            <div class="flex flex-col {reduceSpacing ? "gap-1" : "gap-2"}">
                <span class="">Filter by Year: </span>
                <YearFilter bind:yearLowerBound={searchParameters.yearLower} bind:yearUpperBound={searchParameters.yearUpper} />
            </div>

            <div class="flex flex-col {reduceSpacing ? "gap-1" : "gap-2"}">
                <span class="">Filter by Mentor: </span>
                <input class="p-1 rounded-md" type="search" placeholder="Search Mentor" bind:value={searchParameters.mentorSearch} />
            </div>

            <div class="flex flex-col {reduceSpacing ? "gap-1" : "gap-2"}">
                <span class="">Filter by Student:</span>
                <input class="p-1 rounded-md" type="search" placeholder="Search Student" bind:value={searchParameters.studentSearch} />
            </div>

            <div class="flex flex-col {reduceSpacing ? "gap-1" : "gap-2"}">
                <span class="">Filter by Tags: </span>
                <MultiSelect 
                    options={tagOptions}
                    maxSelect={3}
                    placeholder="Search tags.."
                    liSelectedClass="flex gap-2 items-center"
                    outerDivClass="flex gap-2 items-center my-0 bg-gray-50 p-2 rounded-md"
                    bind:selected
                >
                    <span slot="selected" let:option class="max-w-40 text-ellipsis overflow-x-clip text-sm">{option.label}</span>
                </MultiSelect>  
            </div>
        </div>

        <hr class="border-[1px] border-black w-3/4 my-1"/>

        <div class="flex gap-6">
            <button class="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-md rounded-md" type="submit">Search</button>
            <a class="px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-md rounded-md" href="/projects">Clear</a>
        </div>
    </form>
</div>

<svelte:window bind:innerWidth={innerWindowWidth} />
