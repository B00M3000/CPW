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

            const response = await fetch('/mobile', {
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

<main class="h-[100vh] flex flex-col justify-between items-center bg-[#8b0000]">
    <div class="w-full h-20 bg-[#a4123f]">
        <img src="/assets/CommSchool_primary_white.png" class='h-20'>
    </div>

    <div class="flex flex-col bg-white rounded-xl p-5">
        <h1 class="text-xl">Mobile Image Upload</h1>
        <h2 class="text-sm text-gray-700">Project Week Website</h2>

        <form action="/mobile" method="POST" enctype="multipart/form-data" class="flex flex-col justify-center items-center" on:submit|preventDefault={upload}>
            <input class="my-4" type="file" name="image" bind:files={fileList} on:change={updateUploaded} multiple={true} accept="image/png,image/jpeg,image/gif" />
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
</style>