<script>
    import { Table, TableHead, TableHeadCell, TableBody, TableBodyRow, TableBodyCell } from "flowbite-svelte";
    import NamePlusPicture from "./NamePlusPicture.svelte";
    import { XCircle, RefreshCw } from 'lucide-svelte';

    let { ignoredStudents } = $props();

    let showRefresh = false;

    async function unignoreStudent(student) {
        await fetch('/admin/api/ignore', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: student._id })
        });
        // Remove student from ignoredStudents array
        ignoredStudents = ignoredStudents.filter(s => s._id !== student._id);
        showRefresh = true;
    }

    function refreshPage() {
        location.reload();
    }
</script>

<div class="flex flex-col gap-4 p-5 items-center w-full">
    <div class="w-[24rem] shadow-md">
        {#key ignoredStudents}
        <Table striped={true} items={ignoredStudents}>
            <caption class="p-5 text-lg font-semibold text-left text-gray-900 bg-white">
                Ignored Students
                <p class="mt-1 text-sm font-normal text-gray-500">These students have been marked as ignored.</p>
            </caption>
            {#if showRefresh}
                <tr>
                    <td colspan="2" class="bg-yellow-100 border border-yellow-300 rounded px-3 py-2 text-center">
                        <div class="flex items-center gap-2 justify-center">
                            <span>Please refresh to update the lists above.</span>
                            <button
                                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded flex items-center gap-1"
                                on:click={refreshPage}
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
                    <TableBodyCell><NamePlusPicture user={item}/></TableBodyCell>
                    <TableBodyCell class="text-right">
                        <button
                            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded flex items-center justify-end ml-auto"
                            on:click={() => unignoreStudent(item)}
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
