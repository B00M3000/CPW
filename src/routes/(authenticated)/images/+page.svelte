<script lang="ts">
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
        event.preventDefault()

        const formData = new FormData();
        formData.set('image', files[index]);
        formData.set('description', descriptions[index]);
        formData.set('projectId', projectId);

        statuses[index] = Status.Uploading;

        const response = await fetch('/images', {
            method: "PUT",
            body: formData
        })
        
        if(response.ok) {
            statuses[index] = Status.Uploaded;
        } else {
            statuses[index] = Status.Failed;
        }
    }
</script>

<main>
    <label for="project"><strong>Project: </strong></label>
    <select
        id="project"
        name="projectId"
        disabled={projects.length == 0}
        required
        bind:value={projectId}
    >
        <option disabled selected value="none">Please select a project!</option>
        {#each projects as project}
            <option value={project._id}>{project.title}</option>
        {/each}
    </select>

    {#if projectId != "none"}
    <input type="file" name="image" bind:files={fileList} on:change={updateUploaded} multiple={true} accept="image/png,image/jpeg,image/gif" />
    <div id="uploaded-images">
        {#each files as file, i}
        <form class="uploaded-image" on:submit={(event) => upload(event, i)}>
            <img src={URL.createObjectURL(file)} />
            <span
                contenteditable
                placeholder="Add Description..."
                bind:innerHTML={descriptions[i]}
            />
            <span>{bytesToString(file.size)}</span>
            {#if statuses[i] == Status.NotUploaded}
            <button type="submit">Upload</button>
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
</main>

<style lang="scss">
    main {
        display: flex;
        flex-direction: column;
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
        border: 8px solid rgba(255, 255, 255, 0.6);
        border-top: 8px solid var(--color-blue-500);
        border-radius: 50%;
        width: 10px;
        height: 10px;
        animation: spin 2s linear infinite;
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

