<script lang="ts">
    import ProjectCard from "@client/components/ProjectCard.svelte";
    import MultiSelect from "@client/components/MultiSelect.svelte"
    import type { Project } from "@interfaces/project";
    import data from "@client/data/generated/projects.json";
    import tags from "@client/data/generated/tags.json";
    import { json } from "@sveltejs/kit";
    //import MultiSelect from "svelte-multiselect"
    let search = "".toLowerCase();

    // Define filter variables
    let filterBySubject = false;
    let filterByYear = false;
    let filterByMentor = false;

    let selected:any[] = [];


    function advancedSearch(project:any) {
        if (search && !JSON.stringify(project).toLowerCase().includes(search)) {
            return false;
        }
        if (filterByYear && project.year !== parseInt(search)) {
            return false;
        }
        if (selected.length > 0 && !selected.some((tag) => project.tags.includes(tag))) {
            return false;
        }
        if (filterByMentor && !JSON.stringify(project.mentor).toLowerCase().includes(search)) {
            return false;
        }
        return true;
    }

    $: displayed_projects = data;

    function filteredProjects() {
        console.log(selected);
        displayed_projects = data
            .filter((p: Project) =>
                JSON.stringify(p).toLowerCase().includes(search)
            )
            .filter(advancedSearch);
    }
</script>

<main>
    <div class="head">
        <h1 class="title">Commonwealth School Project Week Database</h1>
        <div class="search">
            <input
                placeholder="Search..."
                size="90"
                id="search-box"
                class="search-box"
                bind:value={search}
                type="text"
            />
            <button class="button" on:click={filteredProjects}>Search</button>
            <button
                class="button"
                on:click={() => {
                    filterByYear = false;
                    filterByMentor = false;
                    search = "";
                    displayed_projects = data;
                }}>Clear</button
            >
        </div>
    </div>
    <div class="leftright">
        <div class="sidebar">
            <p>Advanced Search Options:</p>
            <label>
                <input type="checkbox" bind:checked={filterByYear} />Year
            </label>

            <label>
                <input type="checkbox" bind:checked={filterByMentor} />Mentor
            </label>
            <MultiSelect options={Object.entries(tags).map(([key, value]) => ({ key, value }))} bind:selectedValues={selected} />



        </div>
        <div class="results">
            {#if displayed_projects.length === 0}
                <h1 class="no-results">
                    No Results For "{`${
                        search.length < 20
                            ? search
                            : search.slice(0, 17) + "..."
                    }`}" Were Found
                </h1>
                <img
                    class="random-img"
                    src="https://media.tenor.com/S9enOIQiZ8gAAAAC/troll-troll-face.gif"
                    alt="dancing penguin"
                    width="800px"
                    height="300px"
                />
            {:else}
                {#each displayed_projects as project}
                    <ProjectCard {project} />
                {/each}
            {/if}
        </div>
    </div>
</main>

<style>
    .head {
        display: flex;
        flex-direction: column;
        margin: 5em;
        margin-top: 5vh;
        justify-content: center;
        align-items: center;
    }

    .search-box {
        width: 100%;
        padding: 10px 20px;
        margin: 8px 0;
        box-sizing: border-box;
        border: 2px solid rgb(0, 0, 0);
        border-radius: 0px;
    }

    .button {
        padding: 10px 5px;
        margin: 8px;
        box-sizing: border-box;
    }

    main {
        display: flex;

        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .leftright {
        display: flex;
        max-width: 100vw;
    }

    .sidebar {
        flex: 0 0 240px;
        border-radius: 10px;
        max-width: 240px;
        height: 100vh;
        background-color: #9b9b9b;
        padding: 20px;
        margin-left: 0.9rem;
    }

    .sidebar p {
        margin-bottom: 10px;
        font-weight: bold;
    }

    .sidebar label {
        display: block;
        margin-bottom: 10px;
    }

    .sidebar input {
        margin-right: 5px;
    }

    .results {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        width: 100vw;
        gap: 1em;
    }

    .no-results {
        font-size: 3rem;
        padding: 90px;
        font-family: "monospace", sans-serif;
        opacity: 0.4;
        width: 100%;
        text-align: center;
    }
    .random-img {
        margin-top: -400px;
    }
    .search {
        display: flex;
        align-items: center;
    }
</style>
