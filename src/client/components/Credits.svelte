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
        
        <br>

        <span>Project and Code Owner, Lead-Author: Thomas Zhou (26')</span>
        <span>Co-Author: Ethan Wu (26')</span>

        <br>

        <span>Build #{PUBLIC_BUILD_NUMBER}</span>

        <br>
    
        <span class="text-lg">Dependencies: </span>
        <ul class="flex flex-col px-3 py-1">
            <span class="package">Svelte - {pkgJSON.devDependencies.svelte}</span>
            <span class="package">Svelte Kit - {pkgJSON.devDependencies["@sveltejs/kit"]}</span>
            <span class="package">Svelte Node Adapter - {pkgJSON.devDependencies["@sveltejs/adapter-node"]}</span>
            <span class="package">Vite - {pkgJSON.devDependencies.vite}</span>
            <span class="package">Typescript - {pkgJSON.devDependencies.typescript}</span>
            <span class="package">Mongoose - {pkgJSON.dependencies.mongoose}</span>
            <span class="package">Sass - {pkgJSON.dependencies.sass}</span>
            <span class="package">Sharp - {pkgJSON.dependencies.sharp}</span>
        </ul>
    </div>
</div>
{/if}

<style lang="scss">
    button {
            background: none;
            background-color: transparent;
            border: none;
    }
    
        button {
            background: none;
            background-color: transparent;
            border: none;
        }

        .container {
            display: flex;
            flex-direction: column;
            padding: 2rem;
            background-color: aliceblue;
            color: black;
            border-radius: 1rem;

            .heading {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            ul {
                display: flex;
                flex-direction: column;
                .package {
                    font-size: small;
                }
            }
        }
</style>