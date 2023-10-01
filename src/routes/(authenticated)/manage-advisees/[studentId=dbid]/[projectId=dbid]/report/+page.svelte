<script lang="ts">
    export let data;

    $: ({project} = data);
    $: fullReport = project.fullReport;
</script>


<main>
    <h1> Project Report For "{project.title}""</h1>
    {#if project?.fullReport.length > 5}
        <div class="report">{project?.fullReport}</div>
    {:else}
        <h1> Sorry, no report has been published for this project.</h1>
    {/if}
</main>


<style lang="scss">
    main {
      width: auto;
      padding: 4rem;
      padding-top: 1rem; 

      .report {
        white-space: pre-wrap; 
        word-break: break-word; 
        font-size: 16px;
        background-color: #f4f4f4;
        padding: 1rem;
        border-radius: 5px;
      }
    }
</style>