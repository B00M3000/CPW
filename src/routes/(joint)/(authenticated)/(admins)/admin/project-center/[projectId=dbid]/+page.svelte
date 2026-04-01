<!--
 Admin project editor: edit title, tags, short description, full report, PDF,
 publish/unpublish, and delete (with typed confirmation).
-->

<script lang="ts">
    import { tags as tagMap } from "@/lib/tags";
    import MultiSelect from "svelte-multiselect";
    import { Circle3 } from "svelte-loading-spinners";
    import {
        Save,
        CircleCheckBig,
        CircleX,
        ArrowLeft,
        BookOpen,
        Trash2,
        FileText,
        ExternalLink,
    } from "lucide-svelte";
    import toast from "svelte-french-toast";
    import { MAX_PDF_SIZE_BYTES } from "@/lib/constants/upload";
    import { bytesToString } from "@/lib/utils";
    import { goto } from "$app/navigation";

    const TAG_OPTIONS = Array.from(tagMap.entries()).map(([k, v]) => ({
        id: k,
        label: v,
        value: v,
    }));

    let { data }: { data: { inflatedProject: any; projectId: string } } =
        $props();

    let project = $state({ ...data.inflatedProject });

    let selectedTags = $state(
        (project.tags as string[])
            .map((id) => TAG_OPTIONS.find((o) => o.id === id))
            .filter(Boolean) as typeof TAG_OPTIONS,
    );

    let editingReport = $state(false);
    let editedFullReport = $state(project.fullReport ?? "");

    // PDF state
    let pdfUrl = $state(project.pdfUrl ?? null);
    let selectedPdf: File | null = $state(null);
    let uploadingPdf = $state(false);
    let removingPdf = $state(false);

    // Delete confirmation
    let deleteConfirmText = $state("");
    let deleting = $state(false);
    const DELETE_PHRASE = "I wish to delete this project";

    enum SaveStatus {
        Idle,
        Saving,
        Success,
        Error,
    }
    let detailsStatus = $state(SaveStatus.Idle);
    let reportStatus = $state(SaveStatus.Idle);

    let mentorSearchQuery = $state("");
    let mentorSearching = $state(false);
    let mentorSearchResults: any[] = $state([]);
    let selectedExistingMentorId: string = $state("");

    async function findSimilarMentors() {
        mentorSearching = true;
        const query = (
            mentorSearchQuery ||
            `${project.mentor?.name || ""} ${project.mentor?.organization || ""}`
        ).trim();
        if (!query) {
            mentorSearchResults = [];
            mentorSearching = false;
            return;
        }

        const res = await fetch(
            `/admin/api/mentor/search?q=${encodeURIComponent(query)}`,
        );
        mentorSearching = false;
        if (!res.ok) {
            mentorSearchResults = [];
            return;
        }
        const data = await res.json();
        mentorSearchResults = data.mentors || [];
    }

    async function saveDetails() {
        detailsStatus = SaveStatus.Saving;
        const res = await fetch(`/admin/project-center/${project._id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                Action: "UPDATE",
                title: project.title,
                tags: selectedTags.map((t: any) => t.id),
                shortDesc: project.shortDesc,
                mentor: {
                    name: project.mentor?.name || "",
                    email: project.mentor?.email || "",
                    organization: project.mentor?.organization || "",
                    phoneNumber: project.mentor?.phoneNumber || "",
                },
                existingMentorId: selectedExistingMentorId || undefined,
            }),
        });
        if (res.ok) {
            detailsStatus = SaveStatus.Success;
            toast.success("Project details saved!");
            setTimeout(() => (detailsStatus = SaveStatus.Idle), 3000);
        } else {
            detailsStatus = SaveStatus.Error;
            toast.error("Failed to save project details.");
        }
    }

    async function saveReport() {
        reportStatus = SaveStatus.Saving;
        const res = await fetch(`/admin/project-center/${project._id}`, {
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
            setTimeout(() => (reportStatus = SaveStatus.Idle), 3000);
        } else {
            reportStatus = SaveStatus.Error;
            toast.error("Failed to save full report.");
        }
    }

    async function changePublish() {
        const newPublish = !project.publish;
        const res = await fetch(`/admin/project-center/${project._id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Action: "PUBLISH", publish: newPublish }),
        });
        if (res.ok) {
            project.publish = newPublish;
            toast.success(
                newPublish ? "Project published!" : "Project unpublished.",
            );
        } else {
            toast.error("Failed to update publish status.");
        }
    }

    async function deleteProject() {
        if (deleteConfirmText !== DELETE_PHRASE) return;
        deleting = true;
        const res = await fetch("/admin/api/project/delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ projectId: project._id }),
        });
        if (res.ok) {
            toast.success("Project deleted.");
            await goto("/admin/project-center");
        } else {
            deleting = false;
            toast.error("Failed to delete project.");
        }
    }

    function handlePdfSelection(event: Event) {
        const input = event.currentTarget as HTMLInputElement;
        const file = input?.files?.[0] || null;
        if (!file) {
            selectedPdf = null;
            return;
        }
        if (file.size > MAX_PDF_SIZE_BYTES) {
            selectedPdf = null;
            (input as HTMLInputElement).value = "";
            toast.error(
                `File too large. Max: ${bytesToString(MAX_PDF_SIZE_BYTES)}`,
            );
            return;
        }
        selectedPdf = file;
    }

    async function uploadPdf() {
        if (!selectedPdf) return;
        uploadingPdf = true;
        const formData = new FormData();
        formData.set("pdf", selectedPdf);
        const res = await fetch(`/manage-projects/${project._id}/report/pdf`, {
            method: "PUT",
            body: formData,
        });
        uploadingPdf = false;
        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            toast.error((body as any).message || "PDF upload failed.");
            return;
        }
        const body = await res.json();
        pdfUrl = (body as any).pdfUrl;
        selectedPdf = null;
        toast.success("PDF uploaded.");
    }

    async function removePdf() {
        removingPdf = true;
        const res = await fetch(`/manage-projects/${project._id}/report/pdf`, {
            method: "DELETE",
        });
        removingPdf = false;
        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            toast.error((body as any).message || "Could not remove PDF.");
            return;
        }
        pdfUrl = null;
        toast.success("PDF removed.");
    }
