<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang=ts>
    import { page } from "$app/state";

    import Nav from "./Nav.svelte";
    import MobileNav from "./MobileNav.svelte";

    const overflowExcludedRoutes = [
        "/manage-advisees"
    ];

</script>

<div class="!h-[100dvh] h-[100vh] w-screen grid grid-rows-[auto_minmax(0,_1fr)_auto]">
    <Nav />
    <div class="{overflowExcludedRoutes.includes(page.url.pathname) ? '' : 'overflow-y-auto '}h-full">
        <slot />
    </div>
    <MobileNav />
</div>
