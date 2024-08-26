<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang="ts">
    import { goto } from "$app/navigation";
    import { tags } from "@/lib/tags";
    import { onMount } from "svelte";
    import MultiSelect from "svelte-multiselect";
    import { RingLoader } from "svelte-loading-spinners"
    import { CheckmarkFilled, ErrorFilled } from "carbon-icons-svelte";

    const tagOptions = Array.from(tags.entries()).map(([k, v]) => ({ id: k, label: v, value: v }))

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

        const res = await fetch(`/manage-projects/${data.project._id}/edit`, {
            method: "POST",
            body: JSON.stringify({ project })
        })

        if(res.ok) status = EditStatus.SUCCESS;
        else status = EditStatus.ERROR;
    }

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
</script>

<main class="flex items-center justify-center h-full w-full">
    <div class="flex flex-col items-center gap-12 p-12 rounded-lg bg-gray-300">
        <h1 class="text-2xl">Edit Project Details</h1>

        <div class="flex items-center gap-12">
            <div class="flex flex-col items-start gap-4">
                <div class="flex gap-2 items-start flex-col">
                    <h2 class="text-lg">Title</h2>
                    <span contenteditable="plaintext-only" class="text-base rounded-md bg-gray-200 p-2 border-gray-400 border" bind:innerHTML={project.title}>{data.project.title}</span>
                </div>

                <div class="flex gap-2 items-start flex-col">
                    <h2 class="text-lg">Tags</h2>
                    <MultiSelect
                        options={tagOptions}
                        maxSelect={3}
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
                    <span contenteditable="plaintext-only" class="text-base rounded-md bg-gray-200 p-2 border-gray-400 border max-w-[32rem]" bind:innerHTML={project.shortDesc}>{data.project.shortDesc}</span>
                </div>
            </div>
            <div class="flex flex-col items-start gap-4 p-8">
                <h2 class="text-lg">Mentor</h2>
                <div class="flex flex-col items-start gap-2 rounded-lg p-4 bg-gray-200">
                    <span>{data.mentor.name}</span>
                    <span>{data.mentor.organization}</span>
                </div>
            </div>
        </div>
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
</main>
