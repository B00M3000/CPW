<script lang="ts">
    import type { Mentor } from '@/interfaces/project';

    export let mentor: Mentor;
</script>

<div class="mentor-card">
    {#if mentor}
        <a href={`/mentor/${mentor._id}`} class="text">{mentor.firstName} {mentor.lastName}</a> 
    {:else}
        <span class="text">Mentor Not Found!</span>
    {/if}
</div>

<style>
    .mentor-card {
        display: inline-flex;
        
        padding: 0.3em;

        font-size: large;

        margin: -0.1em;

        background-color: rgb(113, 151, 201);

        border-radius: 0.2em;
    }

    .text {
        font-size: 12px;
    }
</style>