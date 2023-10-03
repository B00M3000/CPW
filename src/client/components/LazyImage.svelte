<!-- Imported from https://github.com/B00M3000/Mindustry-Schematics on 10/2/2023 -->
<!-- Modified by Thomas Zhou <https://github.com/B00M3000> on 10/2/2023 -->

<script lang="ts">
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    export let src: string;
    export let alt: string;
    export let top = 0;
    export let bottom = 0;
    export let left = 0;
    export let right = 0;
  
    let intersecting = false;
    let image: HTMLImageElement;
    let loaded = false;
    let visible = false;

    $: {
      // mark the image as unloaded if the src changes
      loaded = Boolean(src && false);
    }

    onMount(() => {
      image.addEventListener('load', () => (loaded = true));
      if (typeof IntersectionObserver !== 'undefined') {
        const observer = new IntersectionObserver((entries) => {
          intersecting = entries[0].isIntersecting;
          if (intersecting) {
            observer.unobserve(image);
            visible = true;
          }
        });
        observer.observe(image);
        return () => observer.unobserve(image);
      }
  
      // The following is a fallback for older browsers
      function handler() {
        const bcr = image.getBoundingClientRect();
  
        intersecting =
          bcr.bottom + bottom > 0 &&
          bcr.right + right > 0 &&
          bcr.top - top < window.innerHeight &&
          bcr.left - left < window.innerWidth;
  
        if (intersecting) {
          window.removeEventListener('scroll', handler);
          visible = true;
        }
      }
  
      window.addEventListener('scroll', handler);
      return () => window.removeEventListener('scroll', handler);
    });
</script>

<div class="image-container">
  {#if browser}
  <img {alt} bind:this={image} src={visible ? src : undefined} class:loaded />
  {:else}
  <img {alt} {src} loading="lazy" />
  {/if}
</div>

<style>
    img {
        opacity: 0;
        transition: opacity ease 0.5s;
        max-width: 100%;
        max-height: 100%;
    }
    img.loaded,
    img[loading='lazy'] {
        opacity: 1;
    }
    .image-container {
      width: 400px; 
      height: 225px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden; 
      padding: 4px;
      outline: 2px solid black;
      border-radius: 10px;
      background-color: rgb(118, 118, 118);
    }
</style>