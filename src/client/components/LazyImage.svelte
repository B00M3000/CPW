<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

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

    export let className: string = "";
    export let loadingClassname: string = "w-12 h-12";

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

{#if browser}
{#if visible}
<img {alt} class={className} bind:this={image} {src} class:loaded />
{:else}
<img {alt} class={loadingClassname} bind:this={image} src='/assets/loading.gif' class:loaded />
{/if}
{:else}
<img {alt} class={className} {src} loading="lazy" />
{/if}

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
</style>