<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang="ts">
    import { page } from "$app/stores";
    import Nav from "./(joint)/Nav.svelte";
    import MobileNav from "./(joint)/MobileNav.svelte";
</script>

<div class="h-screen w-screen grid grid-rows-[auto_minmax(0,_1fr)_auto]">
    <Nav />
    <main>
        <span class="status">{$page.status}</span>
        <span class="message">{$page.error?.message}</span>
    </main>
    <MobileNav />
</div>


<style lang="scss">
    main {
        display: flex;
        flex-direction: column;

        justify-content: center;
        align-items: center;

        height: calc(100vh - var(--nav-bar-height));

        .status {
            font-size: 15vh;
        }

        .message {
            font-size: 5vh;
        }
    }
</style>
