<script lang="ts">
    import { user } from "@/client/stores/user";
    import ImageCard from "@/client/components/ImageCard.svelte";
    import { goto } from "$app/navigation";
    import { AccountType } from "@/lib/enums";

    interface Image {
        _id: string;
        description: string;
    }

    export let images: Image[];

    async function gotoImageUpload() {
        await goto("/manage-images/upload");
    }
</script>

{#if $user.accountType == AccountType.Student}
<button class="upload-images" on:click={gotoImageUpload}>Upload Images</button>
{/if}
<main>
    {#if images.length > 0}
    <div id="images">
        {#each images as image}
        <ImageCard {image} />
        {/each}
    </div>
    {/if}
</main>



<style lang="scss">
    main {
        width: calc(100vw - (100vw - 100%));
        display: flex;
        justify-content: center;
    }
    
    img {
        width: 3rem;
        height: 3rem;
        border-radius: 1rem;
    }

    #images {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 5px;
        background-color: #fff;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
</style>