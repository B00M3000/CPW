<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang="ts">
    import { goto } from "$app/navigation";
    import InformationBox from "@/client/components/InformationBox.svelte";
    import { tags } from "@/lib/tags";
    import { onMount } from "svelte";

    export let data;
    $: ({ project: originalProject, mentor: originalMentor, projectId } = data);

    interface ProjectInformation {
      title: string;
      tags: string[];
      shortDesc: string;
    }

    interface MentorInformation {
      mentorId: string;
      name: string;
      organization: string;
    }
    
    let project: ProjectInformation = {
      title: "",
      tags: [],
      shortDesc: ""
    };

    let mentor: MentorInformation = {
      mentorId: "",
      name: "",
      organization: "",
    };
      
    onMount(() => {
      project = originalProject;
      mentor = originalMentor;
    })
    
    let success = false;
    let errorsMessages: string[] = [];
    async function upload() {
      const numberOfTags= project.tags.length
  
      if(numberOfTags < 1 || numberOfTags > 5) errorsMessages.push("Please select between 1 and 5 tags.");
      if(project.title.length > 100 && project.title.length < 12) errorsMessages.push("Please enter a project name between 12 and 200 characters");
      if(project.shortDesc.length < 3) errorsMessages.push("Please enter a short description with at least 100 characters to start. You can always edit it later.")

      if(errorsMessages.length == 0){
        const res = await fetch(`/manage-projects/${projectId}/edit`, {
            method: "POST",
            body: JSON.stringify({ project })
        });
      } else {
        return;
      }
        
      success = true;
    }
</script>

<main class="formbar">
  <div class="form-container">
      <div id="inputForm">
          <div class="form-group">
            <label for="subject" class="label">Project Title</label>
            <input type="text" id="subject" name="subject" required  maxlength="120" minlength="5"  bind:value={project.title}>
          </div>
            <div class="form-group">
              <label for="selected" class="label">Select Tags</label>
              {#each Array.from(tags.entries()) as [id, label]}
                    <input type="checkbox" value = {id} id="selected" class="checkbox" name="selected" bind:group={project.tags}/>
                    {label}
                  <br />
                {/each}
            </div>
        
          <h1>To Modify Mentor Information, Contact Ms. Moss</h1> 
          <!-- remind to enter corectly first time, because later can only be changed by ms. moss -->
          {#if !mentor}
          <h1>Mentor Not Found!</h1>
          {:else}
          <div class="info">
            <span>Name: {mentor.name}</span>
            <span>Org: {mentor.organization}</span>
          </div>
          {/if}

          <div class="form-group">
            <label for="shortDesc" class="label">Write A Short Description</label>
            <textarea id="shortDesc" name="shortDesc" rows="3" cols="60" maxlength="2000" required bind:value={project.shortDesc}></textarea>
          </div>
      </div>
      <hr>
      <div class="form-group button-group">
        <button type="submit" class="submit-button" on:click={upload}> Save Changes</button>
        <button type="submit" class="submit-button" on:click={() => goto("/manage-projects")}> Discard</button>
        {#if errorsMessages.length > 0}
          <div class="overlay">
            <div class="info-box">
                <InformationBox 
                  backgroundColor="var(--color-red-100)" 
                  borderColor="var(--color-red-600)" 
                  textColor="var(--color-red-600)" 
                  headingColor="var(--color-red-900)" 
                  heading="Invalid Inputs" 
                  text={errorsMessages.map(m => `  - ${m}`).join('\n')}
                />
                
            </div>
            <div class="info-box-button"> <button on:click = {() => errorsMessages.length = 0}> Got It! </button> </div>
            
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
      </div>
  </div>
  
</main>

<style>
.formbar {
  background-color: #4a5568;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  
  height: 100%; 
  display: flex;
  justify-content: center;
  
}

.form-group {
  padding-top: 2rem;
}


.form-container {
  
  padding: 1.5rem;
  margin-bottom: 2rem;
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
  width: 200px;
  background-color: #525252;
}

input:focus,
textarea:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
  border-color: #4299e1;
}

.checkbox{
    width: auto;
}
textarea{
    width:auto;
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






