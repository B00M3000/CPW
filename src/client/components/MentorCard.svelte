<script lang="ts">
    import { goto } from '$app/navigation';
    import type { Mentor } from '@/interfaces/project';

    export let mentor: Mentor;

    async function gotoMentor() {
        await goto(`/mentor/${mentor._id}`);
    }
</script>

<button class="mentor-card" on:click={gotoMentor}>
    {#if mentor}
        <span class="text">{mentor.firstName} {mentor.lastName}</span> 
    {:else}
        <span class="text">Mentor Not Found!</span>
    {/if}
</button>

<style>
    .mentor-card {
        cursor: pointer;

        display: inline-flex;
        
        padding: 0.3em;

        font-size: large;

        background-color: var(--color-blue-grey-200);

        border-radius: 2rem;

        gap: 0.2rem;

        border: none;
    }

    .text {
        font-size: 12px;
    }
</style>