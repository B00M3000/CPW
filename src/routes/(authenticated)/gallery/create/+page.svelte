<script lang="ts">
  export let data;
  $: ({ projects } = data);

  import InformationBox from "@/client/components/InformationBox.svelte";
  import { bytesToString } from "@/lib/utils.js";

  interface Image {
    file: File;
    desc: string;
  }


  let form: HTMLFormElement;

  let loading = false;
  let success = false;
  let resStat: number;
  let error = false;
  let images: any[] = [];

  let projectId: string = "default";

  async function handleSubmit(event: SubmitEvent) {
    if (projectId === "default") return alert("You must select a project!");
    const formData = new FormData(form);

    loading = true;

    images.forEach((image, i) => {
      formData.set(`desc${i}`, image.desc);
    });

    formData.set('projectId', projectId)

    const res = await fetch(`/gallery/create`, {
      method: "POST",
      body: formData,
    });

    loading = false;

    if (res.ok) {
      success = true;
    } else {
      resStat = res.status;
      error = true;
    }

    return true;
  }

  function mapFiles(e: Event) {
    let imageFiles = e.target.files;
    images = [];
    for (let i = 0; i < imageFiles.length; i++) {
      images.push({
        file: imageFiles[i],
        desc: "",
      });
    }
  }
</script>

<form class="container" bind:this={form} on:submit={handleSubmit}>
  <h1>Image Submission</h1>
  <input
    type="file"
    name="images"
    accept="image/png,image/jpeg,image/gif"
    multiple={true}
    on:change={mapFiles}
    required
  />

  {#each images as image}
    <div id="assets" class="asset">
      <!-- svelte-ignore a11y-img-redundant-alt -->
      <img src={URL.createObjectURL(image.file)} alt="uploaded picture" />
      <span
        contenteditable
        placeholder="Add Description..."
        bind:innerHTML={image.desc}
      />
      <span>{bytesToString(image.file.size)}</span>
    </div>
  {/each}

  <label for="project"><strong>Project: </strong></label>
  <select
    id="project"
    name="projectId"
    disabled={projects.length == 1}
    required
    bind:value={projectId}
  >
    <option disabled selected value="default">Please select a project!</option>
    {#each projects as project}
      <option value={project.id}>{project.title}</option>
    {/each}
  </select>
  <button class="submit-button" type="submit">Submit</button>
</form>

{#if loading || success || error}
  <div class="overlay">
    {#if loading == true}
      <div class="info-box">
        <div class="loading-container">
          <div class="loader" />
        </div>
      </div>
      <div class="loading-text">
        <p><i> Images are uploading; please wait... </i></p>
      </div>
    {:else if success == true}
      <div class="info-box">
        <InformationBox
          backgroundColor="var(--color-green-100)"
          borderColor="var(--color-green-600)"
          textColor="var(--color-green-600)"
          headingColor="var(--color-green-500)"
          heading="Success!!"
          text={"Image was uploaded! You can view your image on /gallery"}
        />
      </div>
      <div class="info-box-button-submit">
        <a data-sveltekit-reload href="/gallery"> Got It! </a>
      </div>
    {:else if error == true}
      <div class="info-box">
        <InformationBox
          backgroundColor="var(--color-red-100)"
          borderColor="var(--color-red-600)"
          textColor="var(--color-red-600)"
          headingColor="var(--color-red-900)"
          heading="Invalid Inputs"
          text={`Error: ${resStat}`}
        />
      </div>
      <div class="info-box-button-submit">
        <button
          on:click={() => {
            success = false;
            loading = false;
            error = false;
          }}
        >
          Ok
        </button>
      </div>
    {/if}
  </div>
{/if}

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

  input[type="file"] {
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

  span:empty:before {
    content: attr(placeholder);
    pointer-events: none;
    display: block;
    font-style: italic;
    border-bottom: 2px black solid;
    color: rgba(0, 0, 0, 0.4);
  }

  .overlay {
    position: fixed;
    margin: 0;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.85);
    z-index: 9999;
  }
  .info-box {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 25vh;
  }

  .info-box-button {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .info-box-button-submit button {
    margin-top: 0.2rem;
    text-decoration: none;
    border: var(--color-red-600) 3px solid;
    border-radius: 0%;
    color: white;
    background-color: transparent;
    padding: 0.5em;
    font-size: 16px;
    border-radius: 4px;
  }
  .info-box-button-submit button:hover {
    background-color: rgba(161, 35, 35, 0.35);
  }

  .info-box-button-submit a {
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
  .info-box-button-submit a:hover {
    background-color: rgba(35, 161, 39, 0.35);
  }

  .info-box-button-submit {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .loader {
    border: 8px solid rgba(255, 255, 255, 0.6);
    border-top: 8px solid var(--color-blue-500);
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 2s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .loading-text {
    margin-top: 0.2rem;
    color: rgba(255, 255, 255, 0.75);
    background-color: transparent;
    padding: 0.5em;
    font-size: 16px;
    text-align: center;
  }
</style>
