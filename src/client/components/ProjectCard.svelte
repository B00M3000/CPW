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
    <div class="button-container">
        <button on:click={gotoProject}>Learn More</button>
    </div>
</div>

<style lang="scss">
    .card {
        display: flex;
        flex-direction: column;
        width: 410px;
        padding: 0.75rem; 
        background-color: aliceblue;
        border-radius: 0.5em;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);

        .title {
            font-size: 26px;
            text-align: center;
        }

        .tags {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            padding: 0.5rem;
        }
        
        .persons {
            display: flex;
            flex-direction: column;
            padding: 0.5rem;
            align-self: flex-start;
            
            .person {
                display: flex;
                align-items: center;
                margin: 0.2rem;

                span {
                    margin-right: 0.2rem;
                    font-weight: bold;
                }
            }
        }

        .short-description {
            position: relative;
            margin: 0.5rem;
            word-wrap: break-word;  
            max-height: 10em;
            text-overflow: ellipsis;
            overflow-y: hidden;
            display: inline-flex;
            padding: 5px 0px;

            &::before {
                content: '';
                width: 100%;
                height: 100%;    
                position: absolute;
                left: 0;
                top: 0;
                background: linear-gradient(transparent 7em, aliceblue);
            }

            border-bottom: 2px solid grey;
        }

        button {
            display: inline-flex;
            align-items: center;
            width: 8rem;
            justify-content: center;
            border-radius: 0.5rem;
            color: white;
            background-color: var(--color-blue-500);
            border: none;
            cursor: pointer;
            padding: 0.5rem;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        .button-container{
            display: flex;
            justify-content: center;;
        }
    }
</style>    