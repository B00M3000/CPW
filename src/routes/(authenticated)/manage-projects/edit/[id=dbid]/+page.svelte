<script lang="ts">
    import { goto } from "$app/navigation";
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
    
      
      async function upload() {
        action = { ...action, action: "CREATE", currentProj, currentMentor}
        const res = await fetch(`/manage-projects/edit/${id}`, {
            method: "POST",
            body: JSON.stringify(action)
        });
        
        await goto("/manage-projects")
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
  overflow-y: scroll;
  
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
</style>






