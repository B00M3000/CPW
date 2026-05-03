<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang="ts">
    import { tags } from "@/lib/tags";
    import { onMount } from "svelte";
    import MultiSelect from "svelte-multiselect";
    import { RingLoader } from "svelte-loading-spinners";
    import { CheckmarkFilled, ErrorFilled } from "carbon-icons-svelte";
    import toast from "svelte-french-toast";

    const TAG_OPTIONS = Array.from(tags.entries()).map(([id, label]) => ({
        id,
        label,
        value: label,
    }));

    interface ProjectInformation {
        _id: string;
        title: string;
        tags: string[];
        shortDesc: string;
    }

    interface MentorInformation {
        _id: string;
        name: string;
        email: string;
        phoneNumber: string;
        organization: string;
    }

    interface CandidateMentor {
        _id: string;
        name: string;
        email: string;
        organization: string;
    }

    type MentorAction = "create-new" | "use-existing";

    let {
        data,
    }: {
        data: {
            project: ProjectInformation;
            mentor: MentorInformation;
        };
    } = $props();

    enum EditStatus {
        UNSAVED,
        UPLOADING,
        SUCCESS,
        ERROR,
    }

    let status: EditStatus = $state(EditStatus.UNSAVED);
    let selected: any = $state([]);

    let project = $state({
        title: data.project.title,
        tags: data.project.tags,
        shortDesc: data.project.shortDesc,
    });

    let mentor: MentorInformation = $state({
        ...data.mentor,
        phoneNumber: data.mentor.phoneNumber || "",
    });

    let candidateMentors: CandidateMentor[] = $state([]);
    let selectedExistingMentorId = $state("");
    let mentorAction: MentorAction | "" = $state("");
    let mentorEditorOpen = $state(false);
    let mentorDeduplicationOpen = $state(false);
    let mentorDeduplicationLoading = $state(false);
    let errorMessage = $state("");
    let lastAutoOpenedMentorSignature = $state("");

    const originalMentorSignature = [
        (data.mentor.name || "").trim(),
        (data.mentor.email || "").trim(),
        (data.mentor.organization || "").trim(),
        (data.mentor.phoneNumber || "").trim(),
    ].join("|");

    const currentMentorSignature = $derived(
        [
            (mentor.name || "").trim(),
            (mentor.email || "").trim(),
            (mentor.organization || "").trim(),
            (mentor.phoneNumber || "").trim(),
        ].join("|"),
    );

    const mentorChanged = $derived(
        currentMentorSignature !== originalMentorSignature,
    );

    onMount(() => {
        selected = data.project.tags
            .map((tagId: string) =>
                TAG_OPTIONS.find((option) => option.id === tagId),
            )
            .filter(Boolean);
    });

    $effect(() => {
        project.tags = selected.map((option: any) => option.id);
    });

    $effect(() => {
        if (errorMessage) toast.error(errorMessage);
    });

    $effect(() => {
        if (!mentorChanged) {
            lastAutoOpenedMentorSignature = "";
            mentorAction = "";
            selectedExistingMentorId = "";
            return;
        }

        if (
            mentorDeduplicationOpen ||
            lastAutoOpenedMentorSignature === currentMentorSignature
        ) {
            return;
        }

        const timeoutId = setTimeout(() => {
            lastAutoOpenedMentorSignature = currentMentorSignature;
            openMentorDeduplication();
        }, 350);

        return () => clearTimeout(timeoutId);
    });

    async function openMentorDeduplication() {
        mentorDeduplicationOpen = true;
        mentorDeduplicationLoading = true;
        candidateMentors = [];
        selectedExistingMentorId = "";

        const searchParams = new URLSearchParams();
        searchParams.set("name", mentor.name || "");
        searchParams.set("organization", mentor.organization || "");
        searchParams.set("limit", "10");

        const res = await fetch(
            `/manage-projects/create/deduplication?${searchParams.toString()}`,
        );
        if (!res.ok) {
            mentorDeduplicationLoading = false;
            candidateMentors = [];
            return;
        }

        const body = await res.json();
        candidateMentors = body.mentors || [];
        mentorDeduplicationLoading = false;
    }

    function chooseExistingMentor(candidate: CandidateMentor) {
        mentorAction = "use-existing";
        selectedExistingMentorId = candidate._id;
        mentor.name = candidate.name;
        mentor.email = candidate.email;
        mentor.organization = candidate.organization;
    }

    function clearExistingMentorSelection() {
        selectedExistingMentorId = "";
    }

    function selectMentorAction(nextAction: MentorAction) {
        mentorAction = nextAction;

        if (nextAction === "create-new") {
            selectedExistingMentorId = "";
            mentorDeduplicationOpen = false;
            mentorDeduplicationLoading = false;
            candidateMentors = [];
            return;
        }

        if (!mentorDeduplicationOpen) {
            openMentorDeduplication();
        }
    }

    async function upload() {
        status = EditStatus.UPLOADING;

        if (!(project.title.length >= 12 && project.title.length <= 200)) {
            status = EditStatus.ERROR;
            errorMessage =
                "Please enter a project name between 12 and 200 characters.";
            return;
        }

        if (!(project.tags.length >= 1 && project.tags.length <= 5)) {
            status = EditStatus.ERROR;
            errorMessage = "Please select between 1 and 5 tags.";
            return;
        }

        if (
            !(project.shortDesc.length >= 25 && project.shortDesc.length <= 500)
        ) {
            status = EditStatus.ERROR;
            errorMessage =
                "Please enter a short description with at least 25 characters and less than 500.";
            return;
        }

        if (
            !mentor.name.trim() ||
            !mentor.organization.trim() ||
            !mentor.email.trim()
        ) {
            status = EditStatus.ERROR;
            errorMessage =
                "Please complete the mentor name, organization, and email fields.";
            return;
        }

        if (mentorChanged) {
            if (!mentorAction) {
                status = EditStatus.ERROR;
                errorMessage =
                    "You changed mentor details. Please choose whether to create a new mentor or use an existing one.";
                return;
            }

            if (mentorAction === "use-existing" && !selectedExistingMentorId) {
                status = EditStatus.ERROR;
                errorMessage =
                    "Please select an existing mentor before saving.";
                return;
            }
        }

        const res = await fetch(`/manage-projects/${data.project._id}/edit`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                project,
                mentorInformation: {
                    fullName: mentor.name,
                    organization: mentor.organization,
                    email: mentor.email,
                    phoneNumber: mentor.phoneNumber || "",
                },
                existingMentorId: selectedExistingMentorId || undefined,
                mentorAction: mentorChanged ? mentorAction : undefined,
            }),
        });

        if (res.ok) {
            status = EditStatus.SUCCESS;
            errorMessage = "";
        } else {
            status = EditStatus.ERROR;
            const body = await res.json().catch(() => ({}));
            errorMessage = body?.message || "Failed to save changes.";
        }
    }

    function closeMentorEditor() {
        mentorEditorOpen = false;
    }
