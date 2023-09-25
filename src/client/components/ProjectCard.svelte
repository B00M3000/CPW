<script lang="ts">
    import type { Project } from "@interfaces/project";
    import tags from "@/lib/tags";
    import Tag from "@/client/components/Tag.svelte";
    import StudentCard from "@/client/components/StudentCard.svelte";
    import MentorCard from "@/client/components/MentorCard.svelte";
    import { goto } from "$app/navigation";
    
    export let project: Project;

    async function gotoProject() {
        await goto(`/projects/${project._id}`)
    }
</script>

<div class="card">
    <span class="title">{project.title}</span>

    <div class="tags">
        {#each project.tags as tag}
            <Tag text={tags[tag]} />
        {/each}
    </div>

    <div class="persons">
        <div class="person">
            <span>Student: </span> <StudentCard student={project.student}/>
        </div>
        <div class="person">
            <span>Mentor: </span> <MentorCard mentor={project.mentor}/>
        </div>
    </div>

    <span class="short-description">{project.shortDesc}</span>

    <button on:click={gotoProject}>Learn More</button>
</div>

<style lang="scss">
    .card {
        display: inline-flex;
        flex-direction: column;
        width: 410px;
        padding: 0.75rem; 
        background-color: var(--color-blue-grey-200);
        border-radius: 0.5em;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5); 
    }

    .field {
        display: flex;
        flex-direction: column;
        margin-bottom: 10px; 
        margin-top: 0.45rem; 
        gap: 0.35rem;
        padding:5px;
    }

                span {
                    margin-right: 0.2rem;
                    font-weight: bold;
                }
            }
        }

    .content {
        word-wrap: break-word;
        color:  #000000;
        margin: 0.3rem;
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
    }


</style>    