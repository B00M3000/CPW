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
      <div class="divider"></div>
      <button class={view == Views.Images ? "active" : ""} on:click = {() => view = Views.Images}>View Images</button>
    </div> 
    <div class="report-image-container">
      {#if view == Views.FullReport}
      <h1>Full Report</h1>
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
      max-height: 2rem;
      height: 2rem;
      display: flex;
      flex-direction: row;
      gap: 1.2rem;
    }

    .divider{
      border-left: 1px solid black;
      border-right: 1px solid black;
      background-color: black;
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
      max-height: calc(100vh - var(--nav-bar-height) - 2rem - 20px);
      overflow-y: scroll;

      h1 {
        text-align: center;
      }
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
      position: relative;
      padding-bottom: 0.25rem;
      margin: 0;

      &::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        height: 0.8rem;
        background: blue;
        clip-path: polygon(
          0 0,
          calc(50% - 0.3rem) 0,
          50% calc(0px),
          calc(50% + 0.3rem) 0,
          100% 0,
          100% 5px,
          calc(50% + 0.3rem + 2.5px) 5px,
          50% 100%,
          calc(50% - 0.3rem - 2.5px) 5px,
          0 5px
        );
      }
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
