<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang="ts">
    import Nav from "./Nav.svelte";
    import MobileNav from "./MobileNav.svelte";

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

<div class="h-screen w-screen grid grid-rows-[auto_minmax(0,_1fr)_auto]">
    <Nav />
    <div class="overflow-y-auto">
        <slot />
    </div>
    <MobileNav />
</div>
