<script lang="ts">
  import { goto } from "$app/navigation";
</script>

<main>
    <nav>
        <a href="/">home</a>
        <a href="/about">about</a>
    </nav>
    <h1>Commonwealth School Project Week Database</h1>

    <button on:click={() => goto('/login')}>Login</button>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
    }
</style>