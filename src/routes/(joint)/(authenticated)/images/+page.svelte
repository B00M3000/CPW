<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang="ts">
    import { goto, invalidateAll } from "$app/navigation";
    import { user } from "@/client/stores/user";
    import { AccountType } from "@/lib/enums";
    import Pagination from "@/client/components/Pagination.svelte";
    import Loading2 from "@/client/components/Loading2.svelte";
    import SmartProjectImage from "@/client/components/SmartProjectImage.svelte";

    let { data } = $props();

    type ImageMode = "recent" | "random";

    let images: any = $state([]),
        page: number = $state(0),
        items: number = $state(10),
        totalImageCount: number = $state(0);
    let mode: ImageMode = $state("recent");
    $effect(() => {
        images = data.images;
        page = data.page;
        items = data.items;
        totalImageCount = data.totalImageCount;
        mode = data.mode || "recent";
    });

    async function search(page: number, items: number) {
        if (mode !== "recent") return;

        const searchParams = new URLSearchParams();

        searchParams.set("mode", mode);
        if (items) searchParams.set("items", items.toString());
        if (page) searchParams.set("page", page.toString());

        spinnerActive = true;

        await goto(`/images?${searchParams}`);
        scrollElement?.scrollTo(0, 0);

        spinnerActive = false;
    }

    async function setMode(nextMode: ImageMode) {
        if (nextMode === mode) return;

        const searchParams = new URLSearchParams();
        searchParams.set("mode", nextMode);
        if (nextMode === "recent") {
            searchParams.set("items", items.toString());
            if (page) searchParams.set("page", page.toString());
        }

        spinnerActive = true;

        await goto(`/images?${searchParams}`);
        scrollElement?.scrollTo(0, 0);

        spinnerActive = false;
    }

    async function refreshRandom() {
        if (mode !== "random") return;

        spinnerActive = true;
        await invalidateAll();
        scrollElement?.scrollTo(0, 0);
        spinnerActive = false;
    }

    let spinnerActive = $state(false);

    async function gotoManageImages() {
        await goto("/manage-images");
    }

    export const snapshot = {
        capture: () => ({
            items,
        }),
        restore: (snapshot) => {
            items = snapshot.items;
        },
    };

    let scrollElement: HTMLDivElement;
</script>

{#if spinnerActive}
    <Loading2 />
{/if}

<main class="relative h-full flex items-center flex-col bg-gray-300">
    {#if $user.accountType == AccountType.Student}
        <div
            id="upload-images-button-container"
            class="w-full p-4 sm:px-16 lg:px-36"
        >
            <button onclick={gotoManageImages}>Upload Images</button>
            <button onclick={gotoManageImages}>Manage Your Images</button>
        </div>
    {/if}

    <div id="images-mode-container" class="w-full p-4 sm:px-16 lg:px-36">
        <div class="mode-buttons" role="group" aria-label="Image display mode">
            <button
                class:active={mode === "recent"}
                onclick={() => setMode("recent")}>Last Uploaded</button
            >
            <button
                class:active={mode === "random"}
                onclick={() => setMode("random")}>Random</button
            >
        </div>
        {#if mode === "random"}
            <button class="refresh-random" onclick={refreshRandom}
                >Refresh Random</button
            >
        {/if}
    </div>

    <div class="h-full overflow-y-auto w-full" bind:this={scrollElement}>
        <div
            class="flex flex-wrap items-center justify-center gap-4 h-auto mb-24"
        >
            {#each images as image}
                <div class="w-[300px] h-[225px] 2xl:w-[400px] 2xl:h-[335px]">
                    <SmartProjectImage {image} showProjectPageButton={true} />
                </div>
            {:else}
                <div class="flex items-center justify-center">
                    <span>No images.</span>
                </div>
            {/each}
        </div>
    </div>
    {#if mode === "recent"}
        <div
            class="absolute bottom-0 left-1/2 -translate-x-1/2 w-full p-2 px-8 max-w-5xl z-20"
        >
            <Pagination
                pluralItemName="images"
                itemsPerPage={items}
                currentPage={page}
                maxItems={totalImageCount}
                onchange={search}
            />
        </div>
    {/if}
</main>

<style lang="scss">
    main {
        display: flex;
        flex-direction: column;
        justify-content: center;

        height: 100%;
    }

    #images-mode-container {
        background-color: rgb(191, 189, 189);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;

        .mode-buttons {
            display: grid;
            grid-template-columns: 1fr 1fr;
            width: min(500px, 95%);
            gap: 0.25rem;
            background: #d9d9d9;
            border-radius: 4px;
            padding: 0.25rem;
        }

        button {
            cursor: pointer;
            border: none;
            border-radius: 4px;
            padding: 0.5rem 0.75rem;
            background-color: #efefef;
            color: #121212;
        }

        button.active {
            background-color: #1d4ed8;
            color: #fff;
        }

        button:hover {
            background-color: #d1d5db;
        }

        button.active:hover {
            background-color: #2563eb;
        }

        .refresh-random {
            width: auto;
            background-color: #1f7a8c;
            color: #fff;
        }

        .refresh-random:hover {
            background-color: #2b94a9;
        }
    }

    #upload-images-button-container {
        background-color: rgb(191, 189, 189);
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        gap: 0.5rem;

        button {
            cursor: pointer;

            background-color: #478aff;
            color: #fff;
            border: none;
            border-radius: 2px;
            padding: 0.25rem;
            width: 98%;
            margin: 1px;
        }

        button:hover {
            background-color: #7fa8f1;
        }
    }
</style>
