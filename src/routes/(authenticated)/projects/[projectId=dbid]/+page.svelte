<script lang=ts>
    import StudentCard from '@/client/components/StudentCard.svelte';
    import MentorCard from '@/client/components/MentorCard.svelte';
    import Tags from '@/client/components/Tags.svelte';
    import { getTagString } from '@/lib/tags.js';
    import Gallery from '@/client/components/Gallery.svelte';

    export let data: any;

    $: ({ project, mentor, student, images } = data);

    enum Views {
      FullReport,
      Images
    }

    let view = Views.FullReport;
</script>


<main>
  <div class="sidebar">
    <h1>{project?.title}</h1>
    <span>Mentor: <MentorCard {mentor} /></span>
    <span>Completed By: <StudentCard {student} /></span>
    <h3>Tags</h3>
    <Tags tagIds={project.tags} />
    <h3>Description: </h3>
    <span> {project?.shortDesc}</span>
  </div>
  <div class="content">
    <div class="view-nav">
      <button class={view == Views.FullReport ? "active" : ""} on:click = {() => view = Views.FullReport}>View Full Report</button>
      <button class={view == Views.Images ? "active" : ""} on:click = {() => view = Views.Images}>View Images</button>
    </div> 
    <div class="report-image-container">
      {#if view == Views.FullReport}
        <div class="report">
            {project?.fullReport || "Sorry, no report has been published for this project."}
        </div>
      {:else if view == Views.Images}
        <div class="gallery-container">
          <Gallery projectPage={true} {images} />
        </div>
      {/if}
    </div>  
  </div>
</main>


<style lang="scss">
  main {
    display: grid;
    grid-template-columns: 1fr 3fr;

    background-color: #eeeeee;

    height: calc(100vh - var(--nav-bar-height));

    .sidebar {  
      display: flex;
      flex-direction: column;  
      padding: 25px;
      height: calc(100vh - var(--nav-bar-height) - 50px);
      word-wrap: break-word;
      overflow-y: auto;
      border-right: 2px black solid;
    }

    .view-nav {
      padding: 10px;
      background-color: var(--color-blue-grey-200);
      position: relative;
      word-wrap: none;
    }

    .report {
      white-space: pre-wrap; 
      word-break: break-word; 
      font-size: 16px;
      background-color: #f9f9f9;
      padding: 1rem;
      border-radius: 5px;
      padding: 20px; 
      overflow-y: auto;
    }

    .report-image-container{
      max-height: calc(100vh - var(--nav-bar-height));
      overflow-y: scroll;
    }

    .gallery-container{
      background-color: white;
    }

    button {
      background-color: transparent;
      padding: 3px;
      border: 0px transparent;
      color: white;
      font-size: large;
      font-weight: 800;
    }

    button:hover{
      color: rgb(129, 129, 255)
    }
    
    .active{
      border-bottom: 5px blue solid;
    }

    .active::after {
      content: " ";
      position: absolute;
      display: block;
      margin-left: 4rem;
      margin-top: 7px;
      width: 0;
      height: 0;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-top: 8px solid blue;
    }
  }

  @media(max-width: 1200px) {
    main {
      display: flex;
      flex-direction: column;
      height: auto;
    }
  }
</style>
