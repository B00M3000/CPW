<script lang="ts">
    export let projects: any[] = [];
    import { onMount } from "svelte";
    import { bytesToString } from "@/lib/utils.js";

    interface Image {
      file: File,
      desc: string,
    }

    let imageFiles: File[] = [];
    let encodedFilesAndDesc: any[] = [];
    let fileDescriptions: string[] = [];
    let imageDescription: String = '';

    async function toBase64(file: File) {
        const reader = new FileReader();
        reader.onloadend = () => {
            return reader.result;
        };
        reader.readAsDataURL(file);
    }

    async function handleSubmit() {
      
      for(let i = 0; i < imageFiles.length; i++){
        let encoded = await toBase64(imageFiles[i])
        encodedFilesAndDesc.push({
          src: encoded;
          desc: fileDescriptions[i] || "N/A";
        })
      }
        const res = await fetch(`/gallery`, {
            method: "POST",
            body: JSON.stringify({
                action: "CREATE",
                files: imageFiles
            })
        });
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


  {#each imageFiles as file}
    <div id="assets" class="asset">
        <!-- svelte-ignore a11y-img-redundant-alt -->
        <img src={URL.createObjectURL(file)} alt="uploaded picture"/>
        <span contenteditable placeholder="Add Description..." bind:innerHTML={}}> </span>
        <span>{bytesToString(file.size)}</span>
    </div>
  {/each}


  
  <label for="project"><strong>Project: </strong></label>
  <select id="project" disabled={projects.length == 1}>
    {#each projects as project}
    <option value={project.id}>{project.title}</option>
    {/each}
  </select>
  <button class="submit-button" on:click={handleSubmit}>Submit</button>
</div>
  
  
<style lang="scss">
  #project {
    margin-top: 1rem;
    margin-bottom: 0.75rem;
    background-color: white;
    border-radius: 2px;
    padding: 3px;
    border: black 1px solid;
  }
  .container {
    max-width: 80vw;
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

  .submit-button {
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

  .submit-button:hover {
    background-color: #0056b3;
  }

  img {
        width: 3rem;
        height: 3rem;
        border-radius: 1rem;
    }

    #assets {
        background-color: var(--color-white);
        padding: 1rem;
        width: calc(80vw - 2rem);
    }

    .asset {
        border: 1px solid #ccc;
        padding: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }


    span:empty:before{
      content: attr(placeholder);
      pointer-events: none;
      display: block; 
      font-style: italic;
      border-bottom: 2px black solid;
      color: rgba(0, 0, 0, 0.4);
    }
</style>
  
