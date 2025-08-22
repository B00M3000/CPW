<script lang=ts>
    import { goto } from "$app/navigation";
    import LazyImage2 from "@/client/components/LazyImage2.svelte";
    import { Expand, ExternalLink } from "lucide-svelte";
    import { Stretch } from 'svelte-loading-spinners';

    interface Image {
        _id: string;
        description: string;
        projectId: string;
        project?: {
            title: string;
        };
    }

    let {
        image,
        showProjectPageButton = true,
    }: {
        image: Image;
        showProjectPageButton: boolean;
    } = $props();

    function toggleOverlay(value: boolean, event?: MouseEvent) {
        if(value) {
            overlay = true
        } else {
            // if(event?.target?.nodeName == "BUTTON") overlay = false
            overlay = false
        }
    }

    let overlay = $state(false);
</script>

{#snippet loading()}
<div class="absolute flex items-center justify-center w-full h-full" slot="loading">
    <Stretch />
</div>
{/snippet}

<div class="relative inline-flex items-center justify-center m-1 p-2 rounded-lg w-full h-full overlay-trigger">
    <div class="flex items-center justify-center w-full h-full blurred bg-inherit">
        <LazyImage2 src="/images/{image._id}" alt={image.description || ""} class="w-full h-full object-contain" />
    </div>
    <div class="absolute flex-col gap-2 justify-center items-center text-center hidden will-display bg-white p-2 rounded-lg max-w-64 z-20">
        <span><strong>Project:</strong> {image.project?.title}</span>
        {#if image.description}<span><strong>Description:</strong> {image.description}</span>{/if}
        <div class='grid auto-cols-fr grid-flow-col'>
            <button class="p-2 py-1 m-1 rounded-md bg-gray-200 hover:bg-gray-300 flex items-center gap-2 justify-center" onclick={() => toggleOverlay(true)}>
                <Expand size={20}/>
                <span>Enlarge</span>
            </button>
            {#if showProjectPageButton}
            <a class="p-2 py-1 m-1 rounded-md bg-gray-200 hover:bg-gray-300 flex items-center gap-2 justify-center" href="/projects/{image.projectId}" data-sveltekit-preload-code>
                <ExternalLink size={20}/>
                <span>Open</span>
                </a>
            {/if}
        </div>
    </div>
</div>
{#if overlay}
<button class="flex items-center justify-center fixed left-0 top-0 z-30 w-screen h-screen bg-[#00000088]" onclick={(event: MouseEvent) => toggleOverlay(false, event)}>
    <img class="object-contain max-w-[75vw] max-h-[75vw]" src="/images/{image._id}" alt={image.description}/>
</button>
{/if}

<style>
    .overlay-trigger:hover {
        .blurred {
            filter: blur(5px);
        }
        .will-display {
            display: inline-flex;
        }
    }
</style>
