<script lang=ts>
    import StudentCard from '@/client/components/StudentCard.svelte';
    import MentorCard from '@/client/components/MentorCard.svelte';
    import Tag from '@/client/components/Tag.svelte';
    import { getTagString } from '@/lib/tags.js';
    import Gallery from '@/client/components/Gallery.svelte';

    export let data: any;

    $: ({ project, mentor, student, images } = data);

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

  <div class="report">
      {project?.fullReport || "Sorry, no report has been published for this project."}
  </div>

  <div class="sidebar right">
      <Gallery {images} projectPage={true} autoHeightAndWidth={true}/> 
  </div>
</main>


<style lang="scss">
  main {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;

    background-color: #eeeeee;

    height: calc(100vh - var(--nav-bar-height));

    .sidebar {  
      display: flex;
      flex-direction: column;  
      padding: 25px;

      &.left {
        word-wrap: break-word;
        overflow-y: auto;
      }
      &.right {
        overflow-y: auto;
      }
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
  }

  @media(max-width: 1200px) {
    main {
      display: flex;
      flex-direction: column;
      height: auto;
    }
  }
</style>
