<script lang='ts'>
  import { goto } from '$app/navigation';

    export let data;

    $: ({project, studentId} = data);

    async function changeApproval(project: any, approval: boolean){
        const res = await fetch(`/manage-advisees/${studentId}/${project._id}/approval`, {
            method: "POST",
            body: JSON.stringify({
                action: approval ? "APPROVE" : "UNAPPROVE",
                projectId: project._id
            })
        });

        if(approval) await goto(`/manage-advisees/${studentId}/`)
        else await location.reload();
    }

    let infoGood: boolean;
    let reportGood: boolean;
</script>

<main class="flex flex-col p-16 m-16 bg-slate-300 rounded-3xl">
    <p class="mb-3 gap-1 flex items-center text-xl mb-8"><strong class="text-red-700">IMPORTANT: </strong>Please review everything, the button to approve will appear at the bottom once you have confirmed that the required elements are present!</p>

    <h1 class="text-2xl my-2">Inspecting {project.student.name}'s Project</h1>

    <h3 class="text-lg my-1 text-bold">Project Details: </h3>

    <p class="year my-1"><strong>Year:</strong> {project.year}</p>
    <p class="mentor"><strong>Mentor:</strong> {project.mentor.name}</p>
    <p class="mentor"><strong>Mentor Info:</strong> {project.mentor.email}, {project.mentor.phoneNumber}</p>
    <p class="student my-1"><strong>Student:</strong> {project.student.name}</p>
    <p class="created-at"><strong>Created: {new Date(project.createdAt).toLocaleString()}</strong></p>
    <p class="created-at"><strong>Last Modified: {new Date(project.updatedAt).toLocaleString()}</strong></p>

    <p class="student my-2"><strong>Short Description:</strong> {project.shortDesc}</p>

    <h3 class="text-lg mt-2 text-bold">Project Report: </h3>

    <div class="max-w-[21cm] mt-5 bg-white whitespace-pre-wrap break-words p-[1in] text-sm my-5">{project?.fullReport || "This advisee has not uploaded a project report yet."}</div>

    <h2 class="text-lg my-1">Things to look for: </h2>

    <div class="flex items-center my-1">
        <input type="checkbox" class="w-5" bind:checked={infoGood}/>
        <span>Project Information looks Good!</span>
    </div>

    <div class="flex items-center my-1">
        <input type="checkbox" class="w-5" bind:checked={reportGood}/>
        <span>A Good Project Report!</span>
    </div>

    <br/>

    {#if project.underReview == false}
        <button class="deny-button" on:click = {() => changeApproval(project, false)}>Unapprove Project</button>
    {:else if infoGood && reportGood}
        <button class="accept-button" on:click = {() => changeApproval(project, true)}>Approve Project</button>
    {:else}
        <span>Please check the checkboxes to approve the project</span>
    {/if}

    <br class="mb-36">
</main>

<style>
    button {
        color: white;
        border-radius: 7px;
    }

    .accept-button{
        background-color: var(--color-green-400);
        width:150px;
        height:50px;
        text-align:center;
        font-size: 0.81em;
    }

    .accept-button:hover{
        background-color: var(--color-green-300);
        width:150px;
        height:50px;
        text-align:center;
        font-size: 0.81em;
    }

    .deny-button{
        background-color: var(--color-red-400);
        width:150px;
        height:50px;
        text-align:center;
        font-size: 0.81em;
    }

    .deny-button:hover{
        background-color: var(--color-red-300);
        width:150px;
        height:50px;
        text-align:center;
        font-size: 0.81em;
    }
</style>
