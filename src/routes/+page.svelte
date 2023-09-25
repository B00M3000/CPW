<script lang="ts">
  import { goto } from "$app/navigation";
  import ProjectCard from "@/client/components/ProjectCard.svelte";
  import { user } from "@/client/stores/user";

  export let data;

  $: ({ projects } = data);

  let search: string;
</script>

<div class="bg-img"></div>
<main>
    <div class="search-title">
        <h1 class="title"><strong>Commonwealth School Project Week Database</strong></h1>
        <div class="search-bar">
            <input type="text" class="search-input" placeholder="Search projects..." bind:value={search}>
            <button class="search-button" on:click={() => goto(`/projects?yearUpper=2023&yearLower=2019&query=${search}`)}>Search</button>
        </div>
        <div class="redirects">
            <a class="btn" on:click={() => goto("/projects")}>View Completed Projects</a>
            <a class="btn" on:click={() => goto("/gallery")}>Browse Photos</a>
        </div>
    </div>
    <section class="primary">
        <p class="subtitle">Welcome to the Commonwealth School Project Week collection</p>
      
        {#if !user}
          <a href="/login" class="login-button">Log In</a>
        {/if}

        <div class="proj-container">
          <h2 class="section-title">Here are some projects done by Commonwealth Students:</h2>
          <div id="projects" class="project-list">
            {#each projects as project}
              <ProjectCard {project} />
            {/each}
          </div>
        </div>
      </section>

</main>


<style lang="scss">
    .bg-img{
        background-image: url("/assets/boston.avif");
        position: fixed;
        height: 100vh;
        width: 100%;
        top: 0;
        background-size: cover;
        background-position: center;
        filter: blur(8px) grayscale(10%);
        z-index: -1;

    }
    // }
    .search-title{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
       
       // background: linear-gradient(0deg, var(--color-blue-grey-300) 1%, transparent);
        width: calc(100vw - (100vw - 100%));
        padding: 50px 0px;
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


    .btn {
        display: inline-block;
        background-color: transparent;
        color: white;
        padding: 15px 30px;
        border-radius: 5px;
        text-decoration: none;
        font-size: 1.2rem;
        transition: background-color 0.3s;
        margin: 10px;
        cursor: pointer;
        outline: 2px black solid;
    }

    .btn:hover {
        background-color: var(--color-blue-grey-400);
    }

    .login-button {
        background-color: var(--color-blue-500);
    }


    .login-button:hover {
        background: transparent;
        outline: 1px solid black;
    }

    .title {
        font-size: 3rem;
        margin-bottom: 1.2rem;
    }

    .subtitle {
        font-size: 1.4rem;
        padding-bottom: 1rem;
        text-align: center;
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



    .subtitle {
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 20px;
    }


    .primary {
        padding: 20px;
        //background-color: var(--color-blue-grey-300);

    }

    .subtitle {
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 30px;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        color:white;
    }

 
    .proj-container {
        margin-top: 30px;
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    }

    .section-title {
        font-size: 1.5rem;
        margin-bottom: 20px;
        color: white;
        text-transform: uppercase;
    }

    .project-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
    }

</style>