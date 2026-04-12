<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang="ts">
    import { goto } from "$app/navigation";
    import { bytesToString, nl2br } from "@/lib/utils";
    import { onMount } from "svelte";
    import toast from "svelte-french-toast";

    export let data;
    let project: any;
    let projectId: string;
    let title = "";
    let originalFullReport = "";
    $: ({ project, projectId } = data);
    $: ({ title, fullReport: originalFullReport } = project);

    let fullReport: string = "";
    let pdf: any = null;
    let pdfUrl: string | null = null;
    let selectedPdf: File | null = null;
    let uploadingPdf = false;
    let removingPdf = false;

    let ctrlDown = false;
    let vDown = false;
    let isChanged = false;

    onMount(() => {
        fullReport = originalFullReport || "";
        pdf = project.pdf || null;
        pdfUrl = project.pdfUrl || null;
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

        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            toast.error(body.message || "Could not save report.");
            return;
        }

        await goto("/manage-projects")
    }

    async function uploadPdf() {
        if (!selectedPdf) {
            toast.error("Select a PDF first.");
            return;
        }

        uploadingPdf = true;
        const formData = new FormData();
        formData.set("pdf", selectedPdf);

        const res = await fetch(`/manage-projects/${projectId}/report/pdf`, {
            method: "PUT",
            body: formData,
        });

        uploadingPdf = false;

        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            toast.error(body.message || "PDF upload failed.");
            return;
        }

        const body = await res.json();
        pdf = body.pdf;
        pdfUrl = body.pdfUrl;
        selectedPdf = null;
        toast.success("PDF uploaded.");
    }

    async function removePdf() {
        removingPdf = true;
        const res = await fetch(`/manage-projects/${projectId}/report/pdf`, {
            method: "DELETE",
        });

        removingPdf = false;

        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            toast.error(body.message || "Could not remove PDF.");
            return;
        }

        pdf = null;
        pdfUrl = null;
        toast.success("PDF removed.");
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
    <div class="bg-gray-200 p-8 rounded-lg flex flex-col max-w-5xl  border border-solid border-gray-400">
        <div class="text-2xl font-bold text-center mb-8">Submit Project Report for <u>{title}</u></div>
        <div class="text-lg mb-10 mx-8">To submit or edit your full report, copy your project report and paste it here by
            pressing the paste keybind on your computer (<code>Meta/Command + V</code> for <code>Mac & Control + V</code> for Windows).
            if you already submitted a report before, you'll see the old one displayed below. If you accidentally
            made a change, just press the cancel button. If a change is made, the submit button will appear, and you can click that to
            submit your report. The submit button will automatically redirect you to the /manage-projects page.
        </div>
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm text-blue-900">
            You can submit either plain text, a PDF, or both. PDF uploads can include images and charts, and you can export
            directly to PDF from Google Docs, Word, or similar tools. Maximum file size: 10 MB.
        </div>
        <div class="flex items-center justify-start mb-5 gap-4">
            <button class="cancel" on:click={() => goto("/manage-projects")}>Cancel</button>
            {#if isChanged}
                <button on:click={upload}>Submit</button>
            {/if}
        </div>
        <div class="bg-gray-100 rounded-lg p-4 mb-6 border border-gray-300">
            <h3 class="text-lg font-semibold mb-2">Project PDF</h3>
            {#if pdf}
                <div class="flex flex-wrap gap-3 items-center mb-3">
                    <span class="text-sm"><strong>{pdf.fileName}</strong> ({bytesToString(pdf.size)})</span>
                    {#if pdfUrl}
                        <a class="text-blue-700 underline" href={pdfUrl} target="_blank" rel="noreferrer">Download / Open</a>
                    {/if}
                    <button class="cancel !text-sm !px-3 !py-2" on:click={removePdf} disabled={removingPdf}>
                        {removingPdf ? "Removing..." : "Remove PDF"}
                    </button>
                </div>
                {#if pdfUrl}
                    <iframe title="Project PDF Preview" src={pdfUrl} class="w-full h-[28rem] bg-white border border-gray-300 rounded"></iframe>
                {/if}
            {:else}
                <p class="text-sm text-gray-700 mb-3">No PDF uploaded yet.</p>
            {/if}

            <div class="flex flex-wrap gap-3 items-center mt-2">
                <input
                    type="file"
                    accept="application/pdf,.pdf"
                    on:change={(e) => (selectedPdf = e.currentTarget?.files?.[0] || null)}
                />
                <button on:click={uploadPdf} disabled={!selectedPdf || uploadingPdf}>
                    {uploadingPdf ? "Uploading..." : "Upload PDF"}
                </button>
            </div>
        </div>
        <div>
            {#if fullReport}
            <p class="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">{@html nl2br(fullReport)}</p>
            {/if}

            <input
                type="text"
                placeholder="Or type/paste here if you are Jacob Signorovitch '26"
                class="w-full mt-3 p-2 rounded-lg"
                on:input={(e) => {
                    fullReport = (e.currentTarget as HTMLInputElement).value;
                    isChanged = true;
                }}
            />
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
