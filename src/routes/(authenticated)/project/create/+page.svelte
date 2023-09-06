<script lang=ts>
    import tags from "$lib/tags";

    export let form;

    let selected:string[] = [];
    let subject:string = "";
    let mentor:string = "";
    let mentorOrg:string = "";
    let mentorEmail:string = "";
    let mentorPhone:string = "";
    let shortDesc:string = "";
    let fullReport:string = "N/A";
      
</script>



<main class="formbar">

  <div class="custom-form-container">
    <form id="inputForm" class="custom-text-white" method="POST">

      <div class="custom-form-group">
        <label for="subject" class="custom-label">Project Title</label>
        <input type="text" id="subject" name="subject" required class="custom-input" bind:value={subject}>
      </div>

      <div class="custom-form-group">
        <label for="selected" class="custom-label">Select Tags</label>
        {#each Object.entries(tags) as [id, label]}
              <input type="checkbox" value = {id} id="selected" name="selected" />
              {label}
            <br />
          {/each}
      </div>
      
      <div class="custom-form-group">
        <label for="mentorFirst" class="custom-label">Mentor First Name</label>
        <input type="text" id="mentorFirst" name="mentorFirst" required class="custom-input" bind:value={mentor}>
      </div>

      <div class="custom-form-group">
        <label for="mentorLast" class="custom-label">Mentor Last Name</label>
        <input type="text" id="mentorLast" name="mentorLast" required class="custom-input" bind:value={mentor}>
      </div>

      <div class="custom-form-group">
        <label for="mentorOrg" class="custom-label">Mentor Organization</label>
        <input type="email" id="mentorOrg" name="mentorOrg" required class="custom-input" bind:value={mentorOrg}>
      </div>

      <div class="custom-form-group">
        <label for="mentorEmail" class="custom-label">Mentor Email</label>
        <input type="email" id="mentorEmail" name="mentorEmail" required class="custom-input" bind:value={mentorEmail}>
      </div>

      <div class="custom-form-group">
        <label for="mentorPhone" class="custom-label">Mentor Phone</label>
        <input type="text" id="mentorPhone" name="mentorPhone" required class="custom-input" bind:value={mentorPhone}>
      </div>

      <div class="custom-form-group">
        <label for="shortDesc" class="custom-label">Write A Short Description</label>
        <textarea class="custom-textarea" id="shortDesc" name="shortDesc" rows="3" cols="60" maxlength="200" required bind:value={shortDesc}></textarea>
      </div>


      
    </form>

    <div class="custom-form-group custom-button-group">
      <button type="submit" class="custom-submit-button"> Submit Form</button>
    </div>
    
  </div>
</main>

<style scoped>
.formbar {
  background-color: #4a5568;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  width: auto; 
  width: calc(100vw - (100vw - 100%));
  display: flex;
  justify-content: center;
}

.custom-form-group {
  padding-top: 2rem;
}


.custom-form-container {
  
  padding-top: 1.5rem;
}

#inputForm {
  color: #fff;
}

.custom-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 700;
  margin-bottom: 0.2rem;
}

.custom-input,
.custom-textarea {
  padding: 0.3rem 0.7rem;
  border: 2px solid #000;
  border-radius: 0.375rem;
  outline: none;
  transition: box-shadow 0.2s, border-color 0.2s;
  color: white;
  background-color: #525252;
}

.custom-input:focus,
.custom-textarea:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
  border-color: #4299e1;
}


.custom-submit-button {
  padding: 0.5rem 1rem;
  background-color: #2563eb;
  color: #fff;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.custom-submit-button:hover {
  background-color: #1e40af;
}

.custom-submit-button:focus {
  outline: none;
}

</style>






