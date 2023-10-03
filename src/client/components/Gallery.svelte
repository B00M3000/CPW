<script lang="ts">
    import { goto } from "$app/navigation";
    import LazyImage from "@/client/components/LazyImage.svelte";

    interface Image {
        _id: string;
        description: string;
        projectId: string;
        project?: {
            title: string;
        };
    }

    export let images: Image[];

    async function gotoProject(id: string) {
        await goto(`/projects/${id}`);
    }
</script>

<div id="gallery">
    <h1>Image Gallery</h1>
    {#if images.length > 0}
    <div id="images">
        {#each images as image}
        <div class="image-container">
            <div class="lazy-image-container">
                <LazyImage src="/images/{image._id}" alt={image.description || ""} />
            </div>
            <div class="image-popup">
                {#if image.description}<span>Description: {image.description}</span>{/if}
                <span>Project: {image.project?.title}</span>
                <button on:click={() => gotoProject(image.projectId)}>Visit Project</button>
            </div>
        </div>
        {/each}
    </div>
    {/if}
</div>



<style lang="scss">
    #gallery {
        width: calc(100vw - (100vw - 100%));
        display: flex;
        justify-content: center;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        overflow-y: auto;
    }

    #images {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
    }

    .upload-images {
        align-self: center;
        background-color: var(--color-blue-grey-400); 
        color: white; 
        padding: 10px 20px; 
        border: none; 
        margin-left: 0.5vw;
        border-radius: 5px;
        cursor: pointer;
        display: inline-block; 

        &:hover {
            background-color: #0056b3; 
        }
    }

    .lazy-image-container {
        display: inline-flex;    
        background-color: inherit;
        width: 24rem;
        height: 18rem;
    }

    .image-container {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin: 0.25rem;

        cursor: pointer;

        .image-popup {
            position: absolute;
            display: inline-flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;

            visibility: hidden;
            background-color: white;
            padding: 0.5rem;
            border-radius: 1rem;

            max-width: 75%;
        }

        &:hover {
            .image-popup {
                visibility: visible;
            }
            .lazy-image-container {
                filter: blur(5px);
            }
        }
    }
</style>