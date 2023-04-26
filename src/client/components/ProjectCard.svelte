<script lang="ts">
    import type { Project } from "@interfaces/project";

    import Tag from "@client/components/Tag.svelte";
    import StudentCard from "@client/components/StudentCard.svelte";

    export let project: Project;
</script>

<div class="project-card">
    <h3>{project.subject}</h3>
    <div class="completed-by-container">
        <span>Completed by </span>
        <StudentCard studentId={project.studentId} />
    </div>
    <div class="project-card/tags">
        {#each project.tags as tag}
            <Tag text={tag} />
        {/each}
    </div>
    <p>{project.shortDescription}</p>
</div>

<style>
    .project-card {
        display: flex;
        flex-direction: column;

        width: 400px;
        
        padding: 1em;

        background-color: lightgrey;

        border-radius: 1em;
    }

    .completed-by-container {
        display: flex;

        align-items: center;
    }
</style>