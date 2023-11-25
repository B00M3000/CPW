<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang="ts">
  import { goto } from "$app/navigation";
    import { bytesToString } from "@/lib/utils";

    interface PageData {
        images: {
            _id: string;
            size: number;
            description: string;
            projectId: string;
            project: {
                title: string;
            }
        }[]
    }

    enum Status {
        Unchanged,
        Deleting,
        Deleted
    }

    export let data: PageData;

    $: images = data.images.map(image => ({ ...image, status: Status.Unchanged }))

    async function deleteImage(id: string) {
        const imageIndex = images.findIndex(image => image._id == id)

        images[imageIndex].status = Status.Deleting

        await fetch(`/manage-images/${id}`, { method: "DELETE" })

        images[imageIndex].status = Status.Deleted
    }

    async function gotoImageUpload() {
        await goto("/manage-images/upload");
    }
</script>

<main>
    <div id="upload-images-button-container">
        <button on:click={gotoImageUpload}>Click Here to Upload Images</button>
    </div>
    <div id="images">
        {#each images as image}
        <div class="image">
            <img src="/images/{image._id}" />
            <span>{image.project.title}</span>
            <span>{image.description || "No description."}</span>
            <span>{bytesToString(image.size)}</span>
            {#if image.status == Status.Unchanged}
            <button class="delete" on:click={() => deleteImage(image._id)}>Delete</button>
            {:else if image.status == Status.Deleting }
            <div class="loader" />
            {:else if image.status == Status.Deleted}
            <span>Image Deleted</span>
            {/if}
        </div>
        {/each}
    </div>
</main>


<style lang="scss">
    img { 
        width: 5rem;
        height: 5rem;
        border-radius: 0.5rem;
    }

    .delete{
        border: 0;
        padding: 8px 10px;
        background-color: red;
        color: white;
        border-radius: 5px;
    }

    #upload-images-button-container {
        background-color: grey;
        padding: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        
        button {
            cursor: pointer;

            background-color: #478aff;
            color: #fff;
            border: none;
            border-radius: 2px;
            padding: 0.25rem;
            width: 98%;
            margin: 1px;
        }
        button:hover{
            background-color: #7fa8f1;
        }
    }

    .loader {
        border: 4px solid rgba(255, 255, 255, 0.6);
        border-top: 4px solid var(--color-blue-500);
        border-radius: 50%;
        width: 20px;
        height: 20px;
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

    #images {
        margin: 2rem;
    }

    .image {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border: 2px solid grey;
        margin: 1rem;
        padding: 1rem;
    }
</style>

