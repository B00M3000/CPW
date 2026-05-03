<script lang="ts">
    import {
        Table,
        TableHead,
        TableHeadCell,
        TableBody,
        TableBodyRow,
        TableBodyCell,
    } from "flowbite-svelte";
    import NamePlusPicture from "./NamePlusPicture.svelte";
    import { XCircle, RefreshCw } from "lucide-svelte";

    let { ignoredStudents } = $props();

    let showRefresh = $state(false);

    async function unignoreStudent(student: any) {
        await fetch("/admin/api/ignore", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: student._id }),
        });
        // Remove student from ignoredStudents array
        ignoredStudents = ignoredStudents.filter(
            (s: any) => s._id !== student._id,
        );
        showRefresh = true;
    }

    function refreshPage() {
        location.reload();
    }
</script>

<div
    class="bg-slate-50 rounded-xl border border-slate-300 shadow-sm overflow-hidden h-full flex flex-col"
>
    <div class="px-5 pt-4 pb-2 border-b border-slate-100">
        <h2 class="text-lg font-semibold text-slate-900">Ignored Students</h2>
        <p class="mt-1 text-sm text-slate-500">
            Students marked as ignored for this year.
        </p>
    </div>

    <div
        class="overflow-auto flex-1 bg-white m-3 rounded-lg border border-slate-200"
    >
        {#key ignoredStudents}
            <Table striped={true} items={ignoredStudents}>
                {#if showRefresh}
                    <tr>
                        <td
                            colspan="2"
                            class="bg-yellow-100 border border-yellow-300 rounded px-3 py-2 text-center"
                        >
                            <div class="flex items-center gap-2 justify-center">
                                <span
                                    >Please refresh to update the lists above.</span
                                >
                                <button
                                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded flex items-center gap-1"
                                    onclick={refreshPage}
                                    title="Refresh"
                                >
                                    <RefreshCw size={18} />
                                    Refresh
                                </button>
                            </div>
                        </td>
                    </tr>
                {/if}
                <TableHead>
                    <TableHeadCell>Student</TableHeadCell>
                    <TableHeadCell class="text-right">Actions</TableHeadCell>
                </TableHead>
                <TableBody>
                    <TableBodyRow slot="row" let:item>
                        <TableBodyCell
                            ><NamePlusPicture user={item} /></TableBodyCell
                        >
                        <TableBodyCell class="text-right">
                            <button
                                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded flex items-center justify-end ml-auto"
                                onclick={() => unignoreStudent(item)}
                                title="Unignore"
                            >
                                <XCircle size={20} />
                            </button>
                        </TableBodyCell>
                    </TableBodyRow>
                </TableBody>
            </Table>
        {/key}
    </div>
</div>
