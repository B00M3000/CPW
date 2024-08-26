<script lang=ts>
    import MentorCard from "@/client/components/MentorCard.svelte";
    import SmartProjectImage from "@/client/components/SmartProjectImage.svelte";
    import StudentCard from "@/client/components/StudentCard.svelte";
    import Tags from "@/client/components/Tags.svelte";
    import { Return } from "carbon-icons-svelte";
    import toast from "svelte-french-toast";

    let { data } = $props();

    let doubleSpacing = $state(false);
    let report = $derived(!doubleSpacing ? data.project?.fullReport.trim() : data.project?.fullReport.replaceAll('\n', '\n\n').trim());

    enum Views { FullReport, Images };

    let view = $state(Views.FullReport);

    $effect(() => {
        if(doubleSpacing) toast.success('Double Spacing Enabled');
        else toast.error('Double Spacing Disabled');
    })
</script>

<main class="flex flex-col items-center w-full">
    <div class="flex flex-col items-center w-full">
        <!-- Toolbar 1 -->
        <div class="p-4 pb-0 w-full">
            <div class="toolbar bg-[rgb(205,209,214)] p-3 rounded-xl flex flex-wrap justify-between gap-2 w-full">
                <button class="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md flex items-center gap-2 px-4" onclick={() => history.back()}>
                    <Return size={20}/>
                    <span class="text-base">Return</span>
                </button>
            </div>
        </div>
        <!-- Details -->
        <div class="p-4 w-full">
            <div class="p-6 flex flex-col justify-center bg-[rgb(205,209,214)] rounded-xl text-lg sm:text-xl font-bold shadow-lg border border-gray-400">
                <h1 class="text-3xl sm:text-4xl mb-3 sm:mb-6 font-normal">{data.project?.title}</h1>
                <div class="inline-flex items-center gap-2 mb-2 sm:mb-4">
                    <span class="">Student: </span>
                    <StudentCard student={data.student} />
                </div>
                <div class="inline-flex items-center gap-2 mb-2 sm:mb-4">
                    <span class="">Mentor: </span>
                    <MentorCard mentor={data.mentor} />
                </div>
                <div class="flex flex-col items-start mb-2 sm:mb-4">
                    <h3 class="mb-2">Tags: </h3>
                    <Tags additionalClasses="font-normal !text-lg px-2" tagIds={data.project.tags} />
                </div>
                <h3 class="mb-1">Description: </h3>
                <span class="max-w-[48rem] overflow-clip break-all text-wrap font-normal">{data.project?.shortDesc}</span>
            </div>
        </div>
        <!-- Report and Images Tabs -->
        <div class="px-4 w-full">
            <div class="bg-gray-200 border border-gray-400 rounded-xl grid grid-cols-2 px-2 w-full shadow-lg">
                <button class="rounded-lg my-2 p-3 px-4 {view == Views.FullReport ? "bg-gray-300" : ""}" onclick = {() => view = Views.FullReport}>View Full Report</button>
                <button class="rounded-lg my-2 p-3 px-4 {view == Views.Images ? "bg-gray-300" : ""}" onclick = {() => view = Views.Images}>View Images</button>
            </div>
        </div>
        {#if view == Views.FullReport}
        <!-- Report -->
        <div class='p-4'>
            <!-- Toolbar 2 -->
            <div class="toolbar bg-[rgb(205,209,214)] p-3 rounded-xl flex flex-wrap justify-between gap-2 w-full mb-4">
                <button class="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-md flex items-center gap-2 px-4" onclick={() => doubleSpacing = !doubleSpacing}>
                    <span class="text-base font-bold">x2</span>
                    <span class="text-sm">Toggle Double Report Newlines</span>
                </button>
            </div>
            <div class="w-full relative">
                <div class="overflow-y-scroll w-full max-h-[65vh] sm:max-h-[80vh] flex justify-center bg-gray-50">
                    <div class="whitespace-pre-wrap break-words p-4 py-8 sm:p-[1in] flex flex-col" class:justify-center={!report} >
                        {#if report}
                        <h4 class="text-xl sm:text-2xl text-center mb-2 sm:mb-4">{data.project.title}</h4>
                        <h5 class="text-base sm:text-lg text-center mb-4 sm:mb-8">{data.student?.name}</h5>
                        <p class="text-sm sm:text-base md:text-lg">{@html report}</p>
                        <div class="w-full h-4"></div>
                        {:else}
                        <div class="flex flex-col items-center justify-center gap-16">
                            <span class="text-4xl w-full text-center">No report has been uploaded for this project.</span>
                            <span class="text-7xl w-full text-center">¯\_(ツ)_/¯</span>
                        </div>
                        {/if}
                    </div>
                </div>
                <div class="fadeout"></div>
            </div>
        </div>
        {:else if view == Views.Images}
        <!-- Images -->
        <div class='p-4 w-full'>
            <div class="images bg-gray-300 rounded-xl grid grid-rows-[auto_minmax(0,_1fr)] w-full">
                <div class="p-8 py-4 text-xl bg-gray-400 shadow-md rounded-t-xl flex justify-between items-center">
                    <span>Gallery</span>
                </div>
                <div class="overflow-y-auto max-h-[65vh] w-full h-full">
                    <div class="flex flex-col px-4">
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
    </div>
</main>

<style>
    .fadeout {
        position: absolute;
        bottom: 0;

        z-index: 100;

        width: 100%;
        height: 4rem;

        background: linear-gradient(180deg, rgb(99.608% 99.608% 99.608% / 0) 0%, rgb(99.609% 99.609% 99.609% / 0.00390625) 6.25%, rgb(99.614% 99.614% 99.614% / 0.015625) 12.5%, rgb(99.622% 99.622% 99.622% / 0.03515625) 18.75%, rgb(99.632% 99.632% 99.632% / 0.0625) 25%, rgb(99.646% 99.646% 99.646% / 0.09765625) 31.25%, rgb(99.663% 99.663% 99.663% / 0.140625) 37.5%, rgb(99.683% 99.683% 99.683% / 0.19140625) 43.75%, rgb(99.706% 99.706% 99.706% / 0.25) 50%, rgb(99.732% 99.732% 99.732% / 0.31640625) 56.25%, rgb(99.761% 99.761% 99.761% / 0.390625) 62.5%, rgb(99.793% 99.793% 99.793% / 0.47265625) 68.75%, rgb(99.828% 99.828% 99.828% / 0.5625) 75%, rgb(99.867% 99.867% 99.867% / 0.66015625) 81.25%, rgb(99.908% 99.908% 99.908% / 0.765625) 87.5%, rgb(99.953% 99.953% 99.953% / 0.87890625) 93.75%, rgb(100% 100% 100%) 100% );
    }
</style>
