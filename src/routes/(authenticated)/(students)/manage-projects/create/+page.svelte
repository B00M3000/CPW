<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang=ts>
    import { goto } from "$app/navigation";
  import InformationBox from "@/client/components/InformationBox.svelte";
    import MentorSearcher from "@/client/components/MentorSearcher.svelte";
    import { tags } from "@/lib/tags";

    interface Action {
      action: string;
      project: ProjectInformation;
      mentor: MentorInformation;
      mentorId?: string;
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

    let action: Action;
    let success = false;
    $: action = { ...action, action: "CREATE", project, mentor };

    async function upload() {
        const res = await fetch('/manage-projects/create', {
            method: "POST",
            body: JSON.stringify(action)
        });

        
        success = true;
        
    }

    let step: number = 1;
    const maxStep: number = 4;
    const minStep: number = 1;
    let manual: boolean = false;


    let displayedErrorMessages: string[] = []

    function nextStep() {
      if(step < maxStep) {
        const isValid: any = stepValidations[step]!();
        if(isValid === true) {
          step += 1;
          displayedErrorMessages = []
        } else {
          displayedErrorMessages = isValid;
        }
      }
    }

    function backStep() {
      if(step > minStep) step -= 1
    }

    type validation = null | (() => true | string[]);

    const stepValidations: validation[] = [
      null,
      () => {
        if(project.title.length < 100 && project.title.length > 12) return true;
        else return ["Please enter a project name between 12 and 200 characters."];
      },
      () => {
        const numberOfTags= project.tags.length
        if(numberOfTags >= 1 && numberOfTags <= 5) return true;
        else return ["Please select between 1 and 5 tags."];
      },

      () => {
        if(manual){
          let errorsMessages: string[] = [];

          if(!/.+/.test(mentor.firstName)) errorsMessages.push("Please enter the first name of your mentor.");
          if(!/.+/.test(mentor.lastName)) errorsMessages.push("Please enter the last name of your mentor.");
          if(!/.+/.test(mentor.organization)) errorsMessages.push("Please enter the relevant organization your mentor is associated with for your project.");
          if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(mentor.email)) errorsMessages.push("Please enter a valid mentor email address.");
          if(!/^\+?\d{0,3}(\s|-)?(\d|-| |\(|\))+$/.test(mentor.phoneNumber)) errorsMessages.push("Please enter a valid mentor phone number in the form +1 555-555-5555.");

          return errorsMessages.length > 0 ? errorsMessages : true;
        } else {
          if(action.mentorId) return true;
          else return ["Please select an existing mentor to continue or manually add one if not already exists."]
        }
      },
      () => {
        if(/.{100,}/.test(project.shortDesc)) return true;
        else return ["Please enter a short description with at least 100 characters to start. You can always edit it later."]
      }
    ]

    function mentorSelected(e: CustomEvent) {
      const { mentorId } = e.detail;
      action.mentorId = mentorId;
    }
</script>

