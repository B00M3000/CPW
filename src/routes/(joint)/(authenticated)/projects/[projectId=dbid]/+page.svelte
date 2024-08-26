<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang=ts>
    import StudentCard from '@/client/components/StudentCard.svelte';
    import MentorCard from '@/client/components/MentorCard.svelte';
    import Tags from '@/client/components/Tags.svelte';
    import SmartProjectImage from '@/client/components/SmartProjectImage.svelte';

    import NormalProjectPage from './NormalProjectPage.svelte';
    import MobileProjectPage from './MobileProjectPage.svelte';

    let { data } = $props();

    let windowWidth: number = $state(0);
</script>

{#if windowWidth < 1180}
    <MobileProjectPage {data} />
{:else}
    <NormalProjectPage {data}  />
{/if}

<svelte:window bind:innerWidth={windowWidth} />
