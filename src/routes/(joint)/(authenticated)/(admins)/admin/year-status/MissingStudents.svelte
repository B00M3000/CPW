<script>
    import Icon from "@/client/components/Icon.svelte";
    import Warning from "@/client/icons/Warning";
    import { Table, TableHead, TableHeadCell, TableBody, TableBodyRow, TableBodyCell } from "flowbite-svelte";
    import { getContext } from "svelte";
    import NamePlusPicture from "./NamePlusPicture.svelte";

    let { missingStudents } = $props();

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
        {#key missingStudents}
        <Table striped={true} items={missingStudents}>
            <caption class="p-5 text-lg font-semibold text-left text-gray-900 bg-white">
                Missing Project
                <p class="mt-1 text-sm font-normal text-gray-500">These students either have not logged in yet or created a project.</p>
            </caption>
            <TableHead>
                <TableHeadCell>Student</TableHeadCell>
                <TableHeadCell>Advisor</TableHeadCell>
                <TableHeadCell>Last Login</TableHeadCell>
            </TableHead>
            <TableBody>
                <TableBodyRow slot="row" let:item>
                    <TableBodyCell><NamePlusPicture user={item}/></TableBodyCell>
                    <TableBodyCell>
                        {#if item.advisor}
                            <NamePlusPicture user={item.advisor}/>
                        {:else}
                            <span>No advisor linked.</span>
                        {/if}
                    </TableBodyCell>
                    <TableBodyCell>
                        {#if item.lastVisit}
                            <span class="text-gray-500">{new Date(item.lastVisit).toLocaleString("en-US", LOCALE_STRING_OPTIONS)}</span>
                        {:else}
                            <div class="flex items-center gap-1">
                                <Icon src={Warning} color="red" size="1.2rem"/>
                                <span class="text-red-500">Never</span>
                            </div>
                        {/if}
                    </TableBodyCell>
                </TableBodyRow>
            </TableBody>
        </Table>
        {/key}
    </div>
</div>
