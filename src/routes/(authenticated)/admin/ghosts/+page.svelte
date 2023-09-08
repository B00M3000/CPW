<script lang="ts">
    export let data;

    $: ({ ghosts } = data);
</script>

<h1>Admin - Ghost Manager</h1>

{#each ghosts as ghost}
    <p>Email: {ghost.email}</p>
{/each}

<style>

</style>