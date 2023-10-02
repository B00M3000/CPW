<script lang="ts">
  import { goto } from "$app/navigation";

  interface Image {
    _id: string;
    description: string;
  }

  export let image: Image;
</script>

<div id="image-card">
  <img src="/images/{image._id}" alt="" />
  <div id="image-details">
    <span id="image-subtitle">Image Caption:</span>
    <span id="image-description">{image.description}</span>
  </div>
    <button on:click={() => goto(`/images/${image._id}`)} class="view-more">View More</button>
</div>
  
<style lang="scss">
  img {
    background-color: inherit;
    object-fit: contain;
    width: 24rem;
    height: 18rem;
  }

  #image-card {
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    
    padding: 2rem;
    margin: 1rem;

    border: 1px solid black;
  }

  #image-details {

  }
</style>