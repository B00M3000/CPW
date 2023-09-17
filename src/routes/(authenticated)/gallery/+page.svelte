<script lang="ts">
    import ImageUpload from "@/client/components/ImageUpload.svelte";

    export let data;

    $: ({ assets, projects } = data);

    async function deleteAsset(id: string) {
        await fetch(`/assets/${id}`, {
            method: "DELETE"
        })
        location.reload();
    }
</script>

<main>
    <div id="assets">
        {#each assets as asset}
            <div class="asset">
                <img src="/assets/{asset._id}"/>
                <span>{asset.desc || "No Description"}</span>
                <span>{asset.size} KB</span>
                <button on:click={() => deleteAsset(asset._id)}>Delete</button>
            </div>
        {/each}
    </div>
</main>

<ImageUpload {projects}/>

<style lang="scss">
    main {
        width: 100vw;
        display: flex;
        justify-content: center;
    }
    
    img {
        width: 3rem;
        height: 3rem;
        border-radius: 1rem;
    }

    #assets {
        background-color: var(--color-white);
        padding: 1rem;
        width: 66vw;
    }

    .asset {
        border: 1px solid #ccc;
        padding: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>
