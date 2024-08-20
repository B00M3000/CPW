<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<!-- Imported from https://github.com/B00M3000/Mindustry-Schematics on 10/2/2023 -->
<!-- Modified by Thomas Zhou <https://github.com/B00M3000> on 10/2/2023 -->

<script lang="ts">
    import { browser } from '$app/environment';
    // import { Stretch } from 'svelte-loading-spinners';
    import { on } from 'svelte/events';

    let { 
      src, 
      alt, 
      top = 0, 
      bottom = 0, 
      left = 0, 
      right = 0,
      className = "",
      loadingClassname = "w-12 h-12"
    }: {
        src: string;
        alt: string;
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
        className?: string;
        loadingClassname?: string;
    } = $props();
  
    let intersecting = $state(false);
    let image: HTMLImageElement | undefined = $state();
    let loaded = $state(false)
    let visible = $state(false);

    $effect(() => {
      loaded = Boolean(src && false)
      image = image
    })

    $effect(() => {
        if(image) {
            on(image, 'load', () => loaded = true);
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
                off();
                visible = true;
              }
            }
            const off = on(window, 'scroll', handler);
            return off;
        } 
    })
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
        transition: opacity ease-in 1s;
        max-width: 100%;
        max-height: 100%;
    }
    img.loaded,
    img[loading='lazy'] {
        opacity: 1;
    }
</style>
