<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang="ts">
    import { goto, invalidate } from "$app/navigation";
    import { currentYear } from "@/lib/utils";
    import { ErrorFilled, WarningAltFilled, CheckmarkFilled } from "carbon-icons-svelte";
    import { Table, TableHead, TableHeadCell, TableBody, TableBodyRow, TableBodyCell } from "flowbite-svelte";
    import { ArrowLeft, ExternalLink } from "lucide-svelte";
    import CreateNewAdvisee from "./CreateNewAdvisee.svelte";
    import { onMount } from "svelte";
    import TransferAdvisees from "./TransferAdvisees.svelte";
    import RemoveAdvisees from "./RemoveAdvisees.svelte";
    import { page } from "$app/state";

    let students = $derived(page.data.students);

    onMount(() => {
        const refreshInterval = setInterval(async () => {
            await invalidate('user:adviseeIds');
        }, 5000);

        return () => clearInterval(refreshInterval);
    })
</script>

<main class="h-full grid grid-rows-[auto_1fr] grid-cols-[1fr_auto_1fr] gap-y-4 gap-x-4 p-6 overflow-hidden">
    <div class="flex justify-start">
        <a class="bg-blue-500 hover:bg-blue-600 p-2 px-3 rounded-lg inline-flex gap-2 items-center text-white" href=/account>
            <ArrowLeft />
            <span>Back to your Account</span>
        </a>
    </div>
    <h1 class="text-4xl text-center">Your Advisees</h1>
    <div></div>
    <div class="flex justify-end overflow-hidden">
        <CreateNewAdvisee />
    </div>
    <div class="grid overflow-y-auto w-[50vw] rounded-lg border-gray-400 bg-gray-200 border border-solid">
        {#key students}
        <Table striped={true} items={students} class="w-full">
            <TableHead class="bg-gray-200 sticky top-0 z-10">
                <TableHeadCell>Student</TableHeadCell>
                <TableHeadCell>Status</TableHeadCell>
                <TableHeadCell></TableHeadCell>
            </TableHead>
            <TableBody>
                <TableBodyRow slot="row" let:item class="border-gray-400 border-y border-solid">
                    {@const student = item as any}
                    <TableBodyCell>
                        <div class="flex flex-col items-start w-full">
                            <div class="flex items-start justify-start text-base mb-2 w-full">
                                <span>{student.name ? student.name : "[no name on record]"}</span>
                                <span class="text-gray-500 text-xs ml-1">{student.graduationYear % 100}</span>
                                {#if Date.now() - student.createdAt < 1000 * 60 * 60 * 24}
                                    <span class="text-green-500 text-xs ml-1 animate-pulse">New!</span>
                                {/if}
                            </div>
                            <span class="text-sm text-gray-600">{student.email}</span>
                        </div>
                    </TableBodyCell>
                    <TableBodyCell>
                        <div class="flex items-center gap-2 text-wrap">
                            {#if !student.lastVisit || student.lastVisit?.getUTCFullYear() < currentYear()}
                            <ErrorFilled color="red" size={24} />
                            <span class='text-base'>Has not logged on!!</span>
                            {:else if !student.currentPending}
                            <ErrorFilled color="gray" size={24} />
                            <span class='text-base'>No project created.</span>
                            {:else if !student.currentApproved}
                            <WarningAltFilled color="#C96" size={24} />
                            <span class='text-base'>Awaiting advisor approval...</span>
                            {:else}
                            <CheckmarkFilled color="green" size={24} />
                            <span class='text-base'>All set!</span>
                            {/if}
                        </div>
                    </TableBodyCell>
                    <TableBodyCell>
                        <div class="flex items-start">
                            <button onclick={() => goto(`manage-advisees/${student._id}`)} class="flex items-center gap-2 relative p-2 px-3 rounded-lg text-white bg-blue-500 hover:bg-blue-600" class:bg-slate-400={student.currentApproved}>
                                <ExternalLink size={20}/>
                                <span class="mt-[2px]">View Advisee</span>
                                {#if !student.currentApproved}
                                    <span class="button-badge">!</span>
                                {/if}
                            </button>
                        </div>
                    </TableBodyCell>
                </TableBodyRow>
            </TableBody>
        </Table>
        {/key}
    </div>
    <div class="flex justify-start overflow-hidden">
        <div class="bg-gray-200 border border-gray-400 border-solid rounded-xl shadow-xl p-6 w-xs overflow-y-auto flex flex-col gap-4">
            <TransferAdvisees />
            <div class="w-full h-[1px] bg-gray-400"></div>
            <RemoveAdvisees />
        </div>
    </div>
</main>

<style lang="scss">
    .button-badge {
        position: absolute;
        top: -10px;
        right: -10px;
        width: 20px;
        height: 20px;
        background: red;
        color: #ffffff;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
    }
</style>
