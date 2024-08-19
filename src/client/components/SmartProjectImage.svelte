<script lang=ts>
    import { goto } from "$app/navigation";
    import LazyImage from "@/client/components/LazyImage.svelte";
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
            if(event?.target?.nodeName == "BUTTON") overlay = false
        }   
    }

    async function gotoProject() {
        await goto(`/projects/${image.projectId}`);
    }

    let overlay = $state(false);
</script>

{#snippet loading()}
<div class="absolute flex items-center justify-center w-full h-full" slot="loading">
    <Stretch />
</div>
{/snippet}

<div class="relative inline-flex items-center justify-center m-1 p-2 rounded-lg bg-gray-300 w-full h-full overlay-trigger">
    <div class="flex items-center justify-center w-full h-full blurred z-10 bg-inherit">
        {#key image._id}
        <LazyImage src="/images/{image._id}" alt={image.description || ""} className="w-auto h-auto" />
        {/key}
    </div>
    <div class="absolute flex-col justify-center items-center text-center hidden will-display bg-white p-2 rounded-lg max-w-64 z-20">
        {#if image.description}<span><strong>Description:</strong> {image.description}</span>{/if}
        <span><strong>Project:</strong> {image.project?.title}</span>
        <button class="p-1 m-1 rounded-md bg-slate-300 hover:bg-slate-400" onclick={() => toggleOverlay(true)}>View Enlarged</button>
        {#if showProjectPageButton}
        <button class="p-1 m-1 rounded-md bg-slate-300 hover:bg-slate-400" onclick={gotoProject}>Visit Project</button>
        {/if}
    </div>
</div>
{#if overlay}
<button class="flex items-center justify-center fixed left-0 top-0 z-30 w-screen h-screen bg-[rgba(1, 1, 1, 0.2)]" onclick={(event: MouseEvent) => toggleOverlay(false, event)}>
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
