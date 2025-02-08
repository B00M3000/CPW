<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang="ts">
    import Modal from '@/client/components/Modal.svelte';
    import { currentYear } from '@/lib/utils';
    import { CircleHelp, X } from 'lucide-svelte';

    let { data } = $props();
    let { mentor } = $derived(data);

    let helpModalOpen = $state(false);
</script>

<main class="flex items-center justify-center text-center h-full">
    <div class="inline-flex flex-col p-6 m-8">
        <h2 class="text-6xl sm:text-8xl text-gray-700 font-bold mb-5 sm:mb-9">{mentor?.name}</h2>
        <div class="flex justify-center">
            <p class="italic text-gray-400 mb-2 text-lg sm:text-xl"><em>Please contact Ms. Moss for mentor contact information.</em></p>
            <button class="flex items-start" onclick={() => helpModalOpen = true}><CircleHelp size="1rem" color="gray"/></button>
        </div>
        <p class="text-lg sm:text-xl mb-5">Click <a class="text-blue-500 underline" href="{`/projects/?yearUpper=${currentYear()}&yearLower=2019&mentorSearch=${mentor?.name}`}">here</a>
            to search for projects this mentor has facillitated</p>
        <div class="flex justify-center">
            <button class="bg-blue-400 hover:bg-blue-300 text-center px-3 p-2 sm:p-3 block rounded-lg text-lg sm:text-xl text-gray-900" onclick={() => history.back()}>Go back</button>
        </div>
    </div>
</main>

{#if helpModalOpen}
<Modal>
    <div class="bg-gray-200 p-4 rounded-xl m-8 sm:w-[36rem]">
        <div class="flex justify-between w-full">
            <h2 class="text-2xl font-bold mb-2">Just shoot Ms. Moss an email!</h2>
            <button onclick={() => helpModalOpen = false} type="button" class="bg-red-600 hover:bg-red-700 flex items-center justify-center text-white w-8 h-8 rounded-md">
                <X />
            </button>
        </div>
        <h3 class="text-lg">Example:</h3>
        <p class="text-md p-2 rounded-md bg-gray-300">Dear Ms. Moss, <br><br>I saw that [insert student name] worked with [insert mentor name] on [project] for their project week. I am hoping to pursue a similar project (or whatever you are looking for). Could you help connect me with [his/her/...] mentor (or find a similar project, etcetera)? <br><br>Thank you, <br>[your name]</p>
    </div>
</Modal>
{/if}
