<script lang="ts">
    import ImageUpload from "@/client/components/ImageUpload.svelte";
    import { bytesToString } from "@/lib/utils.js";
    import AssetCard from "@/client/components/AssetCard.svelte";
    import { goto } from "$app/navigation";
    export let data;

    $: ({ assets, projects } = data);

    async function deleteAsset(id: string) {
        await fetch(`/assets/${id}`, {
            method: "DELETE"
        })
        location.reload();
    }

    let grid = true;
</script>
<div class="toggle-view">
    <h4>Toggle {#if grid} Column {:else} Grid {/if}</h4>
    <label class="switch"> 
        <input type="checkbox" bind:checked={grid}>
        <span class="slider round"></span>
    </label>
    <button class="add-photos-button" on:click = {() => goto("/gallery/create")}>Add Photos</button>
</div>
<main>
    {#if assets.length > 0}
    <div id="assets">
        {#each assets as asset}
            {#if grid == true}
                <AssetCard {asset} />
            {:else}
                <div class="asset">

                    <img src="/assets/{asset._id}"/>
                    <span>{asset.desc || "No Description"}</span>
                    <span>{bytesToString(asset.size * 1000)}</span>
                    <button on:click={() => deleteAsset(asset._id)}>Delete</button>
                </div>
            {/if}
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


    .asset {
        border: 1px solid #ccc;
        padding: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: calc(80vw - 2rem);
    }

    
    .switch {
        position: relative;
        display: inline-block;
        width: 60px;
        height: 34px;
        margin: 5px;
        align-self: center;
        
    }

    .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        -webkit-transition: .4s;
        transition: .4s;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        -webkit-transition: .4s;
        transition: .4s;
    }

    input:checked + .slider {
        background-color: #2196F3;
    }

    input:focus + .slider {
        box-shadow: 0 0 1px #2196F3;
    }

    input:checked + .slider:before {
        -webkit-transform: translateX(26px);
        -ms-transform: translateX(26px);
        transform: translateX(26px);
    }

    .slider.round {
    border-radius: 34px;
    }

    .slider.round:before {
    border-radius: 50%;
    }

    .toggle-view{
        display: flex;
        text-align: center;
        justify-content: center;
        gap: 0.75vw;
    }

    .add-photos-button {
        align-self: center;
        background-color: var(--color-blue-grey-400); 
        color: white; 
        padding: 10px 20px; 
        border: none; 
        margin-left: 0.5vw;
        border-radius: 5px;
        cursor: pointer;
        display: inline-block; 
    }

    .add-photos-button:hover {
        background-color: #0056b3; 
    }
</style>
