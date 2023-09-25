<script lang="ts">
    import { user } from "@/client/stores/user";
    export let asset: any;
  
    async function deleteAsset(id: string) {
        await fetch(`/assets/${id}`, {
            method: "DELETE"
        })
        location.reload();
    }
  </script>
<div class="asset-card">
    <div class="asset-image-container">
      <img src="/assets/{asset._id}" alt="an asset" class="asset-image" />
    </div>
    <div class="asset-details">
        <h4>Image Caption:</h4>
        <span class="desc">{asset.desc}</span>
      <!-- <span class="asset-size">{bytesToString(asset.size * 1000)}</span> -->
    </div>
    {#if $user.accessLevel == 1}
        <button on:click={() => deleteAsset(asset._id)} class="delete-button">Delete</button>
    {/if}
  </div>
  
<style lang="scss">
.asset-card {
    border: 2px solid #000000;
    border-radius: 4px;
    padding: 10px;
    width: 420px;
    margin: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .asset-image-container {
    width: 400px; 
    height: 225px;
    background-color: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden; 
  }

  .asset-image {
    max-width: 100%;
    max-height: 100%;
  }

  .asset-details {
    margin-top: 10px;
  }

  .asset-description {
    font-weight: bold;
    font-size: 1.2rem;
    margin-bottom: 5px;
  }

  .asset-size {
    color: #555;
  }

  .delete-button {
    background-color: #ff0000;
    color: #fff;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
  }

  .delete-button:hover {
    background-color: #cc0000;
  }

  h4{
    margin-bottom: 0.2rem;
  }

  .desc{
    margin-bottom: 0.2rem;
    
  }
  </style>