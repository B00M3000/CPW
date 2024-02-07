<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang="ts">
    import GoogleSIM from "../../client/components/GoogleSIM.svelte";
</script>

<main>
    <div class="inline-flex flex-col bg-white p-8 w-[45vw] min-w-[20rem] max-w-[28rem] rounded-md m-12 ">
        <div class="text-2xl my-2">Project Week Database</div>
        <div class="my-2">This is a collection of past projects and project ideas for Commonwealth School's project week.</div>
        <div class="my-2">Please use you Commonwealth School Google account to sign into the project week database.</div>
        <hr class="w-full border-black border-solid border-[1px] my-5">
        <div class="m-auto"><GoogleSIM /></div>
    </div>
</main>

<style>
    main {
        background-color: darkred;
        display: flex;
        align-items: center;
        justify-content: center;
        height: calc(100vh - var(--nav-bar-height));
    }
</style>
