<script lang=ts>
    import { onMount } from "svelte";
    import { CircleCheck } from 'lucide-svelte';

    let { mentorInformation = $bindable(), step = $bindable(), selectExistingMentor } = $props();

    interface Mentor {
        _id: string;
        name: string;
        organization: string;
        email: string;
    }

    let candidateMentors: Mentor[] = $state([]);

    onMount(async () => {
        const searchParams = new URLSearchParams();
        searchParams.set("name", mentorInformation.fullName);
        searchParams.set("organization", mentorInformation.organization);
        const response = await fetch(`/manage-projects/create/deduplication?${searchParams}`);
        const data = await response.json();
        candidateMentors = data.mentors;
    })

    let selectedExistingMentorId = $state();
</script>

<span class="text-2xl font-bold mb-8">Step 3: Mentor Deduplication</span>

<span class="text-gray-600 max-w-[36rem] text-base mb-8">In an effort to consolidate mentor information, please select an existing mentor entry if the information presented lines up. If none of them match, or have discrepencies with the contact information you have, just click continue. Better safe than sorry, mentor merging can always be done later.</span>

<div class="grid grid-cols-[minmax(auto,16rem)_auto] xl:grid-cols-[minmax(auto,16rem)_auto_minmax(auto,16rem)_auto] mb-4 gap-4 items-start max-w-[72rem] max-h-[72rem] overflow-y-auto bg-gray-200 border border-gray-400 rounded-xl p-4 ">
    {#each candidateMentors as mentor}
    <div class="grid grid-cols-subgrid col-span-2 p-4 bg-gray-300 rounded-xl shadow-md h-full">
        <div class="flex flex-col items-start pr-8">
            <span class="text-lg font-bold">{mentor.name}</span>
            <span class="text-base text-gray-600 mb-1">{mentor.email}</span>
            <span class="text-base">{mentor.organization}</span>
        </div>
        <div class="flex flex-col items-center justify-center">
            <button disabled={selectedExistingMentorId == mentor._id} class="p-2 px-5 {selectedExistingMentorId == mentor._id ? "bg-slate-400 cursor-not-allowed shadow-lg" : "bg-blue-500 hover:bg-blue-600 shadow-lg hover:shadow-none"} text-white rounded-md flex items-center"
                onclick={() => {
                    selectedExistingMentorId = mentor._id;
                    selectExistingMentor(mentor._id)
                }}>
                <span>Select</span>
            </button>
        </div>
    </div>
    {:else}
    <div class="col-span-full p-8 bg-gray-300 rounded-xl shadow-md flex justify-center">
        <span class="text-gray-600">No similar mentor entries found.</span>
    </div>
    {/each}
</div>

<div class="flex items-center gap-4 mb-8">
    <div class="flex items-center justify-start py-2 px-4 bg-gray-200 rounded-xl border border-gray-400 gap-2">
        {#if selectedExistingMentorId}
        <CircleCheck color="#34d831" size=24 strokeWidth=3 />
        <span class="text-black">Selected an existing mentor.</span>
        {:else}
        <span class="text-gray-600">No mentor selected.</span>
        {/if}
    </div>

    {#if selectedExistingMentorId}
    <button class="p-1 px-3 bg-gray-500 hover:bg-gray-600 text-white rounded-md flex items-center text-sm" onclick={() => {
        selectedExistingMentorId = "";
        selectExistingMentor()
    }}>
        <span>Deselect</span>
    </button>
    {/if}
</div>

<div class='flex items-center justify-start gap-4'>
    <button class="p-2 px-5 bg-gray-500 hover:bg-gray-600 text-white rounded-md flex items-center" onclick={() => step = 2}>
        <span>Go Back</span>
    </button>
    <button class="p-2 px-5 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center" onclick={() => step = 4}>
        <span>Continue</span>
    </button>
</div>
