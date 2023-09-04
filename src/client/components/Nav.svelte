<script>
    import { user } from "@/client/stores/user";
    import UserIconMenu from "@/client/components/UserIconMenu.svelte";
</script>

<nav class="navbar">
    <div class="main-navigation">
        <a href="/">Home</a>
        <a href="/search">Projects</a>
    </div>
    <h1 class="title">Commonwealth School Project Week Database</h1>
    <div class="user-navigation">
        {#if $user}
            <UserIconMenu />
        {:else}
            <a class="login-button" href="/login">Log In</a>
        {/if}
    </div>
</nav>

<style lang="scss">
    .title {
        align-items: center;
    }
    .navbar {
        display: flex;
        justify-content: space-between;
        background-color: #a4123f;
        padding: 0rem 1rem;
        color: #fff;
        height: var(--nav-bar-height);
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

    .logout-button,
    .login-button {
        background-color: #ff6347;
        color: #fff;
        border: none;
        border-radius: 2px;
        padding: 5px 10px;
        cursor: pointer;
        width: 98%;
        margin: 1px;
    }

    .logout-button:hover,
    .login-button:hover {
        background-color: #0056b3;
    }
</style>
