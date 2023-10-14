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

<div on:click={toggleState}>
    <Icon src={Information} />
</div>

{#if isOpen}
<div class="overlay">  
    <div class="container">
        <div class="heading">
            <h1>Information</h1>
            <div on:click={toggleState}>
                <Icon src={Close} size="2em" color="white"/>
            </div>
        </div>
        <span>Authored by Thomas Zhou (26')</span>
        <span>Co-Authored by Ethan Wu (26')</span>

        <br>

        <span>Build #{PUBLIC_BUILD_NUMBER}</span>

        <br>
    
        <span>Dependencies: </span>
        <ul>
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
    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.65);
        z-index: 9999;
        height: 100vh;
        width: 100vw;
        display: flex;
        align-items: center;
        justify-content: center;

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
    }
</style>