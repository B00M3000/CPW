<script>
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
    import Open from "@/client/icons/Open";

    let { inflatedUnapprovedProjects } = $props();

    const LOCALE_STRING_OPTIONS = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        minute: "numeric",
        hour: "numeric",
    };
</script>

<div
    class="bg-slate-50 rounded-xl border border-slate-300 shadow-sm overflow-hidden h-full flex flex-col"
>
    <div class="px-5 pt-4 pb-2 border-b border-slate-100">
        <h2 class="text-lg font-semibold text-slate-900">Awaiting Approval</h2>
        <p class="mt-1 text-sm text-slate-500">
            These students still need advisor approval.
        </p>
    </div>

    <div
        class="overflow-auto flex-1 bg-white m-3 rounded-lg border border-slate-200"
    >
        {#key inflatedUnapprovedProjects}
            <Table striped={true} items={inflatedUnapprovedProjects}>
                <TableHead>
                    <TableHeadCell>Project</TableHeadCell>
                    <TableHeadCell>Student</TableHeadCell>
                    <TableHeadCell>Advisor</TableHeadCell>
                    <TableHeadCell></TableHeadCell>
                </TableHead>
                <TableBody>
                    <TableBodyRow slot="row" let:item>
                        <TableBodyCell>
                            <p class="max-w-48 text-wrap">{item.title}</p>
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
                        <TableBodyCell class="!p-4">
                            <div class="flex justify-end">
                                <button
                                    class="rounded-md bg-slate-200 flex gap-2 items-center justify-center p-2 hover:bg-slate-300"
                                    onclick={() =>
                                        window.open(
                                            `/admin/project-center/${item._id}`,
                                            "_blank",
                                        )}
                                >
                                    <Icon src={Open} size="1.2rem" />
                                    <span>Open</span>
                                </button>
                            </div>
                        </TableBodyCell>
                    </TableBodyRow>
                </TableBody>
            </Table>
        {/key}
    </div>
</div>
