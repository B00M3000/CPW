<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang="ts">
    import { goto, invalidate } from "$app/navigation";
    import { currentYear } from "@/lib/utils";
    import { ErrorFilled, WarningAltFilled, CheckmarkFilled } from "carbon-icons-svelte";
    import { Table, TableHead, TableHeadCell, TableBody, TableBodyRow, TableBodyCell } from "flowbite-svelte";
    import { ArrowLeft } from "lucide-svelte";

    let { data } = $props();
    let { students } = $derived(data);

    function removeAdviseeFunction(id: string) {
        return () => {
            fetch(`/manage-advisees/${id}`, {
                method: "DELETE",
            });
            invalidate('advisees')
        }
    }
</script>

<main class="sm:p-8 p-4 flex flex-col items-center relative min-h-full">
    <div class="max-w-[56rem] w-full">
        <a class="absolute top-0 left-0 bg-blue-500 hover:bg-blue-600 shadow-lg p-2 px-3 m-6 rounded-lg flex gap-2 items-center text-white" href=/account>
            <ArrowLeft />
            <span>Back to Account Page</span>
        </a>
        <h1 class="text-4xl text-center mb-5 p-10 bg-slate-300 rounded-lg shadow-sm">Your Advisees</h1>
        <div class="flex items-center flex-col px-8 lg:px-16 w-full">
            <div class="shadow-xl w-full">
                <Table striped={true} items={students}>
                    <TableHead class="bg-gray-200 border-2">
                        <TableHeadCell>Student</TableHeadCell>
                        <TableHeadCell>Status</TableHeadCell>
                        <TableHeadCell></TableHeadCell>
                    </TableHead>
                    <TableBody>
                        <TableBodyRow slot="row" let:item class="border-2">
                            {@const student = item}
                            <TableBodyCell>
                                <div class="flex flex-col items-start">
                                    {#if student.name}
                                    <span class="text-lg mb-2">{student.name}</span>
                                    {:else}
                                    <span class="text-lg mb-2">[no name on record]</span>
                                    {/if}
                                    <span class="text-base text-gray-600">{student.email}</span>
                                </div>
                            </TableBodyCell>
                            <TableBodyCell>
                                <div class="flex items-center gap-2 text-wrap">
                                    {#if !student.lastVisit || student.lastVisit?.getUTCFullYear() < currentYear()}
                                    <ErrorFilled color="red" size={24} />
                                    <span class='text-lg'>Has not logged on!!</span>
                                    {:else if !student.currentPending}
                                    <ErrorFilled color="gray" size={24} />
                                    <span class='text-lg'>No project created.</span>
                                    {:else if !student.currentApproved}
                                    <WarningAltFilled color="#C96" size={24} />
                                    <span class='text-lg'>Awaiting advisor approval...</span>
                                    {:else}
                                    <CheckmarkFilled color="green" size={24} />
                                    <span class='text-lg'>All set!</span>
                                    {/if}
                                </div>
                            </TableBodyCell>
                            <TableBodyCell>
                                <div class="flex items-start">
                                    <button on:click={() => goto(`manage-advisees/${student._id}`)} class="relative p-3 rounded-lg my-4 text-white bg-blue-500 hover:bg-blue-600" class:bg-slate-400={student.currentApproved}>
                                        <span>View Advisee</span>
                                        {#if !student.currentApproved}
                                            <span class="button-badge">!</span>
                                        {/if}
                                    </button>
                                </div>
                            </TableBodyCell>
                        </TableBodyRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    </div>
</main>


<style lang="scss">
    .button-badge {
        position: absolute;
        top: -10px;
        right: -10px;
        width: 25px;
        height: 25px;
        background: red;
        color: #ffffff;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
    }
</style>
