<script lang='ts'>
    import { goto } from '$app/navigation';
    import { Return } from 'carbon-icons-svelte';
    import toast from 'svelte-french-toast';

    let { data } = $props();

    async function changeApproval(project: any, approval: boolean){
        const res = await fetch(`/manage-advisees/${data.studentId}/${data.project._id}/approval`, {
            method: "POST",
            body: JSON.stringify({
                action: approval ? "APPROVE" : "UNAPPROVE",
                projectId: data.project._id
            })
        });

        if(approval) await goto(`/manage-advisees/${data.studentId}/`)
        else await location.reload();
    }

    let infoGood: boolean = $state(false);
    let reportGood: boolean = $state(false);

    let initalPrompt = $state(true);

    let doubleSpacing = $state(false);
    let report = $derived(!doubleSpacing ? data.project?.fullReport.trim() : data.project?.fullReport.replaceAll('\n', '\n\n').trim());

    $effect(() => {
        if(doubleSpacing) toast.success('Double Spacing Enabled');
        else toast.error('Double Spacing Disabled');
    })
</script>

{#if initalPrompt}
    <div class="absolute flex items-center justify-center h-full w-full top-0 left-0 bg-[#000000AA]">
        <div class='bg-gray-200 p-8 rounded-lg gap-4 flex flex-col items-center max-w-[90vw] sm:max-w-[75vw]'>
            <p class="gap-1 text-xl"><strong class="text-red-700">IMPORTANT:</strong> Please review everything, the button to approve will appear at the bottom once you have confirmed that the required elements are present!</p>
            <button class="bg-gray-400 hover:bg-gray-500 text-white p-2 rounded-md flex items-center gap-2 px-4" onclick={() => initalPrompt = false}>
                <span class="text-lg">Dismiss</span>
            </button>
        </div>
    </div>
{/if}

<main class="flex flex-col items-center w-full bg-gray-300">
    <div class="grid grid-cols-[1fr_auto_1fr] w-full p-12 items-center justify-center">
        <div class="flex justify-start items-center">
            <button class="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md flex items-center gap-2 px-4" onclick={() => history.back()}>
                <Return size={20}/>
                <span class="text-base">Return</span>
            </button>
        </div>
        <h1 class="text-3xl">Inspecting {data.project.student.name}'s Project</h1>
        <div></div>
    </div>
    <div class="inline-flex flex-col p-8 sm:p-16 m-4 sm:m-16 !mt-0 bg-gray-200 rounded-lg border border-solid border-gray-400">
        <h3 class="text-xl text-bold mb-2">Project Details: </h3>

        <p class="year"><strong>Year:</strong> {data.project.year}</p>
        <p class="mentor"><strong>Mentor:</strong> {data.project.mentor.name}</p>
        <p class="mentor"><strong>Mentor Info:</strong> {data.project.mentor.email}, {data.project.mentor.phoneNumber}</p>
        <p class="student"><strong>Student:</strong> {data.project.student.name}</p>
        <p class="created-at"><strong>Created:</strong> {new Date(data.project.createdAt).toLocaleString()}</p>
        <p class="created-at"><strong>Last Modified:</strong> {new Date(data.project.updatedAt).toLocaleString()}</p>

        <p class="student mb-5"><strong>Short Description:</strong> {data.project.shortDesc}</p>

        <h3 class="text-xl mb-3 text-bold">Project Report: </h3>

        <div class="bg-gray-400 p-3 rounded-xl flex flex-wrap justify-between gap-2 w-full mb-4">
            <button class="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-md flex items-center gap-2 px-4" onclick={() => doubleSpacing = !doubleSpacing}>
                <span class="text-base font-bold">x2</span>
                <span class="text-sm">Toggle Double Report Newlines</span>
            </button>
        </div>

        <div class="flex justify-center w-full">
            <div class="w-[9.5in] min-h-full bg-white whitespace-pre-wrap break-words p-[1in] mb-8 flex flex-col" class:justify-center={!report} >
                {#if report}
                <h4 class="text-2xl text-center mb-4">{data.project.title}</h4>
                <h5 class="text-lg text-center mb-8">{data.project.student.name}</h5>
                <p class="text-base">{@html report}</p>
                {:else}
                <div class="flex flex-col items-center justify-center gap-16 h-full">
                    <span class="text-4xl w-full text-center">No report has been uploaded for this project.</span>
                    <span class="text-7xl w-full text-center">¯\_(ツ)_/¯</span>
                </div>
                {/if}
            </div>
        </div>

        <h2 class="text-xl mb-2">Things to look for: </h2>

        <div class="flex items-center mb-1 gap-2 ml-4">
            <input type="checkbox" class="w-4 h-4" bind:checked={infoGood}/>
            <span class="text-lg">Project Information looks Good!</span>
        </div>

        <div class="flex items-center gap-2 ml-4">
            <input type="checkbox"  class="w-4 h-4" bind:checked={reportGood}/>
            <span class="text-lg">A Good Project Report!</span>
        </div>

        <br/>

        <div class="flex justify-start">
            {#if data.project.underReview == false}
                <button class="bg-red-500 hover:bg-red-600 text-lg p-4 px-8 text-white rounded-lg" onclick = {() => changeApproval(data.project, false)}>Unapprove Project</button>
            {:else if infoGood && reportGood}
                <button class="bg-green-500 hover:bg-green-600 text-lg p-4 px-8 text-white rounded-lg" onclick = {() => changeApproval(data.project, true)}>Approve Project</button>
            {:else}
                <span class="text-gray-600">The button to approve will appear once you have confirmed the required elements are present.</span>
            {/if}
        </div>
    </div>
</main>
