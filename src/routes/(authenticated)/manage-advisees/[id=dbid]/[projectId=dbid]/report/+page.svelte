<script lang="ts">
    export let data;

    $: ({project} = data);

    $: fullReport = project.fullReport;
</script>


<main>
    <p> fullReport</p>
</main>