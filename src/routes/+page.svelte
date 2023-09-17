<script lang="ts">
  import { goto } from "$app/navigation";
  import ProjectCard from "@/client/components/ProjectCard.svelte";
  import { user } from "@/client/stores/user";
  import Carousel from "@/client/components/Carousel.svelte";

  export let data;

  $: ({ projects } = data);
</script>

<main>
    <section id="primary">
        <h1 class="title"><strong>Commonwealth School Project Week Database</strong></h1>
        <p class="subtitle">Welcome to the Commonwealth School Project Week collection.</p>
        <a href="/projects" class="btn">View Completed Projects</a>
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
        <Carousel {projects} />
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
        background-color: var(--color-red-600);
        color: white;
        padding: 15px 30px;
        border-radius: 5px;
        text-decoration: none;
        font-size: 1.2rem;
        transition: background-color 0.3s;
        margin: 10px;
    }

    .btn:hover {
        background-color: var(--color-red-400);
    }

    .login-button {
        background-color: var(--color-blue-600);
    }

    .title {
        font-size: 2.5rem;
        padding-top: 1rem;
        margin-bottom: 0.5rem;
        text-align: center;
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
        background-color: var(--color-blue-grey-200);
        margin: 3rem;
        margin-bottom: 2rem;
        padding: 1rem;
        border: black solid 3px;
    }
</style>