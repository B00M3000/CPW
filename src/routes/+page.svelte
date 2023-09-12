<script lang="ts">
  import { goto } from "$app/navigation";
  import ProjectCard from "@/client/components/ProjectCard.svelte";
  import { user } from "@/client/stores/user";

  export let data;

  $: ({ projects } = data);
</script>

<main>
    <div id="primary">
        <h1 class="title"><strong>Commonwealth School Project Week Database</strong></h1>
        <p class="subtitle"> Welcome to the Commonwealth School Project Week collection.
        </p>
        <a href="/projects">View Completed Projects</a>
        {#if !$user}
        <a class="login-button" href="/login">Log In</a>
        {/if}
        
    </div>

    <div class="scroll-down">
        <span>Scroll down to view more...</span>
        <img src="/assets/scroll-down.png">
    </div>

    <h1>5 random projects completed by students at Commonwealth.</h1>

    <div id="projects">
        {#each projects as project}
            <ProjectCard {project} />
        {:else}
            <span>No Projects.</span>
        {/each}
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

    #projects {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 1em;
    }

    .scroll-down {
        position: relative;
        bottom: 7em;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        img {
            width: 13rem;
            height: 4rem;
        }
    }

    .login-button {
        background-color: var(--color-red-600);
        border-radius: 5px;
        padding: 15px;
        padding-left: 40px;
        padding-right: 40px;
        text-decoration: none;
        color: white
    }

    .title {
        font-size: 2rem;
        padding-top: 0.5rem;
    }

    .subtitle {
        font-size: 1.2rem;
        padding-top: 0.7rem;
        padding-bottom: 0.7rem;
    }
</style>