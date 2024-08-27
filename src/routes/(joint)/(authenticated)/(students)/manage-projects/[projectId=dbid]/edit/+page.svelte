<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang="ts">
    import { tags } from "@/lib/tags";
    import { onMount } from "svelte";
    import MultiSelect from "svelte-multiselect";
    import { RingLoader } from "svelte-loading-spinners"
    import { CheckmarkFilled, ErrorFilled } from "carbon-icons-svelte";
    import toast from "svelte-french-toast";

    const TAG_OPTIONS = Array.from(tags.entries()).map(([k, v]) => ({ id: k, label: v, value: v }))

    interface ProjectInformation {
        _id: string;
        title: string;
        tags: string[];
        shortDesc: string;
    }

    interface MentorInformation {
        _id: string;
        name: string;
        organization: string;
    }

    let { data }: {
        data: {
            project: ProjectInformation,
            mentor: MentorInformation,
        }
    } = $props();

    enum EditStatus {
        UNSAVED,
        UPLOADING,
        SUCCESS,
        ERROR
    }

    let status: EditStatus = $state(EditStatus.UNSAVED);

    async function upload() {
        status = EditStatus.UPLOADING;

        if(!(project.title.length < 100 && project?.title?.length > 12)) {
            status = EditStatus.ERROR;
            return errorMessage = "Please enter a project name between 12 and 200 characters.";
        }
        if(!(project.tags.length >= 1 && project.tags.length <= 7)) {
            status = EditStatus.ERROR;
            return errorMessage = "Please select between 1 and 7 tags.";
        }
        if(!(project.shortDesc.length > 100)) {
            status = EditStatus.ERROR;
            return errorMessage = "Please enter a short description with at least 100 characters to start. You can always edit it later.";
        }

        const res = await fetch(`/manage-projects/${data.project._id}/edit`, {
            method: "POST",
            body: JSON.stringify({ project })
        })

        if(res.ok) status = EditStatus.SUCCESS;
        else status = EditStatus.ERROR;
    }

    $effect(() => {
        if(errorMessage) toast.error(errorMessage);
    })

    onMount(() => {
        selected = data.project.tags.map((tagId: string) => tagOptions.find(option => option.id === tagId));
    })

    $effect(() => {
        project.tags = selected.map((option: any) => option.id);
    })

    let selected: any = $state([]);

    interface ProjectInformation2 {
        title?: string;
        tags?: string[];
        shortDesc?: string;
    }

    let project: ProjectInformation2 = {};

    let errorMessage = $state()
</script>

<main class="flex items-center justify-center h-full w-full">
    <div class="flex flex-col items-center gap-12 p-12 rounded-lg bg-gray-300">
        <h1 class="text-2xl">Edit Project Details</h1>

        <div class="flex items-center gap-12">
            <div class="flex flex-col items-start gap-4">
                <div class="flex gap-2 items-start flex-col">
                    <h2 class="text-lg">Title</h2>
                    <span contenteditable="plaintext-only" class="text-base rounded-md bg-gray-50 p-2 border-gray-400 max-w-[30rem] border min-w-72" bind:innerHTML={project.title}>{data.project.title}</span>
                </div>

                <div class="flex gap-2 items-start flex-col">
                    <h2 class="text-lg">Tags</h2>
                    <MultiSelect
                        options={TAG_OPTIONS}
                        maxSelect={5}
                        placeholder="Search tags.."
                        liSelectedClass="flex gap-2 items-center"
                        outerDivClass="flex gap-2 items-center my-0 bg-gray-50 p-2 rounded-md border-gray-400 border max-w-[30rem]"
                        bind:selected
                    >
                        <span slot="selected" let:option class="max-w-72 text-ellipsis overflow-x-clip text-base">{option.label}</span>
                    </MultiSelect>
                </div>

                <div class="flex gap-2 items-start flex-col">
                    <h2 class="text-lg">Short Description</h2>
                    <span contenteditable="plaintext-only" class="text-base rounded-md bg-gray-50 p-2 border-gray-400 border min-w-72 max-w-[32rem]" bind:innerHTML={project.shortDesc}>{data.project.shortDesc}</span>
                </div>
            </div>
            <div class="flex flex-col items-start gap-2 p-8">
                <h2 class="text-lg">Mentor</h2>
                <div class="flex flex-col items-start bg-gray-200 rounded-xl p-4 min-w-[20rem]">
                    <span class="text-lg font-bold">{data.mentor.name}</span>
                    <span class="text-base text-gray-600">{data.mentor.email}</span>
                    <span class="text-base text-gray-600 mb-1">{data.mentor.phoneNumber}</span>
                    <span class="text-base">{data.mentor.organization}</span>
                </div>
                <span class="text-gray-600 max-w-[20rem] text-sm">Mentor information currently cannot be edited (in the future it will be). Please delete this project and create a new one if changes need to be made, integrity of contact information is important.</span>
            </div>
        </div>
        <div class="my-4 flex flex-col gap-4">
            <span class="text-red-600">{errorMessage}</span>
            <div class="flex items-center gap-8">
                <div class="flex items-center gap-3">
                    {#if status == EditStatus.UPLOADING}
                        <RingLoader color="blue" size={24} />
                    {:else if status == EditStatus.SUCCESS}
                        <CheckmarkFilled color="green" size={24} />
                    {:else if status == EditStatus.ERROR}
                        <ErrorFilled color="red" size={24} />
                    {/if}
                    <button class="p-3 px-5 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center" onclick={upload}>
                        <span>Save Changes</span>
                    </button>
                </div>
                <a class="p-3 px-5 bg-red-500 hover:bg-red-600 text-white rounded-md" href="/manage-projects" data-sveltekit-reload>Go Back</a>
            </div>
        </div>
    </div>
</main>
