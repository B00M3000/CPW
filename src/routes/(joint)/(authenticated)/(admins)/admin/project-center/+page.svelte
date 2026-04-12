<script lang=ts>
    import { browser } from "$app/environment";
    import { ArrowLeft, Plus, Info, FolderOpen, Search, X, ChevronRight } from "lucide-svelte";
    import { Circle } from "svelte-loading-spinners";
    import { tags as tagMap } from "@/lib/tags";
    import MultiSelect from "svelte-multiselect";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import toast from "svelte-french-toast";
    import Modal from "@/client/components/Modal.svelte";

    const TAG_OPTIONS = Array.from(tagMap.entries()).map(([k, v]) => ({ id: k, label: v, value: v }));

    // --- Project search ---
    let searchQuery = $state("");
    let searchResults: any[] = $state([]);
    let searching = $state(false);

    const PROJECT_SEARCH_QUERY_PARAM = "q";

    function setProjectSearchParam(nextQuery: string) {
        if (!browser) return;

        const url = new URL(window.location.href);
        if (nextQuery) url.searchParams.set(PROJECT_SEARCH_QUERY_PARAM, nextQuery);
        else url.searchParams.delete(PROJECT_SEARCH_QUERY_PARAM);

        window.history.replaceState(window.history.state, "", url);
    }

    onMount(() => {
        if (!browser) return;

        const initialQuery =
            new URL(window.location.href).searchParams
                .get(PROJECT_SEARCH_QUERY_PARAM)
                ?.trim() || "";

        if (initialQuery) {
            searchQuery = initialQuery;
            searchProjects();
        }
    });

    async function searchProjects(e?: SubmitEvent) {
        e?.preventDefault();

        const trimmedQuery = searchQuery.trim();
        if (!trimmedQuery) {
            searchResults = [];
            setProjectSearchParam("");
            return;
        }

        searchQuery = trimmedQuery;
        setProjectSearchParam(trimmedQuery);

        searching = true;
        try {
            const res = await fetch(`/admin/api/project/search?q=${encodeURIComponent(trimmedQuery)}`);
            if (res.ok) {
                const data = await res.json();
                searchResults = data.projects;
            } else {
                toast.error("Search failed.");
            }
        } catch {
            toast.error("Search failed.");
        }
        searching = false;
    }

    // --- Create project modal ---
    let showCreate = $state(false);
    let creating = $state(false);

    let newTitle = $state("");
    let newShortDesc = $state("");
    let newSelectedTags: typeof TAG_OPTIONS = $state([]);
    let newStudentEmail = $state("");
    let newStudentId: string | null = $state(null);
    let newStudentName = $state("");
    let newYear = $state(new Date().getFullYear());

    // New mentor fields
    let newMentorName = $state("");
    let newMentorEmail = $state("");
    let newMentorOrg = $state("");
    let newMentorPhone = $state("");
    let useExistingMentor = $state(false);

    // Existing mentor search
    let mentorSearchQuery = $state("");
    let mentorSearchResults: any[] = $state([]);
    let mentorSearching = $state(false);
    let selectedExistingMentor: any = $state(null);

    async function lookupStudent() {
        if (!newStudentEmail.trim()) return;
        const res = await fetch(`/admin/api/user/search?email=${encodeURIComponent(newStudentEmail)}`);
        if (res.ok) {
            const data = await res.json();
            if (data.user) {
                newStudentId = data.user._id;
                newStudentName = data.user.name || data.user.email;
                toast.success(`Found student: ${newStudentName}`);
            } else {
                newStudentId = null;
                newStudentName = "";
                toast.error("No student found with that email.");
            }
        }
    }

    async function searchMentors(e?: SubmitEvent) {
        e?.preventDefault();
        if (!mentorSearchQuery.trim()) return;
        mentorSearching = true;
        try {
            const res = await fetch(`/admin/api/mentor/search?q=${encodeURIComponent(mentorSearchQuery)}`);
            const data = await res.json();
            mentorSearchResults = data.mentors ?? [];
        } catch {
            mentorSearchResults = [];
        }
        mentorSearching = false;
    }

    async function createProject() {
        if (!newStudentId) { toast.error("Look up a student first."); return; }
        if (!newTitle.trim()) { toast.error("Title is required."); return; }
        if (!newSelectedTags.length) { toast.error("At least one tag is required."); return; }
        if (!newShortDesc.trim()) { toast.error("Short description is required."); return; }
        if (useExistingMentor && !selectedExistingMentor) {
            toast.error("Select an existing mentor."); return;
        }
        if (!useExistingMentor && (!newMentorName.trim() || !newMentorEmail.trim() || !newMentorOrg.trim())) {
            toast.error("Mentor name, email, and organization are required."); return;
        }

        creating = true;

        const body: any = {
            studentId: newStudentId,
            title: newTitle,
            tags: newSelectedTags.map((t: any) => t.id),
            shortDesc: newShortDesc,
            year: newYear,
        };

        if (useExistingMentor && selectedExistingMentor) {
            body.mentorId = selectedExistingMentor._id;
        } else {
            body.newMentor = {
                name: newMentorName,
                email: newMentorEmail,
                organization: newMentorOrg,
                phoneNumber: newMentorPhone,
            };
        }

        const res = await fetch("/admin/api/project/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        creating = false;

        if (res.ok) {
            const data = await res.json();
            toast.success("Project created!");
            showCreate = false;
            await goto(`/admin/project-center/${data.projectId}`);
        } else {
            const data = await res.json().catch(() => ({}));
            toast.error((data as any).message || "Failed to create project.");
        }
    }
</script>

{#if showCreate}
<Modal>
    <div class="relative bg-white rounded-xl shadow-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <button class="absolute top-3 right-3" onclick={() => showCreate = false}><X size={20}/></button>
        <h2 class="text-2xl font-bold mb-6">Create Project (Admin)</h2>

        <div class="flex flex-col gap-4">
            <!-- Student lookup -->
            <div class="flex flex-col gap-1">
                <span class="font-medium text-sm">Student Email</span>
                <div class="flex gap-2">
                    <input type="email" bind:value={newStudentEmail} placeholder="student@school.edu"
                        class="flex-1 p-2 border border-gray-300 rounded-md text-sm" />
                    <button onclick={lookupStudent} class="bg-blue-500 hover:bg-blue-600 text-white px-3 rounded-md text-sm">Look up</button>
                </div>
                {#if newStudentName}<span class="text-green-700 text-xs font-semibold">✓ {newStudentName}</span>{/if}
            </div>

            <!-- Title -->
            <div class="flex flex-col gap-1">
                <span class="font-medium text-sm">Title</span>
                <input type="text" bind:value={newTitle} placeholder="Project title"
                    class="p-2 border border-gray-300 rounded-md text-sm" />
            </div>

            <!-- Tags -->
            <div class="flex flex-col gap-1">
                <span class="font-medium text-sm">Tags</span>
                <MultiSelect options={TAG_OPTIONS} bind:selected={newSelectedTags}
                    outerDivClass="bg-white p-2 rounded-md border border-gray-300">
                    <span slot="selected" let:option class="text-sm">{option.label}</span>
                </MultiSelect>
            </div>

            <!-- Short description -->
            <div class="flex flex-col gap-1">
                <span class="font-medium text-sm">Short Description</span>
                <textarea bind:value={newShortDesc} rows={3} placeholder="Brief project description..."
                    class="p-2 border border-gray-300 rounded-md text-sm resize-none"></textarea>
            </div>

            <!-- Year -->
            <div class="flex flex-col gap-1">
                <span class="font-medium text-sm">Year</span>
                <input type="number" bind:value={newYear} min={2019} max={2040}
                    class="p-2 border border-gray-300 rounded-md text-sm w-32" />
            </div>

            <!-- Mentor -->
            <div class="flex flex-col gap-2">
                <span class="font-medium text-sm">Mentor</span>
                <label class="flex items-center gap-2 text-sm cursor-pointer select-none">
                    <input type="checkbox" bind:checked={useExistingMentor} />
                    Use existing mentor from database
                </label>
                {#if useExistingMentor}
                    {#if selectedExistingMentor}
                    <div class="bg-green-50 border border-green-300 rounded-md p-3 flex justify-between items-start">
                        <div>
                            <p class="font-semibold text-sm">{selectedExistingMentor.name}</p>
                            <p class="text-xs text-gray-600">{selectedExistingMentor.organization}</p>
                            <p class="text-xs text-gray-500">{selectedExistingMentor.email}</p>
                        </div>
                        <button onclick={() => { selectedExistingMentor = null; }} class="text-gray-400 hover:text-gray-700"><X size={16}/></button>
                    </div>
                    {:else}
                    <form class="flex gap-2" onsubmit={searchMentors}>
                        <input type="search" bind:value={mentorSearchQuery} placeholder="Search mentors..."
                            class="flex-1 p-2 border border-gray-300 rounded-l-md text-sm outline-none" />
                        <button type="submit" class="bg-sky-600 text-white px-3 rounded-r-md text-sm">Search</button>
                    </form>
                    {#if mentorSearching}
                    <div class="flex justify-center py-2"><Circle size={20} /></div>
                    {:else if mentorSearchResults.length > 0}
                    <div class="flex flex-col gap-1 max-h-40 overflow-y-auto border border-gray-200 rounded-md p-2 bg-gray-50">
                        {#each mentorSearchResults as m}
                        <button class="text-left p-2 rounded hover:bg-white border border-transparent hover:border-gray-200 text-sm flex items-start justify-between"
                            onclick={() => { selectedExistingMentor = m; mentorSearchResults = []; }}>
                            <span>
                                <span class="font-medium">{m.name}</span>
                                <span class="text-gray-500 ml-1">— {m.organization}</span>
                            </span>
                            <span class="text-xs text-gray-400">{m.projectCount ?? 0} projects</span>
                        </button>
                        {/each}
                    </div>
                    {/if}
                    {/if}
                {:else}
                <div class="grid grid-cols-2 gap-2">
                    <div class="flex flex-col gap-1">
                        <span class="text-xs text-gray-500">Full Name *</span>
                        <input type="text" bind:value={newMentorName} class="p-2 border border-gray-300 rounded text-sm" />
                    </div>
                    <div class="flex flex-col gap-1">
                        <span class="text-xs text-gray-500">Email *</span>
                        <input type="email" bind:value={newMentorEmail} class="p-2 border border-gray-300 rounded text-sm" />
                    </div>
                    <div class="flex flex-col gap-1">
                        <span class="text-xs text-gray-500">Organization *</span>
                        <input type="text" bind:value={newMentorOrg} class="p-2 border border-gray-300 rounded text-sm" />
                    </div>
                    <div class="flex flex-col gap-1">
                        <span class="text-xs text-gray-500">Phone (optional)</span>
                        <input type="text" bind:value={newMentorPhone} class="p-2 border border-gray-300 rounded text-sm" />
                    </div>
                </div>
                {/if}
            </div>

            <button
                class="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white p-2 px-6 rounded-md flex items-center gap-2 self-start"
                onclick={createProject}
                disabled={creating}
            >
                {#if creating}<Circle size={18} />{:else}<Plus size={18} />{/if}
                <span>Create Project</span>
            </button>
        </div>
    </div>
</Modal>
{/if}

<main class="w-full h-full p-4 overflow-y-auto">
    <div class="relative w-full rounded-xl p-8 flex flex-col gap-6">
        <a class="absolute top-0 left-0 bg-blue-500 hover:bg-blue-600 p-2 px-3 m-8 rounded-lg flex gap-2 items-center text-white" href="/admin">
            <ArrowLeft />
            <span>Back to Admin Dashboard</span>
        </a>

        <h1 class="text-4xl font-bold text-center mt-10 flex items-center justify-center gap-4"><FolderOpen size={48} /> Project Center</h1>

        <div class="flex gap-3">
            <a href="/admin/year-status" class="flex gap-2 items-center bg-gray-500 hover:bg-gray-600 text-white p-2 px-3 rounded-md">
                <Info />
                <span>Year Status</span>
            </a>
            <button onclick={() => showCreate = true} class="flex gap-2 items-center bg-blue-500 hover:bg-blue-600 text-white p-2 px-3 rounded-md">
                <Plus />
                <span>Create Project</span>
            </button>
        </div>

        <!-- Project search -->
        <div class="bg-gray-100 rounded-xl p-6 border border-gray-300">
            <h2 class="text-xl font-semibold mb-4 flex items-center gap-2"><Search size={22} /> Search Projects</h2>
            <form class="flex gap-2 mb-4" onsubmit={searchProjects}>
                <input
                    type="search"
                    bind:value={searchQuery}
                    placeholder="Search by title or student name..."
                    class="flex-1 p-2 px-3 border border-gray-300 rounded-l-md outline-none"
                />
                <button type="submit" class="bg-sky-600 hover:bg-sky-700 text-white px-4 rounded-r-md">Search</button>
            </form>

            {#if searching}
            <div class="flex justify-center py-4"><Circle /></div>
            {:else if searchResults.length > 0}
            <div class="flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
                {#each searchResults as project}
                <a
                    href="/admin/project-center/{project._id}"
                    class="flex items-center justify-between p-3 rounded-lg bg-white hover:bg-blue-50 border border-gray-200 transition-colors"
                >
                    <div>
                        <p class="font-semibold">{project.title}</p>
                        <p class="text-sm text-gray-500">{project.studentName} · {project.year}</p>
                    </div>
                    <div class="flex items-center gap-3">
                        {#if project.publish}
                        <span class="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">Published</span>
                        {:else if project.underReview}
                        <span class="text-xs font-semibold text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full">Under Review</span>
                        {:else}
                        <span class="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">Unpublished</span>
                        {/if}
                        <ChevronRight size={18} class="text-gray-400" />
                    </div>
                </a>
                {/each}
            </div>
            {:else if searchQuery && !searching}
            <p class="text-gray-500 text-sm">No projects found.</p>
            {:else}
            <p class="text-gray-400 text-sm">Enter a search query to find projects.</p>
            {/if}
        </div>
    </div>
</main>
