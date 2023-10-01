<script lang="ts">
    export let data;

    $: ({project, studentId} = data);
    $: fullReport = project.fullReport;


    async function changeApproval(project: any, approval: boolean){

        const res = await fetch(`/manage-advisees/${studentId}/${project._id}/approval`, {
            method: "POST",
            body: JSON.stringify({
                action: approval ? "APPROVE" : "UNAPPROVE",
                projectId: project._id
            })
        });

        await location.reload();
    }
</script>


<main>
    <h1> Project Report For "{project.title}"</h1>
    {#if project.underReview == true}
        <button class="accept-button" on:click = {() => changeApproval(project, true)}>
            Approve Project
        </button>
    {:else if project.underReview == false}
        <button class="deny-button" on:click = {() => changeApproval(project, false)}>
            Unapprove Project
        </button>
    {/if}

    {#if project?.fullReport.length > 5}
        <div class="report">{project?.fullReport}</div>
    {:else}
        <h1> Sorry, no report has been published for this project.</h1>
    {/if}
</main>


<style lang="scss">
    main {
      width: auto;
      padding: 4rem;
      padding-top: 1rem; 

      .report {
        white-space: pre-wrap; 
        word-break: break-word; 
        font-size: 16px;
        background-color: #f4f4f4;
        padding: 1rem;
        border-radius: 5px;
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


    button {
        background-color: #007BFF;
        color: white;
        padding: 12px 24px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        transition: background-color 0.3s ease;
        margin: 10px;
    }



    button:hover {
        background-color: #0056b3;
    }
    }
</style>