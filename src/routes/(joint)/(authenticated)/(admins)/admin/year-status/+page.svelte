<script lang="ts">
    import { currentYear } from "@/lib/utils";
    import MissingStudents from "./MissingStudents.svelte";
    import UnapprovedStudents from "./UnapprovedStudents.svelte";
    import ApprovedProjects from "./ApprovedProjects.svelte";
    import {
        ArrowLeft,
        CheckCircle2,
        ClipboardList,
        UserX2,
    } from "lucide-svelte";
    import IgnoredStudents from "./IgnoredStudents.svelte";

    let { data } = $props();
    let {
        missingStudents,
        inflatedUnapprovedProjects,
        inflatedApprovedProjects,
        ignoredStudents,
    } = $derived(data);

    const CURRENT_YEAR = currentYear();

    let excludeSeniors: boolean = $state(false);

    let filteredMissingStudents: any[] = $state([]);
    let filteredInflatedUnapprovedProjects: any[] = $state([]);

    $effect(applyFilter);

    function applyFilter() {
        if (excludeSeniors) {
            filteredMissingStudents = missingStudents.filter(
                (student) =>
                    student.graduationYear != CURRENT_YEAR && excludeSeniors,
            );
            filteredInflatedUnapprovedProjects =
                inflatedUnapprovedProjects.filter(
                    (project) =>
                        project.student.graduationYear != CURRENT_YEAR &&
                        excludeSeniors,
                );
        } else {
            filteredMissingStudents = missingStudents;
            filteredInflatedUnapprovedProjects = inflatedUnapprovedProjects;
        }
    }

    applyFilter();
</script>

<main class="min-h-screen p-4 md:p-6 lg:p-8 bg-slate-100">
    <div class="w-full space-y-6">
        <a
            class="inline-flex bg-blue-500 hover:bg-blue-600 p-2 px-3 rounded-lg gap-2 items-center text-white"
            href="/admin"
        >
            <ArrowLeft size={18} />
            <span>Back to Admin Dashboard</span>
        </a>
        <div
            class="rounded-2xl border border-slate-300 bg-slate-50 shadow-sm p-4 md:p-6 lg:p-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"
        >
            <div class="space-y-3">
                <div>
                    <h1 class="text-3xl md:text-4xl font-bold text-slate-900">
                        Mission Control
                    </h1>
                    <p class="text-slate-500 mt-1">
                        Project Week {CURRENT_YEAR} operational dashboard
                    </p>
                </div>
            </div>

            <div class="w-full lg:w-auto">
                <span
                    class="text-sm font-semibold uppercase tracking-wide text-slate-500"
                    >Filters</span
                >
                <div class="flex items-center gap-2 mt-3">
                    <input
                        id="excludeSeniors"
                        type="checkbox"
                        bind:checked={excludeSeniors}
                    />
                    <label for="excludeSeniors" class="text-slate-700"
                        >Exclude Seniors</label
                    >
                </div>
            </div>
        </div>

        <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div class="flex items-center justify-between">
                    <span class="text-sm text-slate-500">Needs Attention</span>
                    <ClipboardList class="text-amber-600" size={18} />
                </div>
                <p class="text-3xl font-bold text-slate-900 mt-2">
                    {filteredMissingStudents.length +
                        filteredInflatedUnapprovedProjects.length}
                </p>
            </div>
            <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div class="flex items-center justify-between">
                    <span class="text-sm text-slate-500">Missing Project</span>
                    <UserX2 class="text-rose-600" size={18} />
                </div>
                <p class="text-3xl font-bold text-slate-900 mt-2">
                    {filteredMissingStudents.length}
                </p>
            </div>
            <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div class="flex items-center justify-between">
                    <span class="text-sm text-slate-500">Awaiting Approval</span
                    >
                    <ClipboardList class="text-orange-600" size={18} />
                </div>
                <p class="text-3xl font-bold text-slate-900 mt-2">
                    {filteredInflatedUnapprovedProjects.length}
                </p>
            </div>
            <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div class="flex items-center justify-between">
                    <span class="text-sm text-slate-500"
                        >Approved This Year</span
                    >
                    <CheckCircle2 class="text-emerald-600" size={18} />
                </div>
                <p class="text-3xl font-bold text-slate-900 mt-2">
                    {inflatedApprovedProjects.length}
                </p>
            </div>
        </section>

        <section class="grid gap-4 xl:grid-cols-2 auto-rows-fr">
            <div class="min-h-[24rem] max-h-[38rem]">
                <UnapprovedStudents
                    inflatedUnapprovedProjects={filteredInflatedUnapprovedProjects}
                />
            </div>
            <div class="min-h-[24rem] max-h-[38rem]">
                <MissingStudents
                    missingStudents={filteredMissingStudents}
                    {ignoredStudents}
                />
            </div>
        </section>

        <section class="grid gap-4 xl:grid-cols-3 auto-rows-fr">
            <div class="min-h-[24rem] max-h-[38rem] xl:col-span-2">
                <ApprovedProjects approvedProjects={inflatedApprovedProjects} />
            </div>
            <div class="min-h-[24rem] max-h-[38rem] xl:col-span-1">
                <IgnoredStudents {ignoredStudents} />
            </div>
        </section>
    </div>
</main>
