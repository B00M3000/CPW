<script lang=ts>
    import Icon from "@/client/components/Icon.svelte";
    import CircleCheck from "@/client/icons/CircleCheck";
    import Save from "@/client/icons/Save";
    import { sleep } from "@/lib/utils";
    import { type Writable } from "svelte/store";

    export let imageId: Writable<string>;
    export let current: string = "";

    let description: string = current;

    let saved = false;

    async function updateDescription() { 
        const response = await fetch(`/manage-images/${$imageId}/description`, {
            method: "POST",
            body: description
        })

        saved = true;
    }
</script>

{#if $imageId}
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
{:else}
<div class="flex gap-1 justify-center items-center">
    <span>Description editor avaliable after upload.</span>
    <img src="assets/loading.gif" class="w-6 h-6">  
</div>
{/if}