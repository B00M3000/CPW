<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang=ts>
    import GoogleSIM from "@/client/components/GoogleSIM.svelte";
</script>

<main class="h-full max-md:bg-gray-300 md:bg-[darkred] flex items-center justify-center">
    <div class="flex flex-col md:bg-white p-8 rounded-md m-4 md:m-12 md:max-w-lg">
        <div class="text-2xl my-2">Login</div>
        <div class="my-2 text-gray-700">This is a collection of past projects and project ideas for Commonwealth School's project week.</div>
        <div class="my-2 text-gray-700">Please use your Commonwealth School Google account to sign in.</div>
        <hr class="w-full border-black border-solid border-[1px] my-5" />
        <div class="md:m-auto mr-auto"><GoogleSIM /></div>
    </div>
</main>