</script>

<main class="w-full h-full p-4 overflow-y-auto">
    <div class="relative w-full rounded-xl p-8 flex flex-col gap-6">
        <a
            class="absolute top-0 left-0 bg-blue-500 hover:bg-blue-600 p-2 px-3 m-8 rounded-lg flex gap-2 items-center text-white"
            href="/admin/project-center"
        >
            <ArrowLeft size={18} />
            <span>Back to Project Center</span>
        </a>

        <h1 class="text-3xl font-bold text-center mt-10">{project.title}</h1>

        <!-- Meta info -->
        <div
            class="grid grid-cols-2 gap-4 bg-gray-100 rounded-xl p-6 border border-gray-300"
        >
            <div>
                <span class="text-sm text-gray-500 font-semibold uppercase"
                    >Student</span
                >
                <p class="text-base">
                    {project.student?.name} —
                    <span class="text-gray-600">{project.student?.email}</span>
                </p>
            </div>
            <div>
                <span class="text-sm text-gray-500 font-semibold uppercase"
                    >Mentor</span
                >
                <div class="flex flex-col gap-2 mt-1 max-w-[40rem]">
                    <span class="text-xs text-gray-500">Full Name</span>
                    <span
                        contenteditable="plaintext-only"
                        class="text-base rounded-md bg-white p-2 border border-gray-400"
                        bind:textContent={project.mentor.name}
                    ></span>
                    <span class="text-xs text-gray-500">Email</span>
                    <span
                        contenteditable="plaintext-only"
                        class="text-base rounded-md bg-white p-2 border border-gray-400"
                        bind:textContent={project.mentor.email}
                    ></span>
                    <span class="text-xs text-gray-500">Phone (optional)</span>
                    <span
                        contenteditable="plaintext-only"
                        class="text-base rounded-md bg-white p-2 border border-gray-400"
                        bind:textContent={project.mentor.phoneNumber}
                    ></span>
                    <span class="text-xs text-gray-500">Organization</span>
                    <span
                        contenteditable="plaintext-only"
                        class="text-base rounded-md bg-white p-2 border border-gray-400"
                        bind:textContent={project.mentor.organization}
                    ></span>
                    <div class="flex items-center gap-2 mt-2">
                        <input
                            type="search"
                            class="p-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Search similar mentors"
                            bind:value={mentorSearchQuery}
                        />
                        <button
                            class="p-2 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                            onclick={findSimilarMentors}>Find Similar</button
                        >
                    </div>
                    {#if mentorSearching}
                        <span class="text-xs text-gray-500"
                            >Searching mentors...</span
                        >
                    {:else if mentorSearchResults.length > 0}
                        <div class="flex flex-col gap-2">
                            {#each mentorSearchResults as m}
                                <div
                                    class="bg-gray-50 border border-gray-300 rounded-md p-2 flex items-center justify-between gap-2"
                                >
                                    <div class="flex flex-col">
                                        <span class="font-semibold text-sm"
                                            >{m.name}</span
                                        >
                                        <span class="text-xs text-gray-600"
                                            >{m.email}</span
                                        >
                                        <span class="text-xs text-gray-600"
                                            >{m.organization}</span
                                        >
                                    </div>
                                    <button
                                        class="p-1 px-3 rounded-md text-white {selectedExistingMentorId ===
                                        m._id
                                            ? 'bg-slate-400 cursor-not-allowed'
                                            : 'bg-blue-500 hover:bg-blue-600'}"
                                        disabled={selectedExistingMentorId ===
                                            m._id}
                                        onclick={() => {
                                            selectedExistingMentorId = m._id;
                                        }}
                                    >
                                        Use
                                    </button>
                                </div>
                            {/each}
                        </div>
                    {/if}
                    {#if selectedExistingMentorId}
                        <button
                            class="self-start p-1 px-3 rounded-md bg-slate-500 hover:bg-slate-600 text-white"
                            onclick={() => {
                                selectedExistingMentorId = "";
                            }}
                        >
                            Clear Selected Existing Mentor
                        </button>
                    {/if}
                </div>
            </div>
            <div>
                <span class="text-sm text-gray-500 font-semibold uppercase"
                    >Year</span
                >
                <p class="text-base">{project.year}</p>
            </div>
            <div>
                <span class="text-sm text-gray-500 font-semibold uppercase"
                    >Status</span
                >
                <p class="text-base">
                    {#if project.publish}
                        <span class="text-green-700 font-semibold"
                            >Published</span
                        >
                    {:else if project.underReview}
                        <span class="text-yellow-600 font-semibold"
                            >Under Review</span
                        >
                    {:else}
                        <span class="text-gray-500">Unpublished</span>
                    {/if}
                </p>
            </div>
            <div>
                <span class="text-sm text-gray-500 font-semibold uppercase"
                    >Created</span
                >
                <p class="text-base">
                    {new Date(project.createdAt).toLocaleString()}
                </p>
            </div>
            <div>
                <span class="text-sm text-gray-500 font-semibold uppercase"
                    >Last Modified</span
                >
                <p class="text-base">
                    {new Date(project.updatedAt).toLocaleString()}
                </p>
            </div>
        </div>

        <!-- Publish toggle -->
        <div class="flex gap-3">
            {#if project.publish}
                <button
                    class="bg-red-500 hover:bg-red-600 text-white rounded-lg p-2 px-4"
                    onclick={changePublish}>Unpublish Project</button
                >
            {:else}
                <button
                    class="bg-green-600 hover:bg-green-700 text-white rounded-lg p-2 px-4"
                    onclick={changePublish}>Publish Project</button
                >
            {/if}
        </div>

        <!-- Editable project details -->
        <div
            class="bg-gray-100 rounded-xl p-6 border border-gray-300 flex flex-col gap-4"
        >
            <h2 class="text-xl font-semibold">Project Details</h2>

            <div class="flex flex-col gap-1">
                <span class="text-sm text-gray-600 font-medium">Title</span>
                <span
                    contenteditable="plaintext-only"
                    class="text-base rounded-md bg-white p-2 border border-gray-400 min-w-72 max-w-[40rem]"
                    bind:textContent={project.title}>{project.title}</span
                >
            </div>

            <div class="flex flex-col gap-1">
                <span class="text-sm text-gray-600 font-medium">Tags</span>
                <MultiSelect
                    options={TAG_OPTIONS}
                    bind:selected={selectedTags}
                    outerDivClass="flex gap-2 items-center my-0 bg-white p-2 rounded-md border-gray-400 border max-w-[40rem]"
                />
            </div>

            <div class="flex flex-col gap-1">
                <span class="text-sm text-gray-600 font-medium"
                    >Short Description</span
                >
                <span
                    contenteditable="plaintext-only"
                    class="text-base rounded-md bg-white p-2 border border-gray-400 min-w-72 max-w-[40rem]"
                    bind:textContent={project.shortDesc}
                    >{project.shortDesc}</span
                >
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
        <div
            class="bg-gray-100 rounded-xl p-6 border border-gray-300 flex flex-col gap-4"
        >
            <h2 class="text-xl font-semibold flex items-center gap-2">
                <BookOpen size={22} /> Full Report
            </h2>
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
                        {#if reportStatus === SaveStatus.Saving}<Circle3
                                size={20}
                            />{:else}<Save size={18} />{/if}
                        <span>Save Report</span>
                    </button>
                    <button
                        class="bg-gray-400 hover:bg-gray-500 text-white rounded-md p-2 px-4"
                        onclick={() => {
                            editingReport = false;
                            editedFullReport = project.fullReport ?? "";
                        }}>Cancel</button
                    >
                    {#if reportStatus === SaveStatus.Error}<CircleX
                            size={22}
                            color="red"
                        />{/if}
                </div>
            {:else}
                <div class="flex flex-col 2xl:flex-row gap-4">
                    <div
                        class="flex-1 max-h-96 overflow-y-auto border border-gray-300 rounded-md p-4 bg-white whitespace-pre-wrap text-base"
                    >
                        {#if editedFullReport}{editedFullReport}{:else}<em
                                class="text-gray-400">No full report yet.</em
                            >{/if}
                    </div>
                    {#if pdfUrl}
                        <div class="flex-1 overflow-y-auto">
                            <iframe
                                src={pdfUrl}
                                class="w-full aspect-[8.5/11] rounded-md border border-gray-300"
                                title="Project PDF"
                            ></iframe>
                        </div>
                    {/if}
                </div>
                <button
                    class="flex items-center gap-2 self-start bg-green-600 hover:bg-green-700 text-white rounded-md p-2 px-4"
                    onclick={() => (editingReport = true)}
                >
                    <Save size={18} />
                    <span>Edit Full Report</span>
                </button>
            {/if}
        </div>

        <!-- PDF Section -->
        <div
            class="bg-gray-100 rounded-xl p-6 border border-gray-300 flex flex-col gap-4"
        >
            <h2 class="text-xl font-semibold flex items-center gap-2">
                <FileText size={22} /> PDF Report
            </h2>
            {#if pdfUrl}
                <div class="flex items-center gap-4">
                    <a
                        href={pdfUrl}
                        target="_blank"
                        class="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md p-2 px-4"
                    >
                        <ExternalLink size={18} />
                        <span>View PDF</span>
                    </a>
                    <button
                        class="flex items-center gap-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded-md p-2 px-4"
                        onclick={removePdf}
                        disabled={removingPdf}
                    >
                        {#if removingPdf}<Circle3 size={18} />{:else}<Trash2
                                size={18}
                            />{/if}
                        <span>Remove PDF</span>
                    </button>
                </div>
            {:else}
                <p class="text-gray-500 text-sm">No PDF uploaded yet.</p>
                <div class="flex items-center gap-3">
                    <input
                        type="file"
                        accept=".pdf,application/pdf"
                        onchange={handlePdfSelection}
                        class="text-sm"
                    />
                    {#if selectedPdf}
                        <button
                            class="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-md p-2 px-4"
                            onclick={uploadPdf}
                            disabled={uploadingPdf}
                        >
                            {#if uploadingPdf}<Circle3 size={18} />{:else}<Save
                                    size={18}
                                />{/if}
                            <span>Upload PDF</span>
                        </button>
                    {/if}
                </div>
            {/if}
        </div>

        <!-- Danger zone: delete -->
        <div
            class="bg-red-50 rounded-xl p-6 border border-red-300 flex flex-col gap-4"
        >
            <h2
                class="text-xl font-semibold text-red-700 flex items-center gap-2"
            >
                <Trash2 size={22} /> Delete Project
            </h2>
            <p class="text-sm text-red-600">
                This action is irreversible. Type <strong
                    >{DELETE_PHRASE}</strong
                > to confirm.
            </p>
            <input
                type="text"
                class="p-2 border border-red-400 rounded-md max-w-sm text-sm"
                placeholder={DELETE_PHRASE}
                bind:value={deleteConfirmText}
            />
            <button
                class="flex items-center gap-2 self-start bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-md p-2 px-4"
                onclick={deleteProject}
                disabled={deleteConfirmText !== DELETE_PHRASE || deleting}
            >
                {#if deleting}<Circle3 size={18} />{:else}<Trash2
                        size={18}
                    />{/if}
                <span>Delete Project</span>
            </button>
        </div>
    </div>
</main>
