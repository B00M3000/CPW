<script lang=ts>
    let { step = $bindable(), creationStatus = $bindable() } = $props();

    let statusMessage = $derived.by(() => {
        switch (creationStatus) {
            case "success":
                return "Successfully created!";
            case "error":
                return "Project creation failure.";
            case "started":
                return "Project information is being sent to the server...";
            case "not_started":
                return "I didn't send the creation request for some reason?";
            default:
                return "Unknown Status!";
        }
    });
</script>

<span class="text-2xl font-bold mb-8">Step 5: Final Touches</span>

<div class="flex items-center gap-2 mb-8">
    <span>Project Status: </span>
    <span class="p-1 bg-gray-200 rounded-md px-2">{statusMessage}</span>
</div>

<span class="max-w-[24rem] text-base mb-8">Images are crucial to understanding your project. Please consider uploading a few images <a class="text-blue-500 underline" href="/manage-images">here</a>. :)</span>

<span class="text-base mb-2">Alternatively: </span>

<div class='flex items-center justify-start'>
    <a class="p-2 px-5 bg-red-500 hover:bg-red-600 text-white rounded-md flex items-center" href="/manage-projects">
        <span>Return to Projects</span>
    </a>
</div>
