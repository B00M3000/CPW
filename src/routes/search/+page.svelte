<script lang="ts">
    import ProjectCard from "../../client/components/ProjectCard.svelte";
import type { Project } from "../../interfaces/project";
    const data: Project[] = [
        { 
            studentId: "S05786",
            subject: "Interning in the offices of state senator",
            tags: ["Law, Government, and Politics"],
            mentor: {
                firstName: "Berry",
                lastName: "Evan",
                organization: "Massachusetts State Senate",
                email: "evan.berry@masenate.gov",
                phoneNumber: 6177221555,
            },
            shortDescription: "I observed and followed state senator Berry Evan around.",
            fullReport: "blahblahblah"
        }
    ]
</script>

<main>
    <h1>Commonwealth School Project Week Database</h1>

    <input type="text" value="example search"/>

    <div class="leftright">
        <div class="sidebar">
            <p>TBA: advanced search options</p>
        </div>
        <div class="results">
            {#each data as project}
                <ProjectCard {project} />
            {/each}
        </div>
    </div>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
    }

    .leftright {
        display: flex;
        width: 100vw;
    }

    .sidebar {
        justify-self: left;
    }

    .results {
        display: flex;
        justify-content: center;
        width: 100%     
    }
</style>