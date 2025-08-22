<script lang=ts>
    import YearFilter from "@/client/components/YearFilter.svelte";
    import { tags } from "@/lib/tags";
    import { ArrowLeft, X } from "lucide-svelte";
    import { onMount } from "svelte";
    import MultiSelect from 'svelte-multiselect'
    import { fly } from 'svelte/transition';

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
    let reduceSpacing = $derived(innerWindowWidth <= 750 || clientHeight <= 600);

    onMount(() => {
        selected = searchParameters.tags.map((tagId: string) => tagOptions.find(option => option.id === tagId));
    })

    $effect(() => {
        searchParameters.tags = selected.map((option: any) => option.id);
    })

    let selected = $state([]);
</script>

<div class="flex items-center justify-center pt-7 pr-12 border-t border-solid border-gray-400 pb-24 bg-gray-300" bind:clientHeight={clientHeight}
     in:fly={{ x: -400, duration: 400 }} out:fly={{ x: -400, duration: 400 }}>
    <div class='flex gap-4 ml-4'>
        <button onclick={close} type="button" class="hover:bg-gray-200 self-start flex gap-2 items-center text-black p-1 rounded-md">
            <ArrowLeft />
        </button>
        <form class="flex flex-col w-80 items-start justify-center {reduceSpacing ? "gap-3" : "gap-6"}" onsubmit={(event) => { event.preventDefault(); search() }}>
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
                        outerDivClass="flex gap-2 items-center my-0 p-2 rounded-md absolute"
                        --sms-bg="#e5e7eb"
                        bind:selected
                    >
                        <span slot="selected" let:option class="max-w-40 text-ellipsis overflow-x-clip text-sm">{option.label}</span>
                    </MultiSelect>
                </div>
            </div>

            <hr class="border-[1px] border-black w-3/4 my-1"/>

            <div class="grid grid-cols-2 gap-6">
                <a class="px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-base rounded-md flex items-center justify-center" href="/projects">Clear</a>
                <button class="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-base rounded-md flex items-center justify-center" type="submit">Search</button>
            </div>
        </form>
    </div>
</div>

<svelte:window bind:innerWidth={innerWindowWidth} />
