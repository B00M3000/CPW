<script lang=ts>
    import tags from "$lib/tags";

    let form: HTMLFormElement;

    let selected: string[] = [];
    let subject:string = "";
    let mentor:string = "";
    let mentorOrg:string = "";
    let mentorEmail:string = "";
    let mentorPhone:string = "";
    let shortDesc:string = "";
    let fullReport:string = "N/A";
</script>



<main class="formbar">
<<<<<<< HEAD:src/routes/(authenticated)/project/create/+page.svelte
  <div class="custom-form-container">
    <form id="inputForm" class="custom-text-white" method="POST">
=======

  <div class="form-container">
    <form id="inputForm" method="POST">
>>>>>>> fe261d73dfba69cb11d4796384ff9d3c68b658d9:src/routes/(authenticated)/projects/create/+page.svelte

      <div class="form-group">
        <label for="subject" class="label">Project Title</label>
        <input type="text" id="subject" name="subject" required  bind:value={subject}>
      </div>

      <div class="form-group">
        <label for="selected" class="label">Select Tags</label>
        {#each Object.entries(tags) as [id, label]}
              <input type="checkbox" value = {id} id="selected" name="selected" />
              {label}
            <br />
          {/each}
      </div>
      
      <div class="form-group">
        <label for="mentorFirst" class="label">Mentor First Name</label>
        <input type="text" id="mentorFirst" name="mentorFirst" required bind:value={mentor}>
      </div>

      <div class="form-group">
        <label for="mentorLast" class="label">Mentor Last Name</label>
        <input type="text" id="mentorLast" name="mentorLast" required bind:value={mentor}>
      </div>

      <div class="form-group">
        <label for="mentorOrg" class="label">Mentor Organization</label>
        <input type="email" id="mentorOrg" name="mentorOrg" required bind:value={mentorOrg}>
      </div>

      <div class="form-group">
        <label for="mentorEmail" class="label">Mentor Email</label>
        <input type="email" id="mentorEmail" name="mentorEmail" required bind:value={mentorEmail}>
      </div>

      <div class="form-group">
        <label for="mentorPhone" class="label">Mentor Phone</label>
        <input type="text" id="mentorPhone" name="mentorPhone" required bind:value={mentorPhone}>
      </div>

      <div class="form-group">
        <label for="shortDesc" class="label">Write A Short Description</label>
        <textarea id="shortDesc" name="shortDesc" rows="3" cols="60" maxlength="200" required bind:value={shortDesc}></textarea>
      </div>


      
    </form>

    <div class="form-group button-group">
      <button type="submit" class="submit-button"> Submit Form</button>
    </div>
    
  </div>
</main>

<<<<<<< HEAD:src/routes/(authenticated)/project/create/+page.svelte
<style>
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
=======
<style scoped>
.formbar {
  background-color: #4a5568;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  width: auto; 
  display: flex;
  justify-content: center;
}

.form-group {
  padding-top: 2rem;
}


.form-container {
  
  padding-top: 1.5rem;
}
>>>>>>> fe261d73dfba69cb11d4796384ff9d3c68b658d9:src/routes/(authenticated)/projects/create/+page.svelte

  #inputForm {
    color: #fff;
  }

<<<<<<< HEAD:src/routes/(authenticated)/project/create/+page.svelte
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
=======
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
>>>>>>> fe261d73dfba69cb11d4796384ff9d3c68b658d9:src/routes/(authenticated)/projects/create/+page.svelte

  .custom-submit-button:focus {
    outline: none;
  }
</style>






