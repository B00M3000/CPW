<script>
    import Icon from "@/client/components/Icon.svelte";
    import Warning from "@/client/icons/Warning";
    import { Table, TableHead, TableHeadCell, TableBody, TableBodyRow, TableBodyCell } from "flowbite-svelte";
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

<div class="flex flex-col gap-4 m-5 items-center">
    <div class="w-[54rem] shadow-md">
        {#key inflatedUnapprovedProjects}
        <Table striped={true} items={inflatedUnapprovedProjects}>
            <caption class="p-5 text-lg font-semibold text-left text-gray-900 bg-white">
                Awaiting Approval
                <p class="mt-1 text-sm font-normal text-gray-500">These students are need to obtain approval from their advisors.</p>
            </caption>
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
                    <TableBodyCell><NamePlusPicture user={item.student}/></TableBodyCell>
                    <TableBodyCell>
                        {#if item.advisor}
                            <NamePlusPicture user={item.advisor}/>
                        {:else}
                            <span>No advisor linked.</span>
                        {/if}
                    </TableBodyCell>
                    <TableBodyCell class="!p-4">
                        <div class="flex justify-end">
                            <button class="rounded-md bg-slate-300 flex gap-2 items-center justify-center p-2 hover:bg-slate-400" on:click={() => window.open(`/admin/project-catalog/${item._id}`, "_blank")}>
                                <Icon src={Open} size="1.2rem"/>
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
