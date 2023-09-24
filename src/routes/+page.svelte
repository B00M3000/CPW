<script lang="ts">
  import { goto } from "$app/navigation";
  import ProjectCard from "@/client/components/ProjectCard.svelte";
  import { user } from "@/client/stores/user";

  export let data;

  $: ({ projects } = data);
</script>

<main>
    <section id="primary">
        <h1 class="title"><strong>Commonwealth School Project Week Database</strong></h1>
        <p class="subtitle">Welcome to the Commonwealth School Project Week collection.</p>
        
        <div class="search-bar">
            <input type="text" class="search-input" placeholder="Search projects...">
            <button class="search-button">Search</button>
            
        </div>
        <div class="redirects">
            <a class="btn" on:click={() => goto("/projects")}>View Completed Projects</a>
            <a class="btn" on:click={() => goto("/projects")}>Browse Photos</a>
        </div>
        
        
        {#if !$user}
        <a href="/login" class="btn login-button">Log In</a>
        {/if}
    </section>

    <div class="scroll-down">
        <span>Scroll down to view more...</span>
        <img src="/assets/scroll-down.png" alt="Scroll Down Icon">
    </div>

    <div class="proj-container">
        <h2 class="section-title">Here are some projects done by Commonwealth Students:</h2>
        <div id="projects" class="project-list">
            {#each projects as project}
                <ProjectCard {project} />
            {/each}
        </div>
    </div>
</main>

<style lang="scss">
    main {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    #primary {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: calc(100vh - var(--nav-bar-height));
    } 

    .scroll-down {
        position: relative;
        bottom: 7em;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        img {
            width: 35rem;
            height: 6rem;
        }
    }

    .section-title {
        font-size: 1.8rem;
        font-weight: bold;
        margin-top: 2em;
        margin-bottom: 1em;
        text-align: center;
    }

    .btn {
        display: inline-block;
        background-color: var(--color-blue-grey-400);
        color: white;
        padding: 15px 30px;
        border-radius: 5px;
        text-decoration: none;
        font-size: 1.2rem;
        transition: background-color 0.3s;
        margin: 10px;
    }

    .btn:hover {
        background-color: var(--color-blue-grey-200);
    }

    .login-button {
        background-color: var(--color-blue-600);
    }

    .title {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
    }

    .subtitle {
        font-size: 1.4rem;
        padding-bottom: 1rem;
        text-align: center;
    }

    .no-projects {
        font-size: 1.2rem;
        margin: 1em;
        text-align: center;
    }

    .project-list {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 1em;

        
    }
    .proj-container {
        background-color: white;
        border: 1px solid var(--color-blue-grey-400);
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        margin: 3rem;
        margin-bottom: 2rem;
        padding: 1rem;
        border: black solid 3px;
    }
    .search-bar {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 45vw;
        margin: 20px 0;
    }

    .search-input {
        width: 55vw;
        padding: 15px;
        font-size: 1rem;
        border: 1px solid var(--color-blue-600);
        border-radius: 5px 0 0 5px;
        outline: none;
    }

    .search-button {
        background-color: var(--color-blue-500);
        color: white;
        padding: 15px 30px;
        border: none;
        border-radius: 0 5px 5px 0;
        cursor: pointer;
        font-size: 1rem;
        transition: background-color 0.3s;
    }

    .search-button:hover {
        background-color: var(--color-blue-400);
    }


    .redirects{
        display: flex;
        flex-direction: row;
    }
</style>