<script lang=ts>
    import { goto } from "$app/navigation";
    import tags from "@/lib/tags";

    interface Action {
      action: string;
      project: ProjectInformation;
      mentor: MentorInformation;
    }

    interface ProjectInformation {
      title: string;
      tags: string[];
      shortDesc: string;
    }

    interface MentorInformation {
      firstName: string;
      lastName: string;
      organization: string;
      email: string;
      phoneNumber: string;
    }

    let project: ProjectInformation = {
      title: "",
      tags: [],
      shortDesc: ""
    };

    let mentor: MentorInformation = {
      firstName: "",
      lastName: "",
      organization: "",
      email: "",
      phoneNumber: "",
    };

    $: action = { action: "CREATE", project, mentor };

    async function upload() {
        const res = await fetch('/manage-projects/create', {
            method: "POST",
            body: JSON.stringify(action)
        });
        await goto('/manage-projects');
    }

    let actions: Action[] = [];

    let step: number = 1;
    const maxStep: number = 4;
    const minStep: number = 1;

    const nextStep = () => { if(step < maxStep) step += 1 }
    const backStep = () => { if(step > minStep) step -= 1 }
</script>

<main class="formbar">
  <form class="form-container">
    {#if step === 1}
    <div class="form-group">
      <label for="subject" class="label">Project Title</label>
      <input type="text" id="title" required bind:value={project.title}>
    </div>
    {:else if step === 2}
    <div class="form-group">
      <label for="selected" class="label">Select Tags</label>
      {#each Object.entries(tags) as [id, label]}
      <input type="checkbox" value={id} id="selected" bind:group={project.tags}/>
      {label}
      <br />
      {/each}
    </div>
    {:else if step === 3}
    <div class="form-group">
      <label for="mentorFirst" class="label">Mentor First Name</label>
      <input type="text" id="mentorFirstName" required bind:value={mentor.firstName}>
    </div>
  
    <div class="form-group">
      <label for="mentorLast" class="label">Mentor Last Name</label>
      <input type="text" id="mentorLastName" required bind:value={mentor.lastName}>
    </div>

    <div class="form-group">
      <label for="mentorOrg" class="label">Mentor Organization</label>
      <input type="email" id="mentorOrganization" required bind:value={mentor.organization}>
    </div>

    <div class="form-group">
      <label for="mentorEmail" class="label">Mentor Email</label>
      <input type="email" id="mentorEmail" required bind:value={mentor.email}>
    </div>

    <div class="form-group">
      <label for="mentorPhone" class="label">Mentor Phone</label>
      <input type="text" id="mentorPhone" required bind:value={mentor.phoneNumber}>
    </div>
    {:else if step === 4}
    <div class="form-group">
      <label for="shortDesc" class="label">Write A Short Description</label>
      <textarea id="shortDesc" rows=3 cols=60 maxlength=200 required bind:value={project.shortDesc}></textarea>
    </div>
    {/if}

    {#if step > minStep}
    <button on:click={backStep}>Back</button>
    {/if}

    {#if step < maxStep}
    <button on:click={nextStep}>Next</button>
    {/if}

    {#if step === maxStep}
    <div class="form-group button-group">
      <button type="submit" class="submit-button" on:click={upload}> Submit Form</button>
    </div>
    {/if}
  </form>
</main>

<style>
  .formbar {
    background-color: #4a5568;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
    
    height: calc(100vh - var(--nav-bar-height)); 
    display: flex;
    justify-content: center;
  }

  .form-group {
    padding-top: 2rem;
  }


  .form-container {
    
    padding-top: 1.5rem;
  }

    #inputForm {
      color: #fff;
    }

  .label {
    display: block;
    font-size: 0.875rem;
    font-weight: 700;
    margin-bottom: 0.2rem;
  }

  input,
  textarea {
    padding: 0.3rem 0.7rem;
    border: 2px solid #000;
    border-radius: 0.375rem;
    outline: none;
    transition: box-shadow 0.2s, border-color 0.2s;
    color: white;
    background-color: #525252;
  }

  input:focus,
  textarea:focus {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
    border-color: #4299e1;
  }


  .submit-button {
    padding: 0.5rem 1rem;
    background-color: #2563eb;
    color: #fff;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .submit-button:hover {
    background-color: #1e40af;
  }

  .submit-button:focus {
    outline: none;
  }
</style>






