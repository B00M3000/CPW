<script lang="ts">
    import type { Project } from "@interfaces/project";
    import tags from "@/lib/tags";
    import Tag from "@client/components/Tag.svelte";
    import StudentCard from "@client/components/StudentCard.svelte";
    
    export let project: Project;
</script>

<div class="project-card">
    <h2>{project.subject}</h2>
    
    <p><strong>Completed by </strong><StudentCard studentId={project.studentId} /></p>
    <p><strong>Mentor: </strong>{project.mentor.firstName} {project.mentor.lastName}</p>
    <p><strong>Description:</strong> {project.shortDescription}</p>
    <p><strong>Year: </strong> {project.year}</p>

    <div class="project-card/tags">
        {#each project.tags as tag}
            <Tag text={tags[tag]} />
        {/each}
    </div>
</div>

<style>
    h2 {
        text-align: center;
        margin-top: 0.1rem;
    }
    .project-card {
        display: flex;
        flex-direction: column;

        width: 400px;
        
        padding: 0.5em;
        padding-left: 1rem;
        padding-right: 1rem;

        background-color: lightgrey;

        border-radius: 0.5em;
    }

    p {
        padding: 0;
        margin: 0.5rem;
    }

</style>