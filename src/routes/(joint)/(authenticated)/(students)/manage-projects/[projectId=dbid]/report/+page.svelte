<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang="ts">
    import { goto } from "$app/navigation";
    import { nl2br } from "@/lib/utils";
    import { onMount } from "svelte";
    import { z } from "zod";

    export let data;
    $: ({ project: { title, fullReport: originaFullReport }, projectId } = data);

    let fullReport: string = "";

    let ctrlDown = false;
    let vDown = false;
    let isChanged = false;

    onMount(() => {
        fullReport = originaFullReport || " ";
    });

    async function handlePaste(){
        fullReport = await navigator.clipboard.readText()
        isChanged = true;
    };

    async function upload(){
        const res = await fetch(`/manage-projects/${projectId}/report`, {
            method: "POST",
            body: JSON.stringify({ fullReport })
        });

        await goto("/manage-projects")
    }

    function onKeydown(event: KeyboardEvent) {
        const { repeat, key } = event;

        if (repeat) return;

        if (key == "Meta" || key == "Control") {
            ctrlDown = true;
            // event.preventDefault();
        }

        if(key == "v") {
            vDown = true;
            // event.preventDefault();
        }

        if (ctrlDown && vDown) {
            handlePaste();
        }
    }

    function onKeyup(event: KeyboardEvent) {
        const { key } = event;

        if (key == "Meta" || key == "Control") {
            ctrlDown = false;
            // event.preventDefault();
        }

        if(key == "v") {
            vDown = false;
            // event.preventDefault();
        }
    }
</script>

<svelte:window on:keydown={onKeydown} on:keyup={onKeyup} />

<main class="w-full flex items-center justify-center flex-col p-8">
    <div class="bg-gray-300 p-8 rounded-xl flex flex-col max-w-[85vw]">
        <div class="text-2xl font-bold text-center mb-8">Submit Project Report for <u>{title}</u></div>
        <div class="text-lg mb-10 mx-8">To submit or edit your full report, copy your project report and paste it here by
            pressing the paste keybind on your computer (<code>Meta/Command + V</code> for <code>Mac & Control + V</code> for Windows).
            if you already submitted a report before, you'll see the old one displayed below. If you accidentally
            made a change, just press the cancel button. If a change is made, the submit button will appear, and you can click that to
            submit your report. The submit button will automatically redirect you to the /manage-projects page.
        </div>
        <div class="flex items-center justify-start mb-5 gap-4">
            <button class="cancel" on:click={() => goto("/manage-projects")}>Cancel</button>
            {#if isChanged}
                <button on:click={upload}>Submit</button>
            {/if}
        </div>
        <div>
            {#if fullReport}
            <p class="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">{@html nl2br(fullReport)}</p>
            {/if}

            <input type="text" placeholder="Or type/paste here if you are Jacob Signorovitch '26" class="w-full mt-3 p-2 rounded-lg" on:input={(e) => fullReport = e.target.value} />
        </div>
    </div>
</main>

<style>
    button {
        background-color: #007bff;
        color: #fff;
        font-size: 18px;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    button:hover {
        background-color: #0056b3;
    }


    .cancel {
        background-color: rgb(255, 0, 0);
    }

    .cancel:hover {
        background-color: rgb(169, 1, 1);
    }
</style>
