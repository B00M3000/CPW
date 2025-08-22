<script lang=ts>
    import { page } from '$app/stores';

    $: mobileKey = $page.url.searchParams.get('mobileKey');

    let allowUpload = false;
    let fileList: FileList;

    function updateUploaded() {
        status = Status.Picking
        allowUpload = fileList.length > 0;
    }

    enum Status {
        Picking,
        Uploading,
        Failed,
        Uploaded
    }

    let status: Status = Status.Picking;
    let successfulUploads = 0;

    let errorMessages: string[] = [];

    let uploadsCompleted = 0;

    async function upload() {
        if(status == Status.Uploading) return;

        uploadsCompleted = 0;

        errorMessages = [];

        status = Status.Uploading;

        Promise.all(Array.from(fileList).map(async (file) => {
            const formData = new FormData();
            formData.set('image', file);
            formData.set('mobileKey', mobileKey);

            const response = await fetch('/mobile-upload-portal', {
                credentials: 'include',
                method: "POST",
                body: formData
            })

            if(response.ok) {
                uploadsCompleted++;
            } else {
                try {
                    errorMessages.push((await response.json())?.message);
                } catch (error) {
                    errorMessages.push(response.statusText);
                }
            }

            return response.ok;
        }))
            .then((results) => {
                if(uploadsCompleted > 0) {
                    status = Status.Uploaded;
                } else {
                    status = Status.Failed;
                }
            })
    }

    let retryAttempts = 0;
</script>

<main class="h-screen flex flex-col justify-between items-center bg-[#8b0000]">
    <div class="w-full h-20 bg-[#a4123f]">
        <img src="/assets/CommSchool_primary_white.png" class='h-20'>
    </div>

    <div class="flex flex-col bg-white rounded-lg p-5 m-5 mb-36 max-w-xl w-full">
        <h1 class="text-xl">Mobile Image Upload</h1>
        <h2 class="text-sm text-gray-700">Project Week Website</h2>

        <form action="/mobile" method="POST" enctype="multipart/form-data" class="flex flex-col justify-center items-center" on:submit|preventDefault={upload}>
            <!-- Custom File Upload -->
            <div class="custom-file-upload my-4">
                <input
                    id="file-input"
                    class="hidden"
                    type="file"
                    name="image"
                    bind:files={fileList}
                    on:change={updateUploaded}
                    multiple={true}
                    accept="image/png,image/jpeg,image/gif"
                />
                <label for="file-input" class="upload-label">
                    <div class="upload-icon">
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                        </svg>
                    </div>
                    <div class="upload-text">
                        {#if fileList && fileList.length > 0}
                            <span class="font-semibold">{fileList.length} file{fileList.length > 1 ? 's' : ''} selected</span>
                            <span class="text-sm text-gray-600">Click to change selection</span>
                        {:else}
                            <span class="font-semibold">Choose images to upload</span>
                            <span class="text-sm text-gray-600">PNG, JPEG, or GIF files</span>
                        {/if}
                    </div>
                </label>
            </div>

            {#if fileList && fileList.length > 0}
                <div class="file-preview">
                    <h3 class="text-sm font-medium mb-2">Selected files:</h3>
                    <div class="file-list">
                        {#each Array.from(fileList) as file}
                            <div class="file-item">
                                <span class="file-name">{file.name}</span>
                                <span class="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}

            {#if allowUpload}
                {#if status == Status.Picking}
                    <button class="bg-blue-600 p-2 rounded-xl hover:bg-slate-300 text-white text-center" type="submit" disabled={status == Status.Failed || status == Status.Uploaded}>
                        Upload Images
                    </button>
                {:else if status == Status.Uploading}
                    <div class="flex justify-center items-center gap-3">
                        <div class='loader' />
                        <span>Uploading, please wait...</span>
                    </div>
                    <div class="flex justify-center gap-3 items-center mt-2">
                        <span>Completed {uploadsCompleted} of {fileList.length}</span>
                        <progress class='w-20' value={uploadsCompleted/fileList.length} max=1 />
                    </div>
                {:else if status == Status.Failed}
                    <span class="rounded-md bg-red-200 p-2 text-red-950">Upload Failed :(</span>
                    <span class="mt-2">Contact website management if it persists.</span>
                    {#if retryAttempts < 3}
                        <button class="bg-blue-600 p-2 rounded-xl hover:bg-slate-300 text-white text-center mt-2" type="submit" on:click={() => retryAttempts++}>
                            Upload Again
                        </button>
                    {:else}
                        <span>Try uploading again later...</span>
                    {/if}
                {:else}
                    <span class="rounded-md bg-green-200 p-2 text-green-950">Uploaded {uploadsCompleted} of {fileList.length} images!</span>
                {/if}
                {#if errorMessages.length > 0}
                    <span class="rounded-md bg-red-200 p-2 text-red-950 my-3">{errorMessages.join('\n')}</span>
                {/if}
            {/if}
        </form>
    </div>

    <div class="w-full h-20 bg-inherit"></div>
</main>

<style>
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

    /* Custom File Upload Styles */
    .custom-file-upload {
        width: 100%;
    }

    .upload-label {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        min-height: 120px;
        padding: 1.5rem;
        border: 2px dashed #a4123f;
        border-radius: 0.75rem;
        background-color: #fef2f2;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .upload-label:hover {
        border-color: #8b0000;
        background-color: #fef7f7;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(164, 18, 63, 0.15);
    }

    .upload-icon {
        color: #a4123f;
        margin-bottom: 0.75rem;
    }

    .upload-text {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .upload-text span:first-child {
        color: #374151;
        margin-bottom: 0.25rem;
    }

    .file-preview {
        width: 100%;
        margin-bottom: 1rem;
        padding: 1rem;
        background-color: #f9fafb;
        border-radius: 0.5rem;
        border: 1px solid #e5e7eb;
    }

    .file-list {
        max-height: 150px;
        overflow-y: auto;
    }

    .file-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.25rem 0;
    }

    .file-item:last-child {
        border-bottom: none;
    }

    .file-name {
        font-size: 0.875rem;
        color: #374151;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-right: 0.5rem;
    }

    .file-size {
        font-size: 0.75rem;
        color: #6b7280;
        flex-shrink: 0;
    }

    /* Responsive adjustments */
    @media (max-width: 480px) {
        .upload-label {
            min-height: 100px;
            padding: 1rem;
        }

        .custom-file-upload {
            max-width: none;
        }

        .file-preview {
            max-width: none;
        }
    }
</style>
