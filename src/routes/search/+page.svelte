<script lang="ts">
    import ProjectCard from "@client/components/ProjectCard.svelte";
    import type { Project } from "@interfaces/project";
    import data from "@client/data/generated/projects.json"
  import { json } from "@sveltejs/kit";

    let search = "";

    $: displayed_projects = data.filter((p: Project) => JSON.stringify(p).toLowerCase().includes(search))
</script>

<main>
    <div class="head">
        <h1 class="title">Commonwealth School Project Week Database</h1>

        <input bind:value={search} type="text"/>
    </div>

    <div class="leftright">
        <div class="sidebar">
            <p>TBA: advanced search options</p>
        </div>
        <div class="results">
            {#each displayed_projects as project}
                <ProjectCard {project} />
            {/each}
        </div>
    </div>
</main>

<style>
    .head {
        display: flex;
        flex-direction: column;
        margin: 5em;
        margin-top: 33vh;
        justify-content: center;
        align-items: center;
    }

    main {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
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
        flex-wrap: wrap;
        gap: 1em;
    }
</style>