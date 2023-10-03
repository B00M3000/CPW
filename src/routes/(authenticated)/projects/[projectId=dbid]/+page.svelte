<script lang=ts>
    import StudentCard from '@/client/components/StudentCard.svelte';
    import MentorCard from '@/client/components/MentorCard.svelte';
    import Tag from '@/client/components/Tag.svelte';
    import { getTagString } from '@/lib/tags.js';
    import Gallery from '@/client/components/Gallery.svelte';

    export let data: any;

    $: ({ project, mentor, student, images } = data);

    let view = 0;
</script>


<main>
  <div class="sidebar left">
      <h1>{project?.title}</h1>
      <h3>Mentor: <MentorCard {mentor} /> </h3>
      <h3>Completed By: <StudentCard {student} /> </h3>
      <h3>Description: </h3>
      <span> {project?.shortDesc}</span>

      <h3>Tags</h3>
      {#each project.tags as tag}
          <Tag text={getTagString(tag)} />
      {/each}
  </div>
  <div class="report-image-container">
    <div class="view-nav">
        <button class={view==0 ? "active" : ""} on:click = {() => view = 0}> View Full Report</button>
        <button class={view==1 ? "active" : ""} on:click = {() => view = 1}> View Images</button>

    </div> 
    {#if view == 0}
      <div class="report">
          {project?.fullReport || "Sorry, no report has been published for this project."}
      </div>

    {:else if view == 1}
      <div class="gallery-container">
        <Gallery {images} />
      </div>
    {/if}
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

      &.left {
        word-wrap: break-word;
        overflow-y: auto;
        
      }
    }

    .view-nav {
      padding: 5px;
      background-color: var(--color-blue-grey-200);
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
      background-color: white;
      padding: 3px;
      border: 1px black solid;
      width: 10rem;
      font-weight: 800;
    }
    
    .active{
      border-bottom: blue 5px solid;
    }

    .active::after {
      content: "";
      display: block;
      position: absolute;
      margin-left: 4rem;
      margin-top: 5px;
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
