<script lang="ts">
    import Icon from "@/client/components/Icon.svelte";
    import Warning from "@/client/icons/Warning";
    import {
        Table,
        TableHead,
        TableHeadCell,
        TableBody,
        TableBodyRow,
        TableBodyCell,
    } from "flowbite-svelte";
    import { getContext } from "svelte";
    import NamePlusPicture from "./NamePlusPicture.svelte";
    import { Ban } from "lucide-svelte"; // use Ban icon for ignore
    import { invalidate } from "$app/navigation";
    import toast from "svelte-french-toast";

    let { missingStudents, ignoredStudents } = $props();

    const LOCALE_STRING_OPTIONS: Intl.DateTimeFormatOptions = {
        year: "2-digit",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    };

    async function ignoreStudent(student: any) {
        await fetch("/admin/api/ignore", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: student._id }),
        });

        toast.success(`${student.name} has been ignored for this year.`);
        invalidate("admin:ignore");
    }
</script>

<div
    class="bg-slate-50 rounded-xl border border-slate-300 shadow-sm overflow-hidden h-full flex flex-col"
>
    <div class="px-5 pt-4 pb-2 border-b border-slate-100">
        <h2 class="text-lg font-semibold text-slate-900">Missing Project</h2>
        <p class="mt-1 text-sm text-slate-500">
            These students have not logged in yet or created a project.
        </p>
    </div>

    <div
        class="overflow-auto flex-1 bg-white m-3 rounded-lg border border-slate-200"
    >
        {#key missingStudents}
            <Table striped={true} items={missingStudents}>
                <TableHead>
                    <TableHeadCell>Student</TableHeadCell>
                    <TableHeadCell>Advisor</TableHeadCell>
                    <TableHeadCell>Last Login</TableHeadCell>
                    <TableHeadCell class="text-right">Actions</TableHeadCell>
                </TableHead>
                <TableBody>
                    <TableBodyRow slot="row" let:item>
                        {@const row = item as any}
                        <TableBodyCell
                            ><NamePlusPicture user={row} /></TableBodyCell
                        >
                        <TableBodyCell>
                            {#if row.advisor}
                                <NamePlusPicture user={row.advisor} />
                            {:else}
                                <span>No advisor linked.</span>
                            {/if}
                        </TableBodyCell>
                        <TableBodyCell>
                            {#if row.lastVisit}
                                <span class="text-gray-500"
                                    >{new Date(row.lastVisit).toLocaleString(
                                        "en-US",
                                        LOCALE_STRING_OPTIONS,
                                    )}</span
                                >
                            {:else}
                                <div class="flex items-center gap-1">
                                    <Icon
                                        src={Warning}
                                        color="red"
                                        size="1.2rem"
                                    />
                                    <span class="text-red-500">Never</span>
                                </div>
                            {/if}
                        </TableBodyCell>
                        <TableBodyCell class="text-right">
                            <button
                                class="bg-gray-400 hover:bg-gray-600 text-white font-bold py-1 px-3 rounded flex items-center justify-end ml-auto gap-1"
                                onclick={() => ignoreStudent(row)}
                            >
                                <Ban size={20} />
                                Ignore
                            </button>
                        </TableBodyCell>
                    </TableBodyRow>
                </TableBody>
            </Table>
        {/key}
    </div>
</div>
