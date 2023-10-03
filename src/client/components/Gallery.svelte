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
    export let projectPage: boolean;
    export let autoHeightAndWidth: boolean = false;

    async function gotoProject(id: string) {
        await goto(`/projects/${id}`);
    }

    function toggleOverlay(index: number, value: boolean, event?: PointerEvent) {
        if(value) {
            overlay[index] = true
        } else {
            console.log(event)
            if(event?.target?.nodeName == "DIV") overlay[index] = false
        }   
    }

    let overlay: boolean[] = images.map(() => false);
</script>

<div id="gallery">
    <h1>Image Gallery</h1>
    {#if images.length > 0}
    <div id="images">
        {#each images as image, i}
        <div class="image-container">
            <div class="lazy-image-container" style={autoHeightAndWidth ? `width: auto; height: auto;` : ""}>
                <LazyImage src="/images/{image._id}" alt={image.description || ""} />
            </div>
            <div class="image-popup">
                {#if image.description}<span>Description: {image.description}</span>{/if}
                <span>Project: {image.project?.title}</span>
                <button on:click={() => toggleOverlay(i, true)}>View Enlarged</button>
                {#if !projectPage}
                <button on:click={() => gotoProject(image.projectId)}>Visit Project</button>
                {/if}
            </div>
        </div>
        {#if overlay[i]}
        <div class="image-overlay" on:click={(event) => toggleOverlay(i, false, event)}>
            <div class='image-overlay-container'>
                <img src="/images/{image._id}" alt={image.description}/>
            </div>
        </div>
        {/if}
        {/each}
    </div>
    {/if}
</div>



<style lang="scss">
    .image-overlay {
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;

        left: 0;
        top: 0;
        z-index: 9999;
        
        width: 100vw;
        height: 100vh;

        background: rgba(1, 1, 1, 0.2);

        .image-overlay-container {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 75vw;
            height: 75vh;

            img {
                object-fit: contain;
            }
        }
    }

    #gallery {
        display: flex;
        justify-content: center;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        overflow-y: auto;

        background-color: #ddd;
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

    button {
        padding: 5px;
        margin: 5px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-weight: 300;
        background-color: var(--color-blue-grey-300);
        color: white;
        font-weight: 600;
    }

    button:hover{
        background-color: var(--color-blue-grey-200);
    }

    .lazy-image-container {
        display: inline-flex;    
        background-color: inherit;
        align-items: center;
        justify-content: center;
        width: 24rem;
        height: 18rem;
    }

    .image-container {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin: 0.25rem;
        padding: 0.5rem;
        border-radius: 2rem;
        background-color: #f4f4f4;

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

            max-width: 18rem;
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