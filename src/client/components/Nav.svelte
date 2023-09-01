<script>
    import { user } from "@/client/stores/user";
</script>

<nav>
    <div class="main-navigation">
        <a href="/">Home</a>
        <a href="/search">Projects</a>
    </div>

    <div class="other-navigation">
        {#if $user}
        <div class="user-card">
            <img src={$user.picture}/>
            <span>{$user.name}</span>
        </div>
        <button on:click={() => user.logout()}>Log Out</button>
        {:else}
        <a href="/login">Log In</a>
        {/if}
    </div>
</nav>

<style lang="scss">
    nav {
        display: flex;
        justify-content: space-between;
        padding: 0 3rem;

        font-size: 24px;

        background-color: bisque;
    }

    .main-navigation {
        display: flex;
    }

    .other-navigation {
        display: flex;
    }

    a {
        margin: 2rem 1rem;

        color: black;
        text-decoration: none;
    }

    a:hover {
        color: grey;
        background-color: antiquewhite;
    }

    span {
        margin: 2rem;
    }

    .user-card {
        display: flex;
        align-items: center;
        justify-content: center;
        img {
            width: 64px;
            height: 64px;
        }
        span {
            margin-left: 1rem;
        }
    }
</style>