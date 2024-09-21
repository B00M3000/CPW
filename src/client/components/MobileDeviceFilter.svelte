<script lang=ts>
    import { browser } from "$app/environment";

    let { children } = $props();

    let windowWidth = $state(99999);
    if(browser) windowWidth = window.innerWidth;
</script>

{#if windowWidth > 640}
{@render children()}
{:else}
<div class="w-full h-full flex flex-col items-center justify-center gap-8">
    <img src=/assets/desktop.png class="w-48 h-48" alt="desktop"/>
    <span class="text-2xl mx-8 text-center">Please visit this page on a desktop or bigger screen.</span>
</div>
{/if}

<svelte:window bind:innerWidth={windowWidth} />
