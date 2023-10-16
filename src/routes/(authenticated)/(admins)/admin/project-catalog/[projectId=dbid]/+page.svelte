<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang=ts>
    import { onMount } from 'svelte';

    export let data;
    $: ({inflatedProject} = data)
    let editing = false;

    let editedFullReport: string;
    onMount(() => {
        editedFullReport = inflatedProject.fullReport;
    })

    function toggleEditing() {
        editing = !editing;
    }

    async function saveReport() {
        inflatedProject.fullReport = editedFullReport;
        const res = await fetch(`/admin/project-catalog/${inflatedProject._id}`, {
            method: "POST",
            body: JSON.stringify({ 
                Action: "SAVE",
                fullReport: editedFullReport
             })
        })
        toggleEditing();
        location.reload();
    }


    async function changePublish() {
        const res = await fetch(`/admin/project-catalog/${inflatedProject._id}`, {
            method: "POST",
            body: JSON.stringify({
                Action: "PUBLISH",
                publish: !inflatedProject.publish 
            })
        })
        toggleEditing();
        location.reload();
    }
</script>

<main>
    <h1>{inflatedProject.title}</h1>
    {#if inflatedProject.publish}
        <button class="unpublish-button" on:click={changePublish}>Unpublish Project</button>
    {:else if inflatedProject.underReview == false}
        <button class="unpublish-button" on:click={changePublish}>Publish Project</button>
    {/if}
    <p class="year"><strong>Year:</strong> {inflatedProject.year}</p>
    <p class="mentor"><strong>Mentor:</strong> {inflatedProject.mentor.firstName} {inflatedProject.mentor.lastName}</p>
    <p class="mentor"><strong>Mentor Info:</strong> {inflatedProject.mentor.email}, {inflatedProject.mentor.phoneNumber}</p>
    <p class="student"><strong>Student:</strong> {inflatedProject.student.firstName} {inflatedProject.student.lastName}</p>
    <p class="student"><strong>Student Email:</strong> {inflatedProject.student.email}</p>
    <p class="created-at"><strong>Created On: {new Date(inflatedProject.createdAt).toLocaleDateString()}</strong> </p>
  
    {#if editing}
      <div class="full-report-edit">
        <textarea bind:value={editedFullReport}></textarea>
      </div>
      <button class="save-button" on:click={saveReport}>Save</button>
    {:else}
      <div class="full-report">

        <p class="report-text">{editedFullReport}</p>
      </div>
      <button class="edit-button" on:click={toggleEditing}>Edit Full Report</button>
    {/if}
  </main>
  
  <style lang="scss">
    main{
      border: 1px solid #ccc;
      padding: 20px;
      margin: 2rem;
      background-color: #f5f5f5;
      border-radius: 10px;
  
      h1 {
        font-size: 24px;
      }
  
      .year, .mentor, .student, .created-at {
        font-size: 16px;
      }
  
      .full-report {
        max-height: 500px; 
        overflow-y: auto;
        margin-top: 10px;
        padding: 10px;
        border: 1px solid black;
  
        p {
          margin: 0;
        }
  
        .description-text, .report-text {
          white-space: pre-wrap;
        }
      }

      .full-report-edit{
        textarea{
            width: 100%;
            height: 500px;
            font-family: 'Monospace', 'Trebuchet MS', Arial, sans-serif;
            font-size: 16px;
        }
      }
  
      .short-description {
        font-style: italic;
      }
  
      .save-button, .unpublish-button, .edit-button {
        margin-top: 1rem;
        background-color: #007bff;
        color: #fff;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
  
        &:hover {
          background-color: #0056b3;
        }
      }
  
      .edit-button {
        background-color: #28a745;
      }

      .unpublish-button {
        background-color: red;
      }
      .unpublish-button:hover {
        background-color: rgb(159, 32, 32);
      }


    }
  </style>