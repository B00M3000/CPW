<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang="ts">
    import Nav from "./Nav.svelte";
    import MobileNav from "./MobileNav.svelte";
</script>

<div class="h-screen w-screen grid grid-rows-[auto_minmax(0,_1fr)_auto]">
    <Nav />
    <div class="overflow-y-auto h-full">
        <slot />
    </div>
    <MobileNav />
</div>
