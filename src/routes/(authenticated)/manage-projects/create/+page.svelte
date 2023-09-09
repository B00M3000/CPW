<script lang=ts>
    import tags from "$lib/tags";

    interface Action {
        action: string;
        title: string;
        year: number;
        mentorFirst: string;
        mentorLast: string;
        mentorOrg:string;
        mentorEmail:string;
        mentorPhone:string;
        shortDesc: string;
        fullReport: string;
        underReview: boolean;
    }


    let selected: string[] = [];
    let subject:string = "";
    let mentorFirst:string = "";
    let mentorLast: string = "";
    let mentorOrg:string = "";
    let mentorEmail:string = "";
    let mentorPhone:string = "";
    let shortDesc:string = "";
    let fullReport:string = "N/A";


    async function upload() {
      actions.push({
            action: "CREATE",
            title: subject,
            year: new Date().getFullYear(),
            mentorFirst: mentorFirst,
            mentorLast: mentorLast,
            mentorOrg: mentorOrg,
            mentorEmail: mentorEmail,
            mentorPhone: mentorPhone,
            shortDesc: shortDesc,
            fullReport: fullReport,
            underReview: true
        })
        actions = actions;
        const res = await fetch('/manage-projects/create', {
            method: "POST",
            body: JSON.stringify(actions)
        });
        location.reload();
    }


    

    let actions: Action[] = [];

    let steps: number = 0;
    let begin: boolean = false;

    function Next() {
      steps += 1;
      console.log(steps)
    }
    function Back() {
      steps -= 1;
    }
    
    function Begin() {
      begin = true;
    }
</script>



<main class="formbar">
  <div class="form-container">
      <div id="inputForm">
        {#if steps == 0}
          <div class="form-group">
            <label for="subject" class="label">Project Title</label>
            <input type="text" id="subject" name="subject" required  bind:value={subject}>
          </div>


          
        {:else if steps == 1}
            <div class="form-group">
              <label for="selected" class="label">Select Tags</label>
              {#each Object.entries(tags) as [id, label]}
                    <input type="checkbox" value = {id} id="selected" name="selected" />
                    {label}
                  <br />
                {/each}
            </div>

        {:else if steps == 2}
        
          <div class="form-group">
            <label for="mentorFirst" class="label">Mentor First Name</label>
            <input type="text" id="mentorFirst" name="mentorFirst" required bind:value={mentorFirst}>
          </div>
        
          <div class="form-group">
            <label for="mentorLast" class="label">Mentor Last Name</label>
            <input type="text" id="mentorLast" name="mentorLast" required bind:value={mentorLast}>
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

        {:else if steps == 3}

          <div class="form-group">
            <label for="shortDesc" class="label">Write A Short Description</label>
            <textarea id="shortDesc" name="shortDesc" rows="3" cols="60" maxlength="200" required bind:value={shortDesc}></textarea>
          </div>

          

        {:else if steps == 4}
          <div class="form-group button-group">
            <button type="submit" class="submit-button" on:click={upload}> Submit Form</button>
          </div>
          
        {/if}

        {#if steps > 0}
          <button on:click={Back}> Back</button>
        {/if}

        {#if steps < 4}
          <button on:click={Next}> Next</button>
        {/if}
      
      </div>
  </div>
  
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