<main>
  <form>
    {#if step === 1}
    <div id="project-title-container">
      <label for="title" class="label">Give your project a title: </label>
      <span class="textarea" id="title" bind:innerHTML={project.title} contenteditable />
    </div>
    {:else if step === 2}
    <div id="project-tags-container">
      <h1>Select Tags</h1>
      {#each Array.from(tags.entries()) as [id, label]}
      <div class="tag-container">
        <input type="checkbox" value={id} id="selected" bind:group={project.tags}/>
        <span>{label}</span>
      </div>
      {/each}
    </div>
    {:else if step === 3}
    <button class="quickselect-btn" on:click ={() => {manual = !manual}}> Toggle {#if !manual} Manual {:else} Quick Select {/if} </button>
    
    {#if manual}
    <div id="project-mentor-container">
      <label for="mentorFirst" class="label">Mentor First Name</label>
      <span class="textarea" id="mentorFirstName" bind:innerHTML={mentor.firstName} contenteditable />
      <label for="mentorLast" class="label">Mentor Last Name</label>
      <span class="textarea" id="mentorLastName" bind:innerHTML={mentor.lastName} contenteditable />
      <label for="mentorOrg" class="label">Mentor Organization</label>
      <span class="textarea" id="mentorOrganization" bind:innerHTML={mentor.organization} contenteditable />
      <label for="mentorEmail" class="label">Mentor Email</label>
      <span class="textarea" id="mentorEmail" bind:innerHTML={mentor.email} contenteditable />
      <label for="mentorPhone" class="label">Mentor Phone</label>
      <span class="textarea" id="mentorPhone" bind:innerHTML={mentor.phoneNumber} contenteditable />
    </div>
    {:else}
    <MentorSearcher on:select={mentorSelected}/>
    {/if}
    {:else if step === 4}
    <div id="project-short-desc-container">
      <label for="shortDesc" class="label">Write A Short Description</label>
      <span class="textarea" id="shortDesc" bind:innerHTML={project.shortDesc} contenteditable />
    </div>
    {/if}

    <div id="buttons">
      {#if step > minStep}
      <button on:click={backStep}>Back</button>
      {/if}

      {#if step < maxStep}
      <button on:click={nextStep}>Next</button>
      {/if}

      {#if step === maxStep}
      <button type="submit" class="submit-button" on:click={upload}> Submit Form</button>
      {/if}
    </div>

    {#if displayedErrorMessages.length > 0}
    <div class="overlay">
      <div class="info-box">
          <InformationBox 
            backgroundColor="var(--color-red-100)" 
            borderColor="var(--color-red-600)" 
            textColor="var(--color-red-600)" 
            headingColor="var(--color-red-900)" 
            heading="Invalid Inputs" 
            text={displayedErrorMessages.map(m => `  - ${m}`).join('\n')}
          />
          
      </div>
      <div class="info-box-button"> <button on:click = {() => displayedErrorMessages.length = 0}> Got It! </button> </div>
      
     </div>
    {/if}

    {#if success}
    <div class="overlay">
      <div class="info-box">
          <InformationBox 
            backgroundColor="var(--color-green-100)" 
            borderColor="var(--color-green-600)" 
            textColor="var(--color-green-600)" 
            headingColor="var(--color-green-500)" 
            heading="Success!!" 
            text={"Project was submitted. You should see it on the /manage-project page."}
          />
          
      </div>
      <div class="info-box-button-submit"> <a data-sveltekit-reload href="/manage-projects" > Got It! </a> </div>
      
     </div>
    {/if}
  </form>
</main>

<style lang="scss">
  :root {
    overflow: hidden;
  }

  main {
    height: calc(100vh - var(--nav-bar-height));
  }

  form { 
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow-y: scroll;
    height: 100%;

    .textarea { 
      border: none;
      background-color: transparent;
      border-bottom: 2px solid var(--color-blue-grey-500);
    }
  }

  #project-title-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    gap: 1em;

    label {
      font-size: 36px;
    }

    .textarea {
      font-size: 36px;  
      min-width: 40vw;
      max-width: 70vw;
      font-size: 1.8rem;
      outline: none;
    }

    margin: 1em;
  }

  #project-tags-container {
    display: flex;
    flex-direction: column;
    justify-content: center;

    .tag-container {
      display: flex;
    }

    margin: 1em;
  }

  #project-mentor-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    font-size: 24px;  

    &::before {
      background: linear-gradient(transparent, inherit);
    }

    .textarea {
      min-width: 30vw;
      max-width: 30vw;
      margin: 0.5em;
      border: 0;
      border-bottom: 2px solid var(--color-blue-grey-500);
    }
  }

  #project-short-desc-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    font-size: 24px;  

    .textarea {
      min-width: 60vw;
      max-width: 60vw;
      border: 0;
      border-bottom: 2px solid var(--color-blue-grey-500);
    }
  }

  button {
    background-color: var(--color-blue-500);
    border: none;
    padding: 0.5em;
    font-size: 16px;
    border-radius: 4px;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  button:hover {
    background-color: var(--color-blue-400);
  }
  #buttons {
    display: flex;
    justify-content: center;
    gap: 1em;
  }

  .overlay {
    position:fixed;
    margin: 0;
    top:0;
    left:0;
    right:0;
    bottom:0;
    background-color:rgba(0, 0, 0, 0.85);
    z-index:9999;
  }
  .info-box{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 25vh;
  }

  .info-box-button{
    display: flex;
    justify-content: center;
    align-items: center;
  }

 .info-box-button button{
    margin-top: 0.2rem;
    border: var(--color-red-600) 3px solid;
    border-radius: 0%;
    color: white;
    background-color: transparent;
    
 }

 .info-box-button button:hover{
    background-color: rgba(165, 28, 28, 0.35);

 }

 .info-box-button-submit a{
    margin-top: 0.2rem;
    text-decoration: none;
    border: var(--color-green-600) 3px solid;
    border-radius: 0%;
    color: white;
    background-color: transparent;
    padding: 0.5em;
    font-size: 16px;
    border-radius: 4px;
    
 }
 .info-box-button-submit a:hover{
    background-color: rgba(35, 161, 39, 0.35);
    
 }

 .info-box-button-submit{
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>






