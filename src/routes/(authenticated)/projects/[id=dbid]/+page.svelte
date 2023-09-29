<script lang=ts>
    import StudentCard from '@/client/components/StudentCard.svelte';
    import MentorCard from '@/client/components/MentorCard.svelte';
    import Tag from '@/client/components/Tag.svelte';
    import { getTagString } from '@/lib/tags.js';
    export let data;

    $: ({ project, mentor, student } = data);

</script>


<main>
  <div class="sidebar">
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

  <div class="content">
      {#if project?.fullReport.length > 5}
          <div class="report">{project?.fullReport}</div>
      {:else}
          <h1> Sorry, no report has been published for this project.</h1>
      {/if}
  </div>
</main>


<style lang="scss">
  main {
    display: flex;

    .sidebar {
      display: flex;
      flex-direction: column;
      
      width: 21vw;
      height: 100%;
      min-height: calc(100vh - var(--nav-bar-height) - 50px);
      background-color: #f0f0f0; 
      word-wrap: break-word;
      padding: 25px;
    }

    .content {
      width: auto;
      padding: 20px; 

      .report {
        white-space: pre-wrap; 
        word-break: break-word; 
        font-size: 16px;
        background-color: #f4f4f4;
        padding: 1rem;
        border-radius: 5px;
      }
    }
  }
</style>
