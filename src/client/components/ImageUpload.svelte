<script lang="ts">
    export let projects: any[] = [];
    import { user } from "@/client/stores/user";
    import { onMount } from "svelte";

    export let data;
    let userId = data.user.id;

    let imageFiles: File[] = [];
    let imageDescription: String = '';

    interface Action {
      action: string;
      files: File[];
      ownerId: string;
    }
    let action: Action;

    onMount(() => { 
      action = {
        action: "CREATE",
        files:  imageFiles,
        ownerId: userId,
      }
    });

    async function handleSubmit() {
        action.files = imageFiles;
        console.log(action)
        // const res = await fetch(`/gallery/add`, {
        //     method: "POST",
        //     body: JSON.stringify(action)
        // });
        return true;
    }
</script>


<div class="container">
  <h1>Image Submission</h1>
  <input
    type="file"
    accept="image/*"
    multiple={true}
    bind:files={imageFiles}
  />

  <label for="project">Project: </label>
  <select id="project" disabled={projects.length == 1}>
    {#each projects as project}
    <option value={project.id}>{project.title}</option>
    {/each}
  </select>

  <h5>Selected Files:</h5>
  {#each imageFiles as file}
      <p><code>{file.name}</code></p>
  {/each} 
  <textarea
    rows="4"
    placeholder="Image Description"
    bind:value={imageDescription}
  ></textarea>
  <button on:click={handleSubmit}>Submit</button>
</div>
  
  
  <style lang="scss">
  .container {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  h1 {
    font-size: 24px;
    margin-bottom: 20px;
    text-align: center;
    color: #333;
  }

  input[type="file"]{
    width: 100%;
    padding: 10px;
    margin-bottom: 10px; 
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
    max-width: 100%; 
  }
  textarea {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px; 
    border: 1px solid #ccc;
    border-radius: 5px;
    resize: vertical;
    height: 100px;
    box-sizing: border-box;
    max-width: 100%; 
  }

  button {
    display: block;
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  button:hover {
    background-color: #0056b3;
  }
</style>
  
