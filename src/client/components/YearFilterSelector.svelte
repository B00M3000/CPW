<script lang=ts>
    import { SvelteSet } from 'svelte/reactivity';
    import { page } from "$app/state";
    import { goto } from '$app/navigation';

    let years: number[] = $derived(page.data.graduationYears)

    let selectedYears = retrieveDefault();

    function retrieveDefault() {
        const set = new SvelteSet<number>();
        page.url.searchParams.get('years')?.split(',').forEach(year => {
            if (year) set.add(parseInt(year));
        });
        return set;
    }

    function generateHandleYearSelection(year: number) {
        return () => {
            if (selectedYears.has(year)) {
                selectedYears.delete(year);
            } else {
                selectedYears.add(year);
            }
            updateSearchParam()
        };
    }

    function reset() {
        years.forEach(year => selectedYears.add(year));
        updateSearchParam()
    }

    async function updateSearchParam() {
        const url = new URL(page.url.toString());
        url.searchParams.set('years', Array.from(selectedYears).join(','));
        await goto(url, { invalidate: ['admin:manage-students'] });
    }

    function clear() {
        selectedYears.clear();
        updateSearchParam();
    }
</script>

<div class="flex items-center gap-2">
    <span class="text-sm font-medium text-gray-700">Select:</span>
    <div class="grid grid-flow-col items-center rounded-lg border border-solid border-gray-400">
        <div class="p-1 h-full rounded-l-lg bg-gray-300"></div>
        {#each years as year}
            <button
                onclick={generateHandleYearSelection(year)}
                class="p-2 text-sm py-1 {selectedYears.has(year) ? 'bg-gray-200' : 'bg-gray-300'} cursor-pointer hover:bg-gray-100 transition-all"
            >
                {year}
            </button>
        {/each}
        <div class="p-1 h-full rounded-r-lg bg-gray-300"></div>
    </div>
    {#if selectedYears.size < years.length}
    <button onclick={reset} class="text-gray-600 cursor-pointer">Reset</button>
    {/if}
    {#if selectedYears.size > 0}
    <button onclick={clear} class="text-gray-600 cursor-pointer">Clear</button>
    {/if}
</div>
