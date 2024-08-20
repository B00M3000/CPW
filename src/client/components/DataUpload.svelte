<!--
 Created on Fri Oct 15 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang="ts">
    import type { DataUpload, Fields } from "@/lib/data-upload";
    import { parseCSV } from "@/lib/utils";
    import { onMount } from "svelte";

    import Icon from "@/client/components/Icon.svelte";
    import Valid from "@/client/icons/Valid";
    import Invalid from "@/client/icons/Invalid";

    export let dataUpload: DataUpload;
    export let endpoint: string;

    let fields: Fields;

    enum UploadStatus {
        NotUploaded,
        Uploading,
        Uploaded,
        Failed
    }

    let uploadStatus: UploadStatus = UploadStatus.NotUploaded;

    onMount(() => {
        fields = dataUpload.fields;
    })

    let headings: string[] = [];
    let entries: string[][] = [];
    let errors: string[] = [];

    let files: FileList;
    $: file = files ? files[0] : undefined; 

    $: (async (file) => {
        if(!file) return;
        const parsedCSV = (await parseCSV(file)).map(r => r.map(s => s.trim()));
        headings = parsedCSV.shift() || [];
        entries = parsedCSV;    
        errors = []
    })(file)

    function headingValidation(heading: string) {
        const valid = fields[heading];
        if(!valid) errors.push(`Invalid column "${heading}" found.`);
        return valid
    }

    function partValidation(heading: string, part: string) {
        const field = fields[heading]
        if(!field) return;
        const valid = field.test(part);
        if(!valid) errors.push(`Invalid cell value "${part}" found under "${heading}".`);
        return valid
    }

    $: ((headings) => file && Object.keys(fields).forEach((fieldName: string) => {
        const length = headings.filter(h => h == fieldName).length;
        if(length < 1) errors.push(`Missing "${fieldName}" field.`);
        else if(length > 1) errors.push(`Duplicate "${fieldName}" field.`)
    }))(headings)

    async function uploadData() {
        uploadStatus = UploadStatus.Uploading;

        const res = await fetch(endpoint, {
            method: 'POST',
            body: file,
            headers: {
                'Content-type': 'text/csv'
            }
        })

        if(res.ok) {
            uploadStatus = UploadStatus.Uploaded
        } else {
            uploadStatus = UploadStatus.Failed
        }
    }
</script>

<div id="data-upload">
    <h3 class='mb-2'>Upload <em>{dataUpload.name}</em> Data</h3>

    <input type='file' multiple={false} accept="text/csv" bind:files={files}/>

    {#if file}
    <div class="flex-col gap-6 m-6">
        <h4 class="text-xl m-4">Review Data: </h4>
        <div class="flex gap-4">
            <div class="max-h-[30vh] overflow-y-auto">
                <table>
                    <thead>
                        <tr>
                            {#each headings as heading}
                            <th class="{headingValidation(heading) ? "valid" : "invalid"}">
                                <span>{heading}</span>
                            </th>
                            {/each}
                        </tr>
                    </thead>
                    <tbody>
                        {#each entries as entry}
                        <tr>
                            {#each entry as part, headingIndex}
                            <td class="{partValidation(headings[headingIndex], part) ? "valid" : "invalid"}">
                                <span>{part}</span>
                            </td>
                            {/each}
                        </tr>
                        {/each}
                    </tbody>
                </table>
            </div>

            {#if errors.length > 0}
                <div id="errors">
                    <span>Errors: </span>
                    <ol class="p-2">
                        {#each errors as error}<li>{error}</li>{/each}
                    </ol>
                </div>
            {/if}
        </div>
    </div>

    {#if errors.length > 0}
    <div id="validation-message">
        <Icon src={Invalid} color="red"/>
        <span class="invalid">Data Validation Failed - Check Errors</span>
    </div>
    {:else}
    <div id="validation-message">
        <Icon src={Valid} color="green"/>
        <span class="valid">Data Validation Passed - Click to Upload</span>
    </div>
    <div id="upload-button">
        <button class="bg-slate-200 rounded-sm border-2 border-black p-1" on:click={uploadData} disabled={uploadStatus == UploadStatus.Uploading || uploadStatus == UploadStatus.Uploaded}>Upload Data</button>
        {#if uploadStatus == UploadStatus.Uploading}
        <div class="loader" />
        <span>Processing...</span>
        {:else if uploadStatus == UploadStatus.Uploaded}
        <Icon src={Valid} color="green"/>
        <span class="valid">Uploaded</span>
        {:else if uploadStatus == UploadStatus.Failed}
        <Icon src={Invalid} color="red"/>
        <span class="invalid">Failed</span>
        {/if}
    </div>
    {/if}  
    {/if}  
</div>

<style lang='scss'>
    #data-upload {
        display: flex;
        flex-direction: column;

        background-color: aliceblue;
        padding: 2rem;
        margin: 2rem;
    }

    #errors {
        display: inline-flex;
        flex-direction: column;
        background: white;

        padding: 2rem;
    }


    table {
        padding: 1rem;
        border-radius: 1rem;
        background-color: #fff;

        gap: 2rem;

        tr {
            th, td {
                text-align: left;
                padding: 0.5rem 1rem;
            }
            &:nth-child(even) {
                background-color: #ddd;
            }
        }
    }   

    .valid { color: green; }
    .invalid { color: red; }

    #validation-message {
        display: flex;
        align-items: center;

        margin: 1rem;

        span {
            margin: 0 0.25rem;
        }
    }

    #upload-button {
        display: flex;
        align-items: center;

        gap: 0.5rem;

        button {
            margin-right: 1rem;
        }
    }

    .loader {
        border: 4px solid rgba(255, 255, 255, 0.6);
        border-top: 4px solid var(--color-blue-500);
        border-radius: 50%;
        width: 1rem;
        height: 1rem;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>