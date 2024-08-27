<script lang=ts>
    let { step = $bindable(), creationStatus = $bindable() } = $props();
</script>

<span class="text-2xl font-bold mb-8">Step 5: Final Touches</span>



<div class='flex items-center justify-start gap-4'>
    <span>{creationStatus}</span>
    <a class="p-2 px-5 bg-red-500 hover:bg-red-600 text-white rounded-md flex items-center" href="/manage-projects">
        <span>Exit</span>
    </a>
</div>
