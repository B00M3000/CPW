<script lang=ts>
    import projects from "@client/data/generated/projects.json";

    const project = projects.find((id:string) => id == id) //some logic for searching for project... how to get id of current project from link?
</script>


<main>
    <h1>{project.subject}</h1>




</main>