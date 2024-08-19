<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang="ts">
    import Nav from "@/client/components/Nav.svelte";

    import { browser } from '$app/environment';
    import { navigating } from '$app/stores';
    import BarLoader from 'svelte-loading-spinners/BarLoader.svelte';
</script>

<svelte:head>
    <meta property="og:title" content="Project Week Database" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://cpw.tzhou.xyz" />
    <meta property="og:image" content="https://cpw.tzhou.xyz/assets/CommonwealthSchool.jpg" />
    <meta property="og:description" content="This is the database housing records of Project Week projects. Find inspiration from and look at projects completed in previous years." />
    <meta property="og:determiner" content="the" />
    <meta property="og:locale" content="en_GB" />
    <meta property="og:site_name" content="Commonwealth School" />

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@commschool">
    <meta name="twitter:title" content="Project Week Database">
    <meta name="twitter:description" content="This is the database housing records of Project Week projects. Find inspiration from and look at projects completed in previous years.">
    <meta name="twitter:image" content="https://cpw.tzhou.xyz/assets/CommonwealthSchool.jpg">
</svelte:head>

<Nav>
    {#if $navigating}
    <div class="loader">
        <BarLoader size=100 unit="vw" duration="30s" color="#e65984" />
    </div>
    {/if}
    <div class="h-[calc(100vh-var(--nav-bar-height))] overflow-y-auto">
        <slot />
    </div>
</Nav>

<style>
    .loader {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 21;
        height: 0.2rem;
        overflow: hidden;
    }
</style>
