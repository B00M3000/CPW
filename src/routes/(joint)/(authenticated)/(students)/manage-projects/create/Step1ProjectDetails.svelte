<script lang=ts>
    import MultiSelect from 'svelte-multiselect';
    import { tags } from '@/lib/tags';

    const TAG_OPTIONS = Array.from(tags.entries()).map(([k, v]) => ({ id: k, label: v, value: v }))

    let { projectDetails = $bindable(), step = $bindable() } = $props();

    let errorMessages = $state([]);

    function continueInvoked() {
        errorMessages = []

        if(projectDetails.title.length < 12 || projectDetails.title.length > 200) {
            errorMessages.push("Please enter a project name between 12 and 200 characters.");
        }

        if(projectDetails.selected.length < 1 || projectDetails.selected.length > 5) {
            errorMessages.push("Please select between 1 and 5 tags.");
        }

        if(projectDetails.shortDescription.length < 25 || projectDetails.shortDescription.length > 500) {
            errorMessages.push("Please enter a short description with at least 25 characters and less than 500.");
        }

        if(errorMessages.length == 0) {
            step = 2;
        }
    }
</script>

<span class="text-2xl font-bold mb-8">Step 1: Project Details</span>

<div class="flex flex-col items-start mb-4">
    <span class="text-xl mb-2">Project Title: </span>
    <span contenteditable="plaintext-only" class="mb-1 text-base rounded-md bg-gray-50 p-2 border-gray-400 border min-w-72 max-w-[30rem]" bind:innerHTML={projectDetails.title}></span>
    <span class="text-gray-600 max-w-[24rem] text-sm">Ex: Spanish Exchange 2024, Neurolinguistics at MIT's EvLab, Starting A Car Washing Business</span>
</div>

<div class="flex items-start flex-col mb-4">
    <h2 class="text-xl mb-2">Tags: </h2>
    <MultiSelect
        options={TAG_OPTIONS}
        maxSelect={5}
        placeholder="Search tags.."
        liSelectedClass="flex gap-2 items-center"
        outerDivClass="flex gap-2 items-center my-0 bg-gray-50 p-2 py-3 rounded-md border-gray-400 border max-w-[30rem] min-w-72"
        --sms-bg="#d1d5dc"
        bind:selected={projectDetails.selected}
    >
        <span slot="selected" let:option class="max-w-72 text-ellipsis overflow-x-clip text-base">{option.label}</span>
    </MultiSelect>
</div>

<div class="flex items-start flex-col mb-8">
    <h2 class="text-lg mb-2">Short Description:</h2>
    <span contenteditable="plaintext-only" class="text-base rounded-md bg-gray-50 p-2 border-gray-400 border min-h-16 min-w-72 max-w-[32rem]" bind:innerHTML={projectDetails.shortDescription}></span>
</div>

<div class="mb-1 flex flex-col">
    {#each errorMessages as msg}
    <span class="text-red-600 max-w-[36rem] text-sm">{msg}</span>
    {/each}
</div>

<div class='flex items-start flex-col'>
    <button class="p-2 px-5 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center" onclick={continueInvoked}>
        <span>Continue</span>
    </button>
</div>
