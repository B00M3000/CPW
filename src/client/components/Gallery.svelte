<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang="ts">
    import { goto } from "$app/navigation";
    import LazyImage from "@/client/components/LazyImage.svelte";
  import SmartProjectImage from "./SmartProjectImage.svelte";

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

<div id="gallery" class="h-full">
    {#if images.length > 0}
    <div id="images" class="m-4">
        {#each images as image, i}
        <SmartProjectImage {image} showProjectPageButton={!projectPage} />
        {/each}
    </div>
    {:else}
    <img src="https://static-00.iconduck.com/assets.00/shrug-icon-512x370-5melpg84.png" width="30%" />
    <h3 class="text-3xl mt-10">No Images Uploaded.</h3>
    {/if}
</div>



<style lang="scss">
    #gallery {
        display: flex;
        // justify-content: center;
        flex-direction: column;
        // justify-content: center;
        align-items: center;

        width: 100%;

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
        background-color: inherit;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden; 
        max-width: 24rem;
        max-height: 18rem;
    }
</style>
