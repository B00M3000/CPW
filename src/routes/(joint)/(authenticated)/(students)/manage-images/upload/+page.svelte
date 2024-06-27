<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang="ts">
    import { goto } from '$app/navigation';
    import { bytesToString } from '@/lib/utils'
    

    enum Status {
        NotUploaded,
        Uploading,
        Failed,
        Uploaded
    }

    export let data;

    $: ({ projects } = data)
    
    let projectId: string;

    let fileList: FileList;
    let files: File[] = [];
    let descriptions: string[];
    let statuses: Status[];

    function updateUploaded() {
        files = fileList ? fileListToArray(fileList) : [];
        descriptions = files.map(() => "");
        statuses = files.map(() => Status.NotUploaded)
    }

    function fileListToArray(fileList: FileList) {
        let files = [];
        for(let i = 0; i < fileList.length; i++) {
            files.push(fileList[i]);
        }
        return files;
    }

    async function upload(event: SubmitEvent, index: number) {
        if(statuses[index] != Status.NotUploaded) return;

        statuses[index] = Status.Uploading;

        event.preventDefault()

        const formData = new FormData();
        formData.set('image', files[index]);
        formData.set('description', descriptions[index]);
        formData.set('projectId', projectId);

        const response = await fetch('/manage-images/upload', {
            method: "PUT",
            body: formData
        })

        console.log(response);
        
        if(response.ok) {
            statuses[index] = Status.Uploaded;
        } else {
            statuses[index] = Status.Failed;
        }
    }

    async function gotoManageImages() {
        await goto('/manage-images');
    }

    let uploadedAll = false;
</script>

<main>
    <div id="navigation-button-container">
        <button on:click={gotoManageImages}>Back to Manage Images</button>
    </div>
    <div id="upload-container">
        <h2 class="text-xl">Upload Images to a Project!</h2>

        <div id="project-selector" class="flex items-center">
            <label for="project"><strong>Project: </strong></label>
            <select
                id="project"
                name="projectId"
                class="border-black border-[1px] rounded-md p-1"
                disabled={projects.length == 0}
                required
                bind:value={projectId}
            >
                <option disabled selected value="none">Please select a project!</option>
                {#each projects as project}
                    <option value={project._id}>{project.title}</option>
                {/each}
            </select>
        </div>  

        {#if projectId != "none"}
        <div class="flex gap-4 items-center">
            <button class="p-4 rounded-xl bg-blue-500 hover:bg-blue-400 text-white" on:click={() => goto(`/mobile-upload?projectId=${projectId}`)}>Mobile Upload</button>
            <span class="text-lg">OR</span>
            <input type="file" name="image" bind:files={fileList} on:change={updateUploaded} multiple={true} accept="image/png,image/jpeg,image/gif" />
        </div>
        {#if files.length > 0 && !uploadedAll}
        <button on:click={() => { uploadedAll = true; files.forEach((_, i) => upload(new SubmitEvent("button"), i))}} class="p-2 my-1 rounded-lg bg-cyan-400 hover:bg-cyan-500">Upload All!</button>
        {/if}
        <div id="uploaded-images">
            {#each files as file, i}
            <form class="uploaded-image" on:submit={(event) => upload(event, i)}>
                <img src={URL.createObjectURL(file)}  alt="related to project"/>
                {#if statuses[i] == Status.NotUploaded}
                <span
                    contenteditable="plaintext-only"
                    placeholder="Add Description..."
                    bind:innerHTML={descriptions[i]}
                />
                {:else}
                <span>{descriptions[i] || "N/A"}</span>
                {/if}
                <span>{bytesToString(file.size)}</span>
                {#if statuses[i] == Status.NotUploaded}
                <button type="submit" class="bg-cyan-400 p-2 rounded-md">Upload</button>
                {:else if statuses[i] == Status.Uploading}
                <div class="loader" />
                {:else if statuses[i] == Status.Failed}
                <span>Failed to upload, please try again.</span>
                {:else if statuses[i] == Status.Uploaded}
                <span>Upload successful.</span>
                {:else}
                <span>Error: Unknown State</span>
                {/if}
            </form>
            {/each}
        </div>
        {/if}
    </div>
</main>

<style lang="scss">
    #navigation-button-container {
        background-color: grey;
        padding: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        
        button {
            cursor: pointer;

            background-color: #478aff;
            color: #fff;
            border: none;
            border-radius: 2px;
            padding: 0.25rem;
            width: 98%;
            margin: 1px;
        }
        button:hover{
            background-color: #7fa8f1;
        }
    }

    main {
        display: block;
        flex-direction: column;
    }

    #upload-container {
        display: flex;
        flex-direction: column;;
        margin: 1rem;
        background-color: white;
        padding: 2rem;
        gap: 2rem;
    }

    #project-selector {
        display: flex;
        gap: 1rem;
    }

    #uploaded-images {
        display: flex;
        flex-direction: column;
    }

    .uploaded-image {
        border: 1px solid #ccc;
        padding: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;

        img {
            width: 3rem;
            height: 3rem;
            border-radius: 1rem;
        }
    }

    span:empty:before {
        content: attr(placeholder);
        pointer-events: none;
        display: block;
        font-style: italic;
        border-bottom: 2px black solid;
        color: rgba(0, 0, 0, 0.4);
    }

    .loader {
        border: 4px solid rgba(255, 255, 255, 0.6);
        border-top: 4px solid var(--color-blue-500);
        border-radius: 50%;
        width: 10px;
        height: 10px;
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

