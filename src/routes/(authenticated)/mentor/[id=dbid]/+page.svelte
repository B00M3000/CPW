<script lang="ts">
    import { goto } from "$app/navigation";
    import ProjectCard from "@/client/components/ProjectCard.svelte";
    import { user } from "@/client/stores/user";

    export let data;

    $: ({ mentor, projects } = data);
</script>

<main>
    <h1 class="title"><strong>{mentor?.firstName} {mentor?.lastName}</strong></h1>
    <p class="subtitle"><em>Please contact Ms. Moss for contact information.</em></p>
    <h3>These are some projects {mentor?.firstName} {mentor?.lastName} has helped facillitate:</h3>
    <div>
        {#each projects as project}
            <ProjectCard {project} />
        {/each}
    </div>
</main>
  
<style>

</style>