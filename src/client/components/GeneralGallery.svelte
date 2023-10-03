<script lang="ts">
    import { bytesToString } from "@/lib/utils.js";
    import { user } from "@/client/stores/user";
    import AssetCard from "@/client/components/AssetCard.svelte";
    import { goto } from "$app/navigation";
    import { persisted as storageWritable } from 'svelte-local-storage-store'


    export let assets: any;

</script>

<main>
    {#if assets.length > 0}
    <div id="assets">
        {#each assets as asset}
            <AssetCard {asset} />
        {/each}
    </div>
    {/if}

    
</main>



<style lang="scss">
    main {
        width: calc(100vw - (100vw - 100%));
        display: flex;
        justify-content: center;
        margin-top: 1rem;
    }
    
    img {
        width: 3rem;
        height: 3rem;
        border-radius: 1rem;
    }

    #assets {
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





</style>