<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang=ts>
    import { tags as tagMap } from "@/lib/tags";
    import MultiSelect from "svelte-multiselect";
    import { Circle3 } from "svelte-loading-spinners";
    import { Save, CircleCheckBig, CircleX, ArrowLeft, BookOpen } from "lucide-svelte";
    import toast from "svelte-french-toast";

    const TAG_OPTIONS = Array.from(tagMap.entries()).map(([k, v]) => ({ id: k, label: v, value: v }));

    let { data }: { data: { inflatedProject: any; projectId: string } } = $props();

    let project = $state({ ...data.inflatedProject });

    let selectedTags = $state(
        (project.tags as string[]).map(id => TAG_OPTIONS.find(o => o.id === id)).filter(Boolean) as typeof TAG_OPTIONS
    );

    let editingReport = $state(false);
    let editedFullReport = $state(project.fullReport ?? "");

    enum SaveStatus { Idle, Saving, Success, Error }
    let detailsStatus = $state(SaveStatus.Idle);
    let reportStatus = $state(SaveStatus.Idle);

    async function saveDetails() {
        detailsStatus = SaveStatus.Saving;
        const res = await fetch(`/admin/project-catalog/${project._id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                Action: "UPDATE",
                title: project.title,
                tags: selectedTags.map((t: any) => t.id),
                shortDesc: project.shortDesc,
            }),
        });
        if (res.ok) {
            detailsStatus = SaveStatus.Success;
            toast.success("Project details saved!");
            setTimeout(() => detailsStatus = SaveStatus.Idle, 3000);
        } else {
            detailsStatus = SaveStatus.Error;
            toast.error("Failed to save project details.");
        }
    }

    async function saveReport() {
        reportStatus = SaveStatus.Saving;
        const res = await fetch(`/admin/project-catalog/${project._id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                Action: "SAVE",
                fullReport: editedFullReport,
            }),
        });
        if (res.ok) {
            project.fullReport = editedFullReport;
            reportStatus = SaveStatus.Success;
            editingReport = false;
            toast.success("Full report saved!");
            setTimeout(() => reportStatus = SaveStatus.Idle, 3000);
        } else {
            reportStatus = SaveStatus.Error;
            toast.error("Failed to save full report.");
        }
    }

    async function changePublish() {
        const newPublish = !project.publish;
        const res = await fetch(`/admin/project-catalog/${project._id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Action: "PUBLISH", publish: newPublish }),
        });
        if (res.ok) {
            project.publish = newPublish;
            toast.success(newPublish ? "Project published!" : "Project unpublished.");
        } else {
            toast.error("Failed to update publish status.");
        }
    }
</script>

<main class="w-full h-full p-4 overflow-y-auto">
    <div class="relative w-full rounded-xl p-8 flex flex-col gap-6">
        <a class="absolute top-0 left-0 bg-blue-500 hover:bg-blue-600 p-2 px-3 m-8 rounded-lg flex gap-2 items-center text-white" href="/admin/project-catalog">
            <ArrowLeft size={18} />
            <span>Back to Project Catalog</span>
        </a>

        <h1 class="text-3xl font-bold text-center mt-10">{project.title}</h1>

        <!-- Meta info -->
        <div class="grid grid-cols-2 gap-4 bg-gray-100 rounded-xl p-6 border border-gray-300">
            <div>
                <span class="text-sm text-gray-500 font-semibold uppercase">Student</span>
                <p class="text-base">{project.student?.name} — <span class="text-gray-600">{project.student?.email}</span></p>
            </div>
            <div>
                <span class="text-sm text-gray-500 font-semibold uppercase">Mentor</span>
                <p class="text-base">{project.mentor?.name} — <span class="text-gray-600">{project.mentor?.email}</span>{#if project.mentor?.phoneNumber}, <span class="text-gray-600">{project.mentor.phoneNumber}</span>{/if}</p>
            </div>
            <div>
                <span class="text-sm text-gray-500 font-semibold uppercase">Year</span>
                <p class="text-base">{project.year}</p>
            </div>
            <div>
                <span class="text-sm text-gray-500 font-semibold uppercase">Status</span>
                <p class="text-base">
                    {#if project.publish}
                    <span class="text-green-700 font-semibold">Published</span>
                    {:else if project.underReview}
                    <span class="text-yellow-600 font-semibold">Under Review</span>
                    {:else}
                    <span class="text-gray-500">Unpublished</span>
                    {/if}
                </p>
            </div>
            <div>
                <span class="text-sm text-gray-500 font-semibold uppercase">Created</span>
                <p class="text-base">{new Date(project.createdAt).toLocaleString()}</p>
            </div>
            <div>
                <span class="text-sm text-gray-500 font-semibold uppercase">Last Modified</span>
                <p class="text-base">{new Date(project.updatedAt).toLocaleString()}</p>
            </div>
        </div>

        <!-- Publish toggle -->
        <div class="flex gap-3">
            {#if project.publish}
            <button class="bg-red-500 hover:bg-red-600 text-white rounded-lg p-2 px-4" onclick={changePublish}>Unpublish Project</button>
            {:else if !project.underReview}
            <button class="bg-green-600 hover:bg-green-700 text-white rounded-lg p-2 px-4" onclick={changePublish}>Publish Project</button>
            {/if}
        </div>

        <!-- Editable project details -->
        <div class="bg-gray-100 rounded-xl p-6 border border-gray-300 flex flex-col gap-4">
            <h2 class="text-xl font-semibold">Project Details</h2>

            <div class="flex flex-col gap-1">
                <span class="text-sm text-gray-600 font-medium">Title</span>
                <span
                    contenteditable="plaintext-only"
                    class="text-base rounded-md bg-white p-2 border border-gray-400 min-w-72 max-w-[40rem]"
                    bind:textContent={project.title}
                >{project.title}</span>
            </div>

            <div class="flex flex-col gap-1">
                <span class="text-sm text-gray-600 font-medium">Tags</span>
                <MultiSelect
                    options={TAG_OPTIONS}
                    bind:selected={selectedTags}
                    outerDivClass="flex gap-2 items-center my-0 bg-white p-2 rounded-md border-gray-400 border max-w-[40rem]"
                >
                    <span slot="selected" let:option class="max-w-72 text-ellipsis overflow-x-clip text-base">{option.label}</span>
                </MultiSelect>
            </div>

            <div class="flex flex-col gap-1">
                <span class="text-sm text-gray-600 font-medium">Short Description</span>
                <span
                    contenteditable="plaintext-only"
                    class="text-base rounded-md bg-white p-2 border border-gray-400 min-w-72 max-w-[40rem]"
                    bind:textContent={project.shortDesc}
                >{project.shortDesc}</span>
            </div>

            <div class="flex items-center gap-3">
                <button
                    class="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-md p-2 px-4"
                    onclick={saveDetails}
                    disabled={detailsStatus === SaveStatus.Saving}
                >
                    {#if detailsStatus === SaveStatus.Saving}
                    <Circle3 size={20} />
                    {:else}
                    <Save size={18} />
                    {/if}
                    <span>Save Details</span>
                </button>
                {#if detailsStatus === SaveStatus.Success}
                <CircleCheckBig size={22} color="#383" />
                {:else if detailsStatus === SaveStatus.Error}
                <CircleX size={22} color="red" />
                {/if}
            </div>
        </div>

        <!-- Full report editor -->
        <div class="bg-gray-100 rounded-xl p-6 border border-gray-300 flex flex-col gap-4">
            <h2 class="text-xl font-semibold flex items-center gap-2"><BookOpen size={22} /> Full Report</h2>
            {#if editingReport}
            <textarea
                class="w-full h-96 font-mono text-base border border-gray-400 rounded-md p-2"
                bind:value={editedFullReport}
            ></textarea>
            <div class="flex items-center gap-3">
                <button
                    class="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-md p-2 px-4"
                    onclick={saveReport}
                    disabled={reportStatus === SaveStatus.Saving}
                >
                    {#if reportStatus === SaveStatus.Saving}
                    <Circle3 size={20} />
                    {:else}
                    <Save size={18} />
                    {/if}
                    <span>Save Report</span>
                </button>
                <button class="bg-gray-400 hover:bg-gray-500 text-white rounded-md p-2 px-4" onclick={() => { editingReport = false; editedFullReport = project.fullReport ?? ""; }}>Cancel</button>
                {#if reportStatus === SaveStatus.Error}
                <CircleX size={22} color="red" />
                {/if}
            </div>
            {:else}
            <div class="max-h-96 overflow-y-auto border border-gray-300 rounded-md p-4 bg-white whitespace-pre-wrap text-base">
                {#if editedFullReport}{editedFullReport}{:else}<em class="text-gray-400">No full report yet.</em>{/if}
            </div>
            <button
                class="flex items-center gap-2 self-start bg-green-600 hover:bg-green-700 text-white rounded-md p-2 px-4"
                onclick={() => editingReport = true}
            >
                <Save size={18} />
                <span>Edit Full Report</span>
            </button>
            {/if}
        </div>
    </div>
</main>
