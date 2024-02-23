<script lang='ts'>
    export let user: any;
</script>

<div class="flex justify-center items-center gap-2">
    {#if user.name}
        <img src={user.picture} alt={`image of ${user.name}`} class="w-6 h-6 rounded-full">
        <span>{user.name}</span>
    {:else}
        <span>{user.email}</span>
    {/if}
</div>