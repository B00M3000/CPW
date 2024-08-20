<script lang=ts>
    import { clamp } from '@/lib/utils';
    import { CaretLeft, CaretRight } from 'carbon-icons-svelte';
    import capitalize from 'lodash/capitalize';

    let { 
        itemsPerPage = $bindable(10),
        currentPage = $bindable(0), // currentPage is zero-indexed
        pluralItemName = "items",
        pageSizes = [10, 25, 50],
        maxItems = 48,
        onchange = () => {}
    }: {
        itemsPerPage?: number,
        currentPage?: number,
        pluralItemName?: string,
        pageSizes?: number[],
        maxItems?: number,
        onchange?: (currentPage: number, itemsPerPage: number) => void
    } = $props(); 

    function itemsPerPageOnChange() {
        currentPage = 0
        onchange(currentPage, itemsPerPage);
    }

    function pageChange() {
        onchange(currentPage, itemsPerPage);
    }

    let totalPages = $derived(Math.ceil(maxItems / itemsPerPage));
    let currentUpper = $derived(currentPage * itemsPerPage + 1)
    let currentLower = $derived(clamp((currentPage + 1) * itemsPerPage, 0, maxItems))
</script>

<div class="flex items-center justify-between bg-[rgb(236,238,241)] gap-4 w-full rounded-md text-black p-4">
    <div class="flex gap-2 items-center">
        <span class="max-sm:hidden">{capitalize(pluralItemName)} per page: </span>
        <!-- <span class="sm:hidden">Show: </span> -->
        <select class="rounded-sm p-1 bg-white" bind:value={itemsPerPage} onchange={itemsPerPageOnChange}>
            {#each pageSizes as pageSize}
            <option selected={itemsPerPage == pageSize}>{pageSize}</option>
            {/each}
        </select>
    </div>
    <div class="text-gray-900">
        <span class="max-sm:hidden">{currentUpper}-{currentLower} of {pluralItemName.toLowerCase()}</span>
        <span class="sm:hidden">{currentUpper}-{currentLower}</span>
    </div>
    <div class="flex items-center h-full gap-3 sm:gap-5">
        <div class="flex items-center gap-1">
            <div>
                <select class="rounded-sm p-1 bg-white" bind:value={currentPage} onchange={pageChange}>
                    {#each [...Array(totalPages).keys()] as pageNumber}
                        <option selected={pageNumber === currentPage + 1} value={pageNumber}>{pageNumber + 1}</option>
                    {/each}
                </select>
            </div>
            <span class="text-gray-900 max-sm:hidden">of {totalPages} pages</span>
            <span class="text-gray-900 sm:hidden">of {totalPages}</span>
        </div>
        <button class="h-full p-2 sm:px-4 bg-gray-300 hover:bg-gray-400 rounded-md" onclick={() => { currentPage = Math.max(0, currentPage - 1); pageChange() }}>
            <CaretLeft size={24} /> 
        </button>
        <button class="h-full p-2 sm:px-4 bg-gray-300 hover:bg-gray-400 rounded-md" onclick={() => { currentPage = Math.min(totalPages - 1, currentPage + 1); pageChange() }}>
            <CaretRight size={24} />
        </button>
    </div>
</div>
