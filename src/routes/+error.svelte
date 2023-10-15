<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang="ts">
    import { page } from "$app/stores";
</script>

<main>
    <span class="status">{$page.status}</span>
    <span class="message">{$page.error?.message}</span>
</main>

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