<script lang="ts">
    import type { DataImport, Fields } from "@/lib/data-import";
    import { parseCSV } from "@/lib/utils";
    import { onMount } from "svelte";

    export let dataImport: DataImport;
    export let endpoint: string;

    let fields: Fields;

    onMount(() => {
        fields = dataImport.fields;
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

    function uploadData() {

    }
</script>

<div id="data-import">
    <h3>Import <em>{dataImport.name}</em> Data</h3>

    <input type='file' multiple={false} accept="text/csv" bind:files={files}/>

    {#if file}
    <div id="data-import-result">
        <table>
            <tr>
                {#each headings as heading}
                <th class="{headingValidation(heading) ? "valid" : "invalid"}">
                    <span>{heading}</span>
                </th>
                {/each}
            </tr>
            {#each entries as entry}
            <tr>
                {#each entry as part, headingIndex}
                <td class="{partValidation(headings[headingIndex], part) ? "valid" : "invalid"}">
                    <span>{part}</span>
                </td>
                {/each}
            </tr>
            {/each}
        </table>

        {#if errors.length > 0}
        <div id="errors">
            <span>Errors: </span>
            <ol>
                {#each errors as error}<li>{error}</li>{/each}
            </ol>
        </div>
        {/if}
    </div>
    {/if}

    {#if file && errors.length == 0}
    <div id="submit">
        <button on:click={uploadData}>Upload Data</button>
        <!-- Add Spinner and Success Message -->
    </div>
    {/if}
</div>

<style lang='scss'>
    #data-import {
        display: flex;
        flex-direction: column;

        background-color: aliceblue;
        padding: 2rem;
        margin: 2rem;
    }

    #data-import-result {
        display: flex;
        flex-wrap: wrap;

        justify-content: left;
        
        margin: 2rem;

        gap: 2rem;
    }

    #errors {
        display: flex;
        flex-direction: column;
        background: white;

        padding: 2rem;
    }

    #submit {
        display: flex;
    }

    table {
        padding: 1rem;
        border-radius: 1rem;
        background-color: #fff;

        gap: 2rem;

        tr {
            th, td {
                // display: inline-table;
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
</style>