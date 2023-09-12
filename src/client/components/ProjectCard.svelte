<script lang="ts">
    import type { Project } from "@interfaces/project";
    import tags from "@/lib/tags";
    import Tag from "@client/components/Tag.svelte";
    import StudentCard from "@client/components/StudentCard.svelte";
    import MentorCard from "@/client/components/MentorCard.svelte";
    
    export let project: Project;
    //console.log(project)
</script>

<div class="project-card">
    <h2>{project.title}</h2>
    
    <div class="field">
        <span class="card-gap">Completed by: </span>
        <StudentCard student={project.student} />
    </div>
    <div class="field">
        <span class="card-gap">Mentor: </span>
        <MentorCard mentor={project.mentor} />
    </div>
    <div class="field"></div>
    <span>Description: </span>
    <span>{project.shortDesc}</span>
    <div class="field"></div>
    <span>Year: </span>
    <span>{project.year}</span>
    <a href="{`/projects/${project._id}`}"> Read More</a>
    <div class="project-card/tags">
        {#each project.tags as tag}
            <Tag text={tags[tag]} />
        {/each}
    </div>
</div>

<style lang="scss">
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

        .field {
            display: flex;
        }

        .card-gap {
            margin-right: 0.4em;
        }
    }

    span {
        padding: 0;
        word-wrap: break-word;
    }

</style>    