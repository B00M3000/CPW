<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang=ts>
    import NormalProjectPage from './NormalProjectPage.svelte';
    import MobileProjectPage from './MobileProjectPage.svelte';

    let { data } = $props();

    let windowWidth: number = $state(9999);
</script>

{#if windowWidth < 1180}
    <MobileProjectPage {data} />
{:else}
    <NormalProjectPage {data}  />
{/if}

<svelte:window bind:innerWidth={windowWidth} />
