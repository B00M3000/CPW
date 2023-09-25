<script lang="ts">
    import type { Project } from "@interfaces/project";
    import tags from "@/lib/tags";
    import Tag from "@client/components/Tag.svelte";
    import StudentCard from "@client/components/StudentCard.svelte";
    import MentorCard from "@/client/components/MentorCard.svelte";
    
    export let project: Project;
</script>

<div class="project-card">
    <h2><a href="{`/projects/${project._id}`}">{project.title}</a></h2>
    
    <div class="field">
        <span class="card-gap">Student: <StudentCard student={project.student}/> </span>
        <span class="card-gap">Mentor: <MentorCard mentor={project.mentor}/> </span>
        
    </div>

    <span class="content">{project.shortDesc}</span>
    <div class="project-card-tags">
        {#each project.tags as tag}
            <Tag text={tags[tag]} />
        {/each}
    </div>

</div>

<style lang="scss">
    h2 {
        text-align: center;
        margin-top: 0.5rem; 
        text-decoration: none;
        font-size: 1.6rem;
    }

    a{
        color: black;
        text-decoration: none;
    }

    a:hover {
        text-decoration: underline;
    }

    p {
        font-size: small;
    }

    .project-card {
        display: flex;
        flex-direction: column;
        width: 410px;
        padding: 0.75rem; 
        background-color: aliceblue;
        border-radius: 0.5em;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        outline: 2px solid black;
    }

    .field {
        display: flex;
        flex-direction: column;
        margin-bottom: 10px; 
        margin-top: 0.45rem; 
        gap: 0.35rem;
        padding:5px;
    }

    .label {
        font-weight: bold; 
        color: var(--color-primary);
    }

    .content {
        word-wrap: break-word;
        color:  #000000;
        margin: 0.3rem;
        text-align: center;
    }

    .card-gap {
        margin-right: 0.2em;
        font-size: 15px;
        font-weight: 900;
    }

    span {
        padding: 0;
        word-wrap: break-word;
    }

    .project-card-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.2rem; 
        margin-top: 1.5rem;
        margin-bottom: 0.6rem; 
        justify-content: center ;
    }


</style>    