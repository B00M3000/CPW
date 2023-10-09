<script lang="ts">
    import { parseCSV } from "@/lib/utils";

    let fileInputElement: HTMLInputElement;
    let headings: string[] = [];
    let entries: string[][] = [];
    let errors: string[] = [];

    interface RequiredField {
        name: string;
        isValid: (value: string) => boolean;
    }

    const studentRequiredFields: RequiredField[] = [
        { name: "Username", isValid: (value: string) => /.+/.test(value) },
        { name: "Identifier", isValid: (value: string) => /\d+/.test(value) }
    ]

    function headingValidation(heading: string) {
        const valid = studentRequiredFields.find(({ name }) => name == heading);
        if(!valid) errors.push(`Invalid column "${heading}" found.`);
        return valid
    }

    function partValidation(heading: string, part: string) {
        const valid = studentRequiredFields.find(({ name }) => name == heading)?.isValid(part);
        if(!valid) errors.push(`Invalid cell value "${part}" found under "${heading}".`);
        return valid
    }

    async function onFileChange() {
        const { files } = fileInputElement;
        if(!files || !files[0]) return;
        const parsedCSV = (await parseCSV(files[0])).map(r => r.map(s => s.trim()));
        headings = parsedCSV.shift() || [];
        entries = parsedCSV;
        errors = []
    }

    // let link: string;

    // async function onLinkChange() {

    //     const file = 
    // }
</script>

<input bind:this={fileInputElement} type="file" multiple={false} accept="text/csv" on:change={onFileChange} />

<!-- <input on:change={onLinkChange} placeholder="Enter Google Sheet URL" bind:value={link} /> -->

    {#if entries.length > 0}
        <table>
            <tr>
                {#each headings as heading, headingIndex}<th class="{headingValidation(heading) ? "valid" : "invalid"}">{heading}</th>{/each}
            </tr>
            {#each entries as entry, entryIndex}
            <tr>
                {#each entry as part, headingIndex}<td class="{partValidation(headings[headingIndex], part) ? "valid" : "invalid"}">{part}</td>{/each}
            </tr>
            {/each}
        </table>
    {/if}

</main>

{#if errors.length > 0}
<h1>Errors: </h1>
<ol>
    {#each errors as error}<li>{error}</li>{/each}
</ol>
{/if}

<style lang='scss'>
  
    .container {
        align-self: center;
        width: calc(100vw - (100vw - 100%));
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        margin-top: 1rem;

        
        input[type="file"] {
            border: 1px solid #007bff; 
            padding: 10px;
            background-color: #ffffff;
            color: #007bff;
            border-radius: 5px;
            cursor: pointer;
        }

        table {
            padding: 1rem;
            border-radius: 1rem;
            background-color: #fff;
            tr {
                th, td {
                    padding: 0.5rem 1rem;
                }
                &:nth-child(even) {
                    background-color: #ddd;
                }
            }
        } 
    }
   
    .valid { color: green; }
    .invalid { color: red; }
</style>