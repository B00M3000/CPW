<script lang="ts">
    import StudentCard from '@/client/components/StudentCard.svelte';
    import ProjectCard from '@/client/components/ProjectCard.svelte';
    export let data;

    $: ({student, projects} = data);

</script>

<main>
    <div>
        {#each projects as project}
            <ProjectCard {project} />
        {/each}
    </div>
</main>


<style lang="scss">
</style>