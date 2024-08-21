<script lang=ts>
    import Icon from "@/client/components/Icon.svelte";
    import CircleCheck from "@/client/icons/CircleCheck";
    import Save from "@/client/icons/Save";

    let { imageId, current }: { imageId: string, current: string } = $props();

    let description: string = current;

    let saved = $state(false);

    async function updateDescription() { 
        const response = await fetch(`/manage-images/${imageId}/description`, {
            method: "POST",
            body: description
        })
        saved = true;
    }
</script>

<div class="flex gap-1 justify-center items-center">
    <span
        contenteditable="plaintext-only"
        placeholder="Add Description..."
        bind:innerHTML={description}
        class="border-b-2 border-black min-w-36 text-center max-w-48"
        on:input={() => saved = false}
    />
    <button class="bg-blue-500 rounded-md p-1 text-white" on:click={updateDescription}>
        <Icon src={saved ? CircleCheck : Save} color={saved ? "lightgreen" : "white"} size="1.5em"/>
    </button>
</div>