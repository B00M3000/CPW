<script lang="ts">
    import ProjectCard from "@client/components/ProjectCard.svelte";
    import MultiSelect from "@client/components/MultiSelect.svelte";
    import type { Project } from "@interfaces/project";
    import data from "@client/data/generated/projects.json";
    import tags from "@/lib/tags";
    import YearFilter from "@client/components/YearFilter.svelte";
    import students from "@client/data/generated/students.json";
    import { json } from "@sveltejs/kit";

    let search = "".toLowerCase();

    // Define filter variables
    let yearUpper: number = new Date().getFullYear();
    let yearLower: number = 2019;
    let mentorSearch: string = "";
    let studentSearch: string = "";
    let filteredStudents: string[] = [];
    let selected: any[] = [];

    function advancedSearch(project: any) {
        if (studentSearch) {
            for (const student of students) {
                let studentName:string = student.firstName;
                studentName.concat(" ", student.lastName)
                if (studentName.toLowerCase().includes(studentSearch.toLowerCase())) {
                    filteredStudents.push(student.studentId);
                }
            }
            if(filteredStudents.length == 0){
                return false;
            }
        }
        if (filteredStudents.length >= 1 && !filteredStudents.some((id) => project.studentId.includes(id))) {
            return false;
        }

        if (search && !JSON.stringify(project).toLowerCase().includes(search)) {
            return false;
        }
        if (mentorSearch && !JSON.stringify(project.mentor).toLowerCase().includes(mentorSearch)) {

            return false;
        }
        if (!(parseInt(project.year) >= yearLower && parseInt(project.year) <= yearUpper)) {
            return false;
        }
        if (selected.length > 0 && !selected.some((tag) => project.tags.includes(tag))) {
            return false;
        }
        return true;
    }

    $: displayed_projects = data;

    function filteredProjects() {
        displayed_projects = data
            .filter((p: Project) =>
                JSON.stringify(p).toLowerCase().includes(search.toLowerCase())
            )
            .filter(advancedSearch);
        filteredStudents = [];
    }
</script>

<main>
    <div class="head">
        
        <div class="search">
            <input
                placeholder="Search..."
                size="90"
                id="search-box"
                class="search-box"
                bind:value={search}
                type="text"
            />
            <button class="button" on:click={filteredProjects}
                >Search</button
            >

            <button
                class="button"
                on:click={() => {
                    yearLower = 2019;
                    yearUpper = new Date().getFullYear();
                    mentorSearch = "";
                    studentSearch = "";
                    search = "";
                    filteredStudents = [];
                    displayed_projects = data;
                }}>Clear</button
            >
        </div>
    </div>
    <div class="leftright">
        <div class="sidebar">
            <h1>Refine Search</h1>
            <hr />
            <h1 class="filter-labels">
                Filter by Year:
                <YearFilter
                    bind:yearLowerBound={yearLower}
                    bind:yearUpperBound={yearUpper}
                />
            </h1>

            <label class="filter-labels">
                Filter by Mentor:
                <input
                    class="SearchFilter"
                    type="search"
                    placeholder="Search Mentor"
                    bind:value={mentorSearch}
                />
            </label>

            <label class="filter-labels">
                Filter by Student:
                <input
                    class="SearchFilter"
                    type="search"
                    placeholder="Search Student"
                    bind:value={studentSearch}
                />
            </label>

            <h1 class="filter-labels">
                Filter by tags:
                <MultiSelect
                    options={Object.entries(tags).map(([key, value]) => ({
                        key,
                        value,
                    }))}
                    bind:selectedValues={selected}
                />
            </h1>

            <button class="button" on:click={filteredProjects}>Search</button>
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
        justify-content: center;
        align-items: left;
        background-color: #d0d0d0;
        width:  calc(100vw - 2rem);
        height: 8vh;
        border-bottom: 2px solid black;
        border-top: 2px solid black;
        padding-left: 2rem;
    }

    .SearchFilter {
        background-color: #525252;
        color: white;
        padding: 2px;
        font-size: 16px;
        border-radius: 5px;
        margin-bottom: 1rem;
        border: 2px solid black;
        border-radius: 5px;
    }

    .filter-labels {
        margin-top: 1rem;
        font-size: 15px;
        font-weight: 900;
    }

    .search-box {
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
        max-width:  calc(100vw - (100vw - 100%));
    }

    .sidebar {
        flex: 0 0 240px;
        max-width: 240px;
        height: 82.2vh;
        background-color: #777777;
        padding: 10px;
        padding-left: 2rem;
        padding-top: 0px;
    }

    .sidebar h1 {
        margin-bottom: 15px;
        font-weight: bold;
    }

    .sidebar hr {
        border: none;
        border-top: 2px #ff0000 solid;
        height: 8px;
        width: 120px;
        align-self: left;
        margin-left: 1px;
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
        width: calc(100vw - 240px);
        max-width: calc(100vw - (100vw - 100%));
        gap: 1em;
        overflow-y: scroll;
        height: 82.44vh;
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
        margin-top: -300px;
    }
    .search {
        display: flex;
        align-items: center;
    }
</style>
