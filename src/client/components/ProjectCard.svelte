<script lang="ts">
    import type { Project } from "@interfaces/project";

    import Tag from "@client/components/Tag.svelte";

    export let project: Project;
</script>

<div class="project-card">
    <h3>{project.subject}</h3>
    <span>Completed by {project.studentId}</span>
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
        
        padding: 1em;

        background-color: lightgrey;

        border-radius: 1em;
    }
</style>