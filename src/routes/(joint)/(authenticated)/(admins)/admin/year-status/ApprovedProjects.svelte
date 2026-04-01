<script>
    import Icon from "@/client/components/Icon.svelte";
    import Open from "@/client/icons/Open";
    import {
        Table,
        TableHead,
        TableHeadCell,
        TableBody,
        TableBodyRow,
        TableBodyCell,
    } from "flowbite-svelte";
    import NamePlusPicture from "./NamePlusPicture.svelte";

    let { approvedProjects } = $props();
</script>

<div
    class="bg-slate-50 rounded-xl border border-slate-300 shadow-sm overflow-hidden h-full flex flex-col"
>
    <div class="px-5 pt-4 pb-2 border-b border-slate-100">
        <h2 class="text-lg font-semibold text-slate-900">Approved Projects</h2>
        <p class="mt-1 text-sm text-slate-500">
            All approved projects for this year.
        </p>
    </div>

    <div
        class="overflow-auto flex-1 bg-white m-3 rounded-lg border border-slate-200"
    >
        {#key approvedProjects}
            <Table striped={true} items={approvedProjects}>
                <TableHead>
                    <TableHeadCell>Project</TableHeadCell>
                    <TableHeadCell>Student</TableHeadCell>
                    <TableHeadCell>Advisor</TableHeadCell>
                    <TableHeadCell>Status</TableHeadCell>
                    <TableHeadCell class="text-right">Actions</TableHeadCell>
                </TableHead>
                <TableBody>
                    <TableBodyRow slot="row" let:item>
                        <TableBodyCell>
                            <p class="max-w-56 text-wrap">{item.title}</p>
                        </TableBodyCell>
                        <TableBodyCell
                            ><NamePlusPicture
                                user={item.student}
                            /></TableBodyCell
                        >
                        <TableBodyCell>
                            {#if item.advisor}
                                <NamePlusPicture user={item.advisor} />
                            {:else}
                                <span>No advisor linked.</span>
                            {/if}
                        </TableBodyCell>
                        <TableBodyCell>
                            {#if item.publish}
                                <span
                                    class="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full"
                                    >Published</span
                                >
                            {:else}
                                <span
                                    class="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full"
                                    >Unpublished</span
                                >
                            {/if}
                        </TableBodyCell>
                        <TableBodyCell class="!p-4 text-right">
                            <button
                                class="rounded-md bg-slate-200 flex gap-2 items-center justify-center py-1.5 px-2.5 hover:bg-slate-300 ml-auto"
                                onclick={() =>
                                    window.open(
                                        `/admin/project-center/${item._id}`,
                                        "_blank",
                                    )}
                            >
                                <Icon src={Open} size="1.1rem" />
                                <span>Open</span>
                            </button>
                        </TableBodyCell>
                    </TableBodyRow>
                </TableBody>
            </Table>
        {/key}
    </div>
</div>
