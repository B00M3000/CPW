
<script lang=js>
    // @ts-nocheck
    import MentorCard from "@/client/components/MentorCard.svelte";
    import SmartProjectImage from "@/client/components/SmartProjectImage.svelte";
    import StudentCard from "@/client/components/StudentCard.svelte";
    import Tags from "@/client/components/Tags.svelte";
    import { Return, Maximize, CloseLarge } from "carbon-icons-svelte";

    let { data } = $props();

    let doubleSpacing = $state(false);
    let report = $derived(doubleSpacing ? data.project?.fullReport.trim() : data.project?.fullReport.replaceAll('\n', '\n\n').trim());

    let enlargedImageView = $state(false);

    function backgroundClick(event) {
        if(event.target.id == 'enlarged-image-view') enlargedImageView = false;
    }
</script>

{#if enlargedImageView}
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div id="enlarged-image-view" class="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-[#00000044] z-40" onclick={backgroundClick}>
    <div class="bg-gray-300 rounded-xl grid grid-rows-[auto_minmax(0,_1fr)] max-w-[85%] max-h-[85%] min-w-[55%] min-h-[55%]">
        <div class="p-8 py-4 text-xl bg-gray-400 shadow-md rounded-t-xl flex justify-between items-center">
            <span>Gallery</span>
            <button class="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md flex items-center gap-2" onclick={() => enlargedImageView = false}>
                <CloseLarge />
                <span class="text-sm">Close</span>
            </button>
        </div>
        <div class="overflow-y-auto w-full h-full">
            <div class="grid grid-cols-2 xl:grid-cols-3 px-4">
                {#each data.images as image}
                <div class="">
                    <SmartProjectImage {image} showProjectPageButton={false} />
                </div>
                {:else}
                <div class="flex items-center justify-center col-span-full my-4">
                    <span class="text-xl">No images.</span>
                </div>
                {/each}
            </div>
        </div>
    </div>
</div>
{/if}

<main class="flex flex-col items-center w-full h-full">
    <div class="layout gap-4 p-4">
        <!-- Details -->
        <div class="details p-4 flex flex-col justify-center bg-[rgb(205,209,214)] rounded-xl w-full">
            <h1 class="text-xl mb-3">{data.project?.title}</h1>
            <div class="inline-flex items-center gap-2 mb-2">
                <span class='font-bold'>Student: </span>
                <StudentCard student={data.student} />
            </div>
            <div class="inline-flex items-center gap-2 mb-2">
                <span class='font-bold'>Mentor: </span>
                <MentorCard mentor={data.mentor} />
            </div>
            <div class="flex flex-col items-start mb-2">
                <h3 class="font-bold my-1">Tags: </h3>
                <Tags tagIds={data.project.tags} />
            </div>
            <h3 class="font-bold">Description: </h3>
            <span class=" max-w-[32rem] overflow-clip text-ellipsis">{data.project?.shortDesc}</span>
        </div>
        <!-- Report -->
        <div class="report w-full h-full relative">
            <div class="overflow-y-auto w-full h-full">
                <div class="w-[8.5in] min-h-full bg-white whitespace-pre-wrap break-words p-[1in]" class:justify-center={!report} >
                    <div class="flex flex-col">
                        {#if report}
                        <h4 class="text-2xl text-center mb-4">{data.project.title}</h4>
                        <h5 class="text-lg text-center mb-8">{data.student?.name}</h5>
                        <p class="text-base">{@html report}</p>
                        {:else}
                        <div class="flex flex-col items-center justify-center gap-16">
                            <span class="text-4xl w-full text-center">No report has been uploaded for this project.</span>
                            <span class="text-7xl w-full text-center">¯\_(ツ)_/¯</span>
                        </div>
                        {/if}
                    </div>
                </div>
            </div>
            <div class="fadeout"></div>
        </div>
        <!-- Images -->
        <div class="images bg-gray-300 rounded-xl grid grid-rows-[auto_minmax(0,_1fr)] relative">
            <div class="p-8 py-4 text-xl bg-gray-400 shadow-md rounded-t-xl flex justify-between items-center">
                <span>Gallery</span>
                <button class="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md flex items-center gap-2" onclick={() => enlargedImageView = true}>
                    <Maximize />
                    <span class="text-sm">Enlarge</span>
                </button>
            </div>
            <div class="overflow-y-auto w-full h-full max-w-[36rem] 2xl:max-w-[42rem]">
                <div class="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 px-4">
                    {#each data.images as image}
                    <div class="">
                        <SmartProjectImage {image} showProjectPageButton={false} />
                    </div>
                    {:else}
                    <div class="flex items-center justify-center col-span-full my-4">
                        <span class="text-xl">No images.</span>
                    </div>
                    {/each}
                </div>
            </div>
            {#if enlargedImageView}
            <div class="rounded-xl absolute z-20 bg-[repeating-linear-gradient(45deg,black,black_10px,#FFF_20px,#000_40px)] opacity-20 w-full h-full"></div>
            {/if}
        </div>
        <!-- Toolbar -->
        <div class="toolbar bg-[rgb(205,209,214)] p-4 rounded-xl flex flex-wrap justify-between gap-2 ">
            <button class="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md flex items-center gap-2 px-4" onclick={() => history.back()}>
                <Return size={20}/>
                <span class="text-base">Return</span>
            </button>
            <button class="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-md flex items-center gap-2 px-4" onclick={() => doubleSpacing = !doubleSpacing}>
                <span class="text-base font-bold">x2</span>
                <span class="text-sm">Double Report Newlines</span>
            </button>
        </div>
    </div>
</main>

<style>
    .layout {
        height: 100%;

        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        grid-template-rows: auto auto minmax(0, 1fr);
        grid-template-areas: "toolbar report" "details report" "images report";
    }
    .details { grid-area: details; }
    .report { grid-area: report; }
    .images { grid-area: images; }
    .toolbar { grid-area: toolbar; }

    .fadeout {
        position: absolute;
        bottom: 0;

        z-index: 100;

        width: 100%;
        height: 1in;

        background: linear-gradient(180deg, rgb(99.608% 99.608% 99.608% / 0) 0%, rgb(99.609% 99.609% 99.609% / 0.00390625) 6.25%, rgb(99.614% 99.614% 99.614% / 0.015625) 12.5%, rgb(99.622% 99.622% 99.622% / 0.03515625) 18.75%, rgb(99.632% 99.632% 99.632% / 0.0625) 25%, rgb(99.646% 99.646% 99.646% / 0.09765625) 31.25%, rgb(99.663% 99.663% 99.663% / 0.140625) 37.5%, rgb(99.683% 99.683% 99.683% / 0.19140625) 43.75%, rgb(99.706% 99.706% 99.706% / 0.25) 50%, rgb(99.732% 99.732% 99.732% / 0.31640625) 56.25%, rgb(99.761% 99.761% 99.761% / 0.390625) 62.5%, rgb(99.793% 99.793% 99.793% / 0.47265625) 68.75%, rgb(99.828% 99.828% 99.828% / 0.5625) 75%, rgb(99.867% 99.867% 99.867% / 0.66015625) 81.25%, rgb(99.908% 99.908% 99.908% / 0.765625) 87.5%, rgb(99.953% 99.953% 99.953% / 0.87890625) 93.75%, rgb(100% 100% 100%) 100% );
    }
</style>
