<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang=ts>
    import { goto } from "$app/navigation";
    import Gallery from "@/client/components/Gallery.svelte";
    import { user } from "@/client/stores/user";
    import { AccountType } from "@/lib/enums";
    import Pagination from "@/client/components/Pagination.svelte";
    import Loading2 from "@/client/components/Loading2.svelte";
    import SmartProjectImage from "@/client/components/SmartProjectImage.svelte";

    let { data } = $props();

    let images: any = [], page: number = 0, items: number = 10, totalImageCount: number = 0;
    $effect(() => {
        images = data.images;
        page = data.searchParameters.page;
        items = data.searchParameters.items;
        totalImageCount = data.totalImageCount;
    });
    images = data.images;
    page = data.searchParameters.page;
    items = data.searchParameters.items;
    totalImageCount = data.totalImageCount;

    async function search(){
        const searchParams = new URLSearchParams();

        if(items) searchParams.set("itemsPerPage", items.toString())
        if(page) searchParams.set("page", page.toString())

        spinnerActive = true;

        await goto(`/images?${searchParams}`);

        // scrollElement?.scrollTo(0, 0); TODO: fix later

        spinnerActive = false;
    }

    let spinnerActive = $state(false);

    async function gotoManageImages() {
        await goto("/manage-images");
    }
</script>

{#if spinnerActive}
<Loading2 />
{/if}

<main class="h-full">
    {#if $user.accountType == AccountType.Student}
    <div id="upload-images-button-container" class="p-4 sm:px-16 lg:px-36">
        <button onclick={gotoManageImages}>Upload Images</button>
        <button onclick={gotoManageImages}>Manage Your Images</button>
    </div>
    {/if}
    <div class="h-full overflow-y-auto flex justify-center w-full">
        <div class="flex flex-wrap items-center justify-center gap-4">
            {#each images as image}
            <div class="w-[300px] h-[225px]">
                <SmartProjectImage {image} showProjectPageButton={true} />
            </div>
            {/each}
        </div>
    </div>
    <!-- <Gallery {images} projectPage={false} /> -->
    <div class="flex justify-center w-full bg-gray-300">
        <div class="flex justify-center p-2 sm:p-4 w-full lg:w-2/3 2xl:w-1/2">
            <Pagination 
                pluralItemName="images" 
                bind:itemsPerPage={items} 
                bind:currentPage={page}
                maxItems={totalImageCount}
                onchange={search}
            />
        </div>
    </div>
</main>

<style lang='scss'>
    main {
        display: flex;
        flex-direction: column;
        justify-content: center;

        height: calc(100vh - var(--nav-bar-height));
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

        button:hover{
            background-color: #7fa8f1;
        }
    }
</style>