</script>

<main class="w-full min-h-full overflow-y-auto py-8 px-4">
    <div
        class="mx-auto flex w-full max-w-5xl flex-col items-stretch gap-12 rounded-lg border border-solid border-gray-400 bg-gray-200 p-12 shadow"
    >
        <h1 class="text-2xl">Edit Project Details</h1>

        <div
            class="edit-layout gap-12 items-start"
        >
            <div class="flex flex-col items-start gap-4">
                <div class="flex gap-2 items-start flex-col">
                    <h2 class="text-lg">Title</h2>
                    <input
                        class="text-base rounded-md bg-gray-50 p-2 border-gray-400 max-w-[30rem] border min-w-72"
                        type="text"
                        bind:value={project.title}
                    />
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
                    />
                </div>

                <div class="flex gap-2 items-start flex-col">
                    <h2 class="text-lg">Short Description</h2>
                    <textarea
                        class="text-base rounded-md bg-gray-50 p-2 border-gray-400 border min-w-72 max-w-[32rem] min-h-32"
                        bind:value={project.shortDesc}
                    ></textarea>
                </div>
            </div>

            <div class="flex flex-col items-start gap-2 p-8">
                <h2 class="text-lg">Mentor</h2>
                <div
                    class="flex w-full min-w-[20rem] flex-col items-start gap-1 rounded-3xl bg-slate-100 px-5 py-5"
                >
                    <span
                        class="w-full text-lg font-bold text-slate-800"
                        >{mentor.name || "Not set"}</span
                    >
                    <span
                        class="w-full text-base text-slate-600"
                        >{mentor.organization || "Not set"}</span
                    >
                    <span
                        class="w-full text-sm text-slate-500"
                        >{mentor.email || "Not set"}</span
                    >
                    <span
                        class="w-full text-sm text-slate-500"
                        >{mentor.phoneNumber || "Not provided"}</span
                    >
                </div>

                <span class="text-gray-600 max-w-[20rem] text-sm"
                    >Mentor details are read-only on this page to keep the form
                    focused. Use the button below to edit mentor details.</span
                >
                <button
                    class="mt-2 p-2 px-4 rounded-md bg-blue-500 hover:bg-blue-600 text-white"
                    onclick={() => (mentorEditorOpen = true)}
                >
                    Edit Mentor Details
                </button>
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
                    <button
                        class="p-3 px-5 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center"
                        onclick={upload}
                    >
                        <span>Save Changes</span>
                    </button>
                </div>
                <a
                    class="p-3 px-5 bg-red-500 hover:bg-red-600 text-white rounded-md"
                    href="/manage-projects"
                    data-sveltekit-reload>Go Back</a
                >
            </div>
        </div>
    </div>

    {#if mentorEditorOpen}
        <div
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
            <div
                class="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl border border-gray-300 bg-gray-100 p-6"
            >
                <div class="mb-4 flex items-center justify-between gap-2">
                    <h3 class="text-xl font-semibold">Edit Mentor Details</h3>
                    <button
                        class="p-1 px-3 rounded-md bg-gray-500 hover:bg-gray-600 text-white"
                        onclick={closeMentorEditor}
                    >
                        Close
                    </button>
                </div>

                <div class="grid gap-6 lg:grid-cols-2 items-start">
                    <div class="flex flex-col items-start gap-2">
                        <div
                            class="flex flex-col items-start bg-gray-200 rounded-xl p-4 w-full gap-1"
                        >
                            <span class="text-sm text-gray-600">Full Name</span>
                            <input
                                class="text-lg font-bold rounded-md bg-gray-50 p-2 border border-gray-400 w-full"
                                type="text"
                                bind:value={mentor.name}
                            />
                            <span class="text-sm text-gray-600 mt-1">Email</span>
                            <input
                                class="text-base text-gray-700 rounded-md bg-gray-50 p-2 border border-gray-400 w-full"
                                type="email"
                                bind:value={mentor.email}
                            />
                            <span class="text-sm text-gray-600 mt-1"
                                >Phone (optional)</span
                            >
                            <input
                                class="text-base text-gray-700 rounded-md bg-gray-50 p-2 border border-gray-400 w-full"
                                type="text"
                                bind:value={mentor.phoneNumber}
                            />
                            <span class="text-sm text-gray-600 mt-1"
                                >Organization</span
                            >
                            <input
                                class="text-base rounded-md bg-gray-50 p-2 border border-gray-400 w-full"
                                type="text"
                                bind:value={mentor.organization}
                            />
                        </div>

                        <span class="text-gray-600 text-sm"
                            >Changes made here are applied to the form and will
                            save with project changes.</span
                        >
                    </div>

                    <div class="flex flex-col items-start gap-2 w-full">
                        {#if mentorChanged}
                            <div
                                class="flex flex-col gap-2 w-full rounded-xl border border-amber-300 bg-amber-50 p-4"
                            >
                                <span class="text-base font-semibold"
                                    >Mentor Update Confirmation Required</span
                                >
                                <span class="text-sm text-gray-700">
                                    You changed mentor details. Choose one option
                                    before saving:
                                </span>

                                <label class="flex items-start gap-2 text-sm">
                                    <input
                                        type="radio"
                                        name="mentor-action"
                                        checked={mentorAction === "create-new"}
                                        onchange={() =>
                                            selectMentorAction("create-new")}
                                    />
                                    <span
                                        >Create a NEW mentor record with the
                                        entered details.</span
                                    >
                                </label>

                                <label class="flex items-start gap-2 text-sm">
                                    <input
                                        type="radio"
                                        name="mentor-action"
                                        checked={mentorAction === "use-existing"}
                                        onchange={() =>
                                            selectMentorAction("use-existing")}
                                    />
                                    <span
                                        >Use an EXISTING mentor record
                                        (recommended if this mentor already
                                        exists).</span
                                    >
                                </label>
                            </div>
                        {/if}

                        {#if mentorDeduplicationOpen}
                            <div
                                class="flex flex-col gap-3 w-full rounded-xl border border-gray-300 bg-gray-100 p-4"
                            >
                                <div
                                    class="flex items-center justify-between gap-2"
                                >
                                    <span class="text-lg font-semibold"
                                        >Mentor Deduplication</span
                                    >
                                    <!-- <button
                                        class="p-1 px-3 rounded-md bg-gray-500 hover:bg-gray-600 text-white"
                                        onclick={() => {
                                            mentorDeduplicationOpen = false;
                                            mentorDeduplicationLoading = false;
                                            candidateMentors = [];
                                            selectedExistingMentorId = "";
                                        }}
                                    >
                                        Close
                                    </button> -->
                                </div>

                                <span
                                    class="text-sm text-gray-600 max-w-[36rem]"
                                >
                                    Review possible matching mentors before
                                    saving. If one matches, select it and keep
                                    "Use an EXISTING mentor" selected above.
                                </span>

                                {#if mentorDeduplicationLoading}
                                    <div class="p-4 text-sm text-gray-600">
                                        Searching for similar mentors...
                                    </div>
                                {:else if candidateMentors.length > 0}
                                    <div class="flex flex-col gap-2 w-full">
                                        <span class="text-sm text-gray-600"
                                            >Select an existing mentor if one
                                            matches:</span
                                        >
                                        <div class="candidate-mentor-list">
                                            {#each candidateMentors as candidate}
                                                <div
                                                    class="bg-white border border-gray-300 rounded-md p-2 flex items-center justify-between gap-2"
                                                >
                                                    <div class="flex flex-col">
                                                        <span
                                                            class="font-semibold text-sm"
                                                            >{candidate.name}</span
                                                        >
                                                        <span
                                                            class="text-xs text-gray-600"
                                                            >{candidate.email}</span
                                                        >
                                                        <span
                                                            class="text-xs text-gray-600"
                                                            >{candidate.organization}</span
                                                        >
                                                    </div>
                                                    <button
                                                        class="p-1 px-3 rounded-md text-white {selectedExistingMentorId ===
                                                        candidate._id
                                                            ? 'bg-slate-400 cursor-not-allowed'
                                                            : 'bg-blue-500 hover:bg-blue-600'}"
                                                        disabled={selectedExistingMentorId ===
                                                            candidate._id}
                                                        onclick={() =>
                                                            chooseExistingMentor(candidate)}
                                                    >
                                                        {selectedExistingMentorId ===
                                                        candidate._id
                                                            ? "Selected"
                                                            : "Use"}
                                                    </button>
                                                </div>
                                            {/each}
                                        </div>
                                    </div>
                                {:else}
                                    <div
                                        class="p-4 text-sm text-gray-600 bg-white rounded-md border border-gray-200"
                                    >
                                        No similar mentor entries found.
                                    </div>
                                {/if}

                                {#if selectedExistingMentorId}
                                    <button
                                        class="self-start p-1 px-3 rounded-md bg-slate-500 hover:bg-slate-600 text-white"
                                        onclick={clearExistingMentorSelection}
                                    >
                                        Clear Selected Existing Mentor
                                    </button>
                                {/if}
                            </div>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    {/if}
</main>

<style>
    .edit-layout {
        display: grid;
        width: 100%;
        grid-template-columns: minmax(20rem, 1.3fr) minmax(20rem, 1fr);
    }

    .candidate-mentor-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        max-height: 15rem;
        overflow-y: auto;
        padding-right: 0.25rem;
    }

    @media (max-width: 1320px) {
        .edit-layout {
            grid-template-columns: 1fr;
        }
    }
</style>
