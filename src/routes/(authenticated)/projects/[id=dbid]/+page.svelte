<script lang=ts>
    import StudentCard from '@/client/components/StudentCard.svelte';
    import MentorCard from '@/client/components/MentorCard.svelte';
    import Tag from '@/client/components/Tag.svelte';
    import tags from '@/lib/tags.js';
    export let data;

    $: ({ project, mentor, student } = data);

</script>


  <main>
    <div class="sidebar">
        <h1>{project?.title}</h1>
        <h3> Mentor: <MentorCard {mentor} /> </h3>
        <h3> Completed By: <StudentCard {student} /> </h3>
        <h3>Description: </h3>
        <span> {project?.shortDesc}</span>

        <h3>Tags</h3>
        {#each project.tags as tag}
            <Tag text={tags[tag]} />
        {/each}

    </div>
  
    <div class="content">
        {#if project?.fullReport.length > 5}
            <p>{project?.fullReport}</p>
        {:else}
            <h1> Sorry, no report has been published for this project.</h1>
        {/if}
    </div>
  </main>


  <style>
    main {
      display: flex;
      max-height: calc(100vh - var(--nav-bar-height));
      overflow: hidden;
    }
  
    .sidebar {
      width: 400px;
      flex: 0 0 450px;
      height: calc(100vh - var(--nav-bar-height));
      background-color: #f0f0f0; 
      z-index: 0;
      word-break: break-all;
      padding: 25px;
    }


    p {
        white-space: pre-wrap; 
        word-break: break-word; 
        font-size: 16px;
        background-color: #f4f4f4;
        padding: 10px;
        border-radius: 5px;
    }
  
    .content {
      padding: 20px; 
      min-width: auto;
      overflow-y: auto;
      max-height: calc(100vh - var(--nav-bar-height));
    }
  </style>
  