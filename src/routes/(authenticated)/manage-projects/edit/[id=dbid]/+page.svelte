<script lang="ts">
    import { goto } from "$app/navigation";
    import InformationBox from "@/client/components/InformationBox.svelte";
    import tags from "@/lib/tags";
    import { error } from "@sveltejs/kit";
    import { onMount } from "svelte";


    export let data;
    $: ({ project, mentor, id } = data);

    interface Action {
      action: string;
      project: ProjectInformation;
      mentor: MentorInformation;
      mentorId?: string;
    }

    interface ProjectInformation {
      projectId: string;
      title: string;
      tags: string[];
      shortDesc: string;
    }

    interface MentorInformation {
      mentorId: string;
      firstName: string;
      lastName: string;
      organization: string;
      email: string;
      phoneNumber: string;
    }


    let action: Action;

    
    let currentProj: ProjectInformation = {
        projectId: "",
        title: "",
        tags: [],
        shortDesc: ""
      };

      let currentMentor: MentorInformation = {
        mentorId: "",
        firstName: "",
        lastName: "",
        organization: "",
        email: "",
        phoneNumber: "",
      };
      
      onMount(() => {
        if(project && mentor) {
          currentProj = {
            projectId: project._id,
            title: project.title,
            tags: project.tags,
            shortDesc: project.shortDesc
          };

          currentMentor = {
            mentorId: mentor._id,
            firstName: mentor.firstName,
            lastName: mentor.lastName,
            organization: mentor.organization,
            email: mentor.email,
            phoneNumber: mentor.phoneNumber,
          };
        } else {
          throw error(500, "No Project Found")
        }
      })
      
      let success = false;
      let errorsMessages: string[] = [];
      async function upload() {
        action = { ...action, action: "CREATE", currentProj, currentMentor}
        const numberOfTags= currentProj.tags.length
        
        if(!/.+/.test(currentMentor.firstName)) errorsMessages.push("Please enter the first name of your mentor.");
        if(!/.+/.test(currentMentor.lastName)) errorsMessages.push("Please enter the last name of your mentor.");
        if(!/.+/.test(currentMentor.organization)) errorsMessages.push("Please enter the relevant organization your mentor is associated with for your project.");
        if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(currentMentor.email)) errorsMessages.push("Please enter a valid mentor email address.");
        if(!/^\+?\d{0,3}(\s|-)?(\d|-| |\(|\))+$/.test(currentMentor.phoneNumber)) errorsMessages.push("Please enter a valid mentor phone number in the form +1 555-555-5555.");
        if(numberOfTags < 1 || numberOfTags > 5) errorsMessages.push("Please select between 1 and 5 tags.");
        if(currentProj.title.length > 100 && currentProj.title.length < 12) errorsMessages.push("Please enter a project name between 12 and 200 characters");
        if(currentProj.shortDesc.length < 3) errorsMessages.push("Please enter a short description with at least 100 characters to start. You can always edit it later.")
 
        if(errorsMessages.length == 0){
          const res = await fetch(`/manage-projects/edit/${id}`, {
              method: "POST",
              body: JSON.stringify(action)
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
            <input type="text" id="subject" name="subject" required  maxlength="120" minlength="5"  bind:value={currentProj.title}>
          </div>
            <div class="form-group">
              <label for="selected" class="label">Select Tags</label>
              {#each Object.entries(tags) as [id, label]}
                    <input type="checkbox" value = {id} id="selected" class="checkbox" name="selected" bind:group={currentProj.tags}/>
                    {label}
                  <br />
                {/each}
            </div>


        
          <div class="form-group">
            <label for="mentorFirst" class="label">Mentor First Name</label>
            <input type="text" id="mentorFirst" name="mentorFirst" required bind:value={currentMentor.firstName}>
          </div>
        
          <div class="form-group">
            <label for="mentorLast" class="label">Mentor Last Name</label>
            <input type="text" id="mentorLast" name="mentorLast" required bind:value={currentMentor.lastName}>
          </div>

          <div class="form-group">
            <label for="mentorOrg" class="label">Mentor Organization</label>
            <input type="email" id="mentorOrg" name="mentorOrg" required bind:value={currentMentor.organization}>
          </div>

          <div class="form-group">
            <label for="mentorEmail" class="label">Mentor Email</label>
            <input type="email" id="mentorEmail" name="mentorEmail" required bind:value={currentMentor.email}>
          </div>

          <div class="form-group">
            <label for="mentorPhone" class="label">Mentor Phone</label>
            <input type="text" id="mentorPhone" name="mentorPhone" required bind:value={currentMentor.phoneNumber}>
          </div>


          <div class="form-group">
            <label for="shortDesc" class="label">Write A Short Description</label>
            <textarea id="shortDesc" name="shortDesc" rows="3" cols="60" maxlength="200" required bind:value={currentProj.shortDesc}></textarea>
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






