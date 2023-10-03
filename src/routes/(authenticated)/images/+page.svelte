<script lang="ts">
    import { goto } from "$app/navigation";
    import Gallery from "@/client/components/Gallery.svelte";
    import { user } from "@/client/stores/user";
    import { AccountType } from "@/lib/enums";

    export let data;

    $: ({ images } = data);

    async function gotoImageUpload() {
        await goto("/manage-images/upload");
    }

    async function gotoManageImages() {
        await goto("/manage-images");
    }
</script>

<main>
    {#if $user.accountType == AccountType.Student}
    <div id="upload-images-button-container">
        <button on:click={gotoImageUpload}>Upload Images</button>
        <button on:click={gotoManageImages}>Manage Images</button>
    </div>
    {/if}
    <Gallery {images} />
</main>

<style lang='scss'>
    main {
        display: flex;
        flex-direction: column;
        justify-content: center;

        // height: calc(100vh - var(--nav-bar-height));
    }

    #upload-images-button-container {
        background-color: grey;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        gap: 0.5rem;
        
        button {
            cursor: pointer;

            background-color: #ff6347;
            color: #fff;
            border: none;
            border-radius: 2px;
            padding: 0.25rem;
            width: 98%;
            margin: 1px;
        }
    }
</style>



