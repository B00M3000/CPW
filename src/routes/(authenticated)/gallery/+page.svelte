<script lang="ts">
    import ImageUpload from "@/client/components/ImageUpload.svelte";
    import { bytesToString } from "@/lib/utils.js";

    export let data;

    $: ({ assets, projects } = data);

    async function deleteAsset(id: string) {
        await fetch(`/assets/${id}`, {
            method: "DELETE"
        })
        location.reload();
    }
</script>

<ImageUpload {projects}/>
<main>

    <div id="assets">
        {#each assets as asset}
            <div class="asset">
                <img src="/assets/{asset._id}"/>
                <span contenteditable="true">{asset.desc || "No Description"}</span>
                <span>{bytesToString(asset.size * 1000)}</span>
                <button on:click={() => deleteAsset(asset._id)}>Delete</button>
            </div>
        {/each}
    </div>
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

    #assets {
        max-width: 80vw;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 5px;
        background-color: #fff;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }


    .asset {
        border: 1px solid #ccc;
        padding: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: calc(80vw - 2rem);
    }

</style>
