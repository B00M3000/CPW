<script lang=ts>

    export let data;

    $: ({ project } = data);
    

</script>


<main>
    <h1>{project.title}</h1>
</main>