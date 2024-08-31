<script lang=ts>
    import YearFilter from "@/client/components/YearFilter.svelte";
    import { tags } from "@/lib/tags";
    import { X } from "lucide-svelte";
    import { onMount } from "svelte";
    import MultiSelect from 'svelte-multiselect';

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

    onMount(() => {
        selected = searchParameters.tags.map((tagId: string) => tagOptions.find(option => option.id === tagId));
    })

    $effect(() => {
        searchParameters.tags = selected.map((option: any) => option.id);
    })

    let selected = $state([]);
</script>

<div class="bg-gray-300 flex items-center justify-center">
    <form class="flex flex-col w-96 items-center justify-center gap-4 sm:gap-5 m-8 my-4 pb-4" onsubmit={async (event) => { event.preventDefault(); await search(); close()}}>
        <div class="flex justify-end w-full mr-[-2rem]">
            <button onclick={close} type="button" class="bg-red-600 hover:bg-red-700 flex gap-2 items-center text-white p-1 rounded-md">
                <X />
            </button>
        </div>

        <span class="text-gray-400 text-sm">*Use desktop mode if the UI is problematic</span>

        <div class="flex flex-col gap-4 sm:gap-5 w-full">
            <input
                placeholder="Search..."
                class="w-full py-1 px-3 box-border rounded-lg outline-none"
                bind:value={searchParameters.query}
                type="search"
            />

            <div class="flex flex-col gap-1 sm:gap-2">
                <span class="">Filter by Year: </span>
                <YearFilter bind:yearLowerBound={searchParameters.yearLower} bind:yearUpperBound={searchParameters.yearUpper} />
            </div>

            <div class="flex flex-col gap-1 sm:gap-2">
                <span class="">Filter by Mentor: </span>
                <input class="p-1 rounded-md" type="search" placeholder="Search Mentor" bind:value={searchParameters.mentorSearch} />
            </div>

            <div class="flex flex-col gap-1 sm:gap-2">
                <span class="">Filter by Student:</span>
                <input class="p-1 rounded-md" type="search" placeholder="Search Student" bind:value={searchParameters.studentSearch} />
            </div>

            <div class="flex flex-col gap-1 sm:gap-2">
                <span class="">Filter by Tags: </span>
                <MultiSelect
                    options={tagOptions}
                    maxSelect={3}
                    placeholder="Search tags.."
                    liSelectedClass="flex gap-2 items-center"
                    outerDivClass="flex gap-2 items-center my-0 bg-gray-50 p-2 rounded-md"
                    bind:selected
                >
                    <span slot="selected" let:option class="max-w-36 text-ellipsis overflow-x-clip text-sm">{option.label}</span>
                </MultiSelect>
            </div>
        </div>

        <div class="flex gap-6">
            <button class="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-base rounded-md" type="submit">Search</button>
            <a class="px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-base rounded-md" href="/projects">Clear</a>
        </div>
    </form>
</div>
