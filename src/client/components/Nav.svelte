<script>
    import { user } from "@/client/stores/user";
  import UserNavMenu from "./UserNavMenu.svelte";
</script>

<nav class="navbar">
    <div class="main-navigation">
        <a href="/">Home</a>
        <a href="/search">Projects</a>
    </div>
    <h1 class="title">Commonwealth School Project Week Database</h1>
    <div class="user-navigation">
        {#if $user}
        <UserNavMenu />
        {:else}
        <a class="login-button" href="/login">Log In</a>
        {/if}
    </div>
</nav>

<style lang="scss">
    .title {
        margin: 0.2rem;
    }
    .navbar {
        display: flex;
        justify-content: space-between;
        padding: 1rem 3rem;
        background-color: #333;
        color: #fff;
    }

    .main-navigation {
        display: flex;
        align-items: center;
    }

    .user-navigation {
        display: flex;
        align-items: center;
    }

    a {
        margin: 0 1rem;
        color: #fff;
        text-decoration: none;
    }

    a:hover {
        color: #ccc;
        background-color: #444;
        border-radius: 4px;
    }
</style>
