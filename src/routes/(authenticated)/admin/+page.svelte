<script lang="ts">
    import { goto } from "$app/navigation";
    import { user } from "@/client/stores/user";

    async function gotoGhostManager() {
        await goto('/admin/ghosts');
    }

    async function gotoAdvisorAdviseeLinker() {
        await goto('/admin/advisor-advisee');
    }
</script>

<main>
    <h1 class="title"><strong>Administrator Dashboard</strong></h1>
    <p class="subtitle">Currently still under development...</p>

    <button on:click={gotoGhostManager}>Ghosts Manager</button>
    <button on:click={gotoAdvisorAdviseeLinker}>Advisor-Advisee Linker</button>
</main>
  
<style>

</style>