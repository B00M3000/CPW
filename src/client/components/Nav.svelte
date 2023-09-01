<script>
    import { user } from "@/client/stores/user";
</script>

<nav class="navbar">
    <div class="main-navigation">
        <a href="/">Home</a>
        <a href="/search">Projects</a>
    </div>
    <h1 class="title"><em>Commonwealth School Project Week Database</em></h1>
    <div class="user-navigation">
        {#if $user}
            <div class="user-card">
                <img src={$user.picture} alt="User Profile" />
                <span>{$user.name}</span>
            </div>
            <button
                class="logout-button"
                on:click={() => {
                    user.logout();
                    location.reload();
                }}>Log Out</button
            >
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

    .user-card {
        display: flex;
        align-items: center;

        img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 8px;
        }

        span {
            font-weight: bold;
            margin-right: 2rem;
        }
    }

    .logout-button,
    .login-button {
        padding: 0.5rem 1rem;
        background-color: #007bff;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .logout-button:hover,
    .login-button:hover {
        background-color: #0056b3;
    }
</style>
