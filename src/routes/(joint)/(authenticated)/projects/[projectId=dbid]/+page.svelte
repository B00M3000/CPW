<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

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
    <h1 class="text-xl mb-3">{project?.title}</h1>

    <div class="inline-flex items-center gap-2 m-1">
      <span>Mentor: </span>
      <MentorCard {mentor} />
    </div>

    <div class="inline-flex items-center gap-2 m-1">
      <span>Student: </span>
      <StudentCard {student} />
    </div>

    <h3 class="my-1">Tags</h3>
    <Tags tagIds={project.tags} />

    <h3 class="my-1">Description: </h3>
    <span class="my-1">{project?.shortDesc}</span>
  </div>
  <div class="content">
    <div class="view-nav">
      <button class={view == Views.FullReport ? "active" : ""} on:click = {() => view = Views.FullReport}>View Full Report</button>
      <div class="divider"></div>
      <button class={view == Views.Images ? "active" : ""} on:click = {() => view = Views.Images}>View Images</button>
    </div> 
    <div class="report-image-container flex flex-col items-center">
      {#if view == Views.FullReport}
      <div class="max-w-[21cm] mt-5 bg-white whitespace-pre-wrap break-words p-[1in]">
        {#if project?.fullReport}
          <h4 class="text-2xl text-center">{project.title}</h4>
          <p class="text-sm">{project?.fullReport}</p>
        {:else}
          <span>Sorry, no report has been uploaded for this project.</span>
        {/if}
      </div>
      {:else if view == Views.Images}
        <Gallery projectPage={true} {images} />
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
      height: calc(100vh - var(--nav-bar-height));
      word-wrap: break-word;
      overflow-y: auto;
      border-right: 2px black solid;
      background-color: lightgrey;
    }

    .view-nav {
      padding: 10px;
      background-color: var(--color-blue-grey-200);
      position: relative;
      word-wrap: none;
      height: 4rem;
      display: flex;
      flex-direction: row;
      gap: 1.2rem;
    }

    .divider{
      border-left: 1px solid black;
      border-right: 1px solid black;
      background-color: black;
    }

    .report-image-container{
      height: calc(100vh - var(--nav-bar-height) - 2rem - 20px);
      overflow-y: auto;

      h1 {
        text-align: center;
      }
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

    .sidebar { height: fit-content }
  }
</style>
