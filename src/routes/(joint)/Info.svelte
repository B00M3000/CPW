<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang="ts">
    import Icon from "@/client/components/Icon.svelte";
    import Information from "@/client/icons/Information";
    import Close from "@/client/icons/Close";
    import { PUBLIC_BUILD_NUMBER } from "$env/static/public";

    let isOpen = false;

    function toggleState() {
        isOpen = !isOpen
    }
</script>

<button on:click={toggleState}>
    <Icon src={Information} color="white" size="1.25em"/>
</button>

{#if isOpen}
<div class="fixed top-0 left-0 bg-opacity-65 bg-black z-10 w-screen h-screen flex items-center justify-center">
    <div class="flex flex-col p-8 bg-slate-300 rounded-xl text-black w-[45vw] min-w-[22rem] max-w-[32rem]">
        <div class="flex justify-between items-center">
            <h1 class="text-xl font-bold">Information</h1>
            <button on:click={toggleState}>
                <Icon src={Close} size="2em"/>
            </button>
        </div>

        <!-- Commonwealth School Project Week Website v2 -->
        <!-- Overhauled and Rewritten by: Thomas Zhou 26' -->
         <!-- Featuring a complete css and backend rewrite. -->

        <!-- <br>

        <span>Project and Code Owner, Lead-Author: Thomas Zhou (26')</span>
        <span>Co-Author: Ethan Wu (26')</span>

        <br> -->

        <span class="m-5">Build #{PUBLIC_BUILD_NUMBER}</span>
    </div>
</div>
{/if}

<style>
    button {
        background: none;
        background-color: transparent;
        border: none;
    }
</style>
