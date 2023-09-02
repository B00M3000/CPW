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
                <div class="dropdown">
                    <h1 class="dropbtn">
                        <img src={$user.picture} alt="User Profile" />
                    </h1>

                    <div class="dropdown-content">
                        <div class="brief-profile">
                            <img src={$user.picture} alt="User Profile" />
                            <div style="line-height: 1; flex-direction: column;">
                                <h1>{$user.name}</h1>
                                <p>{$user.email}</p>
                            </div>
                        </div>
                        <hr />
                        <button
                            class="logout-button"
                            on:click={() => {
                                user.logout();
                                location.reload();
                            }}>Log Out</button
                        >
                    </div>
                </div>
            </div>
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
    .brief-profile {
        font-weight: 900;
        color: black;
        font-size: medium;
        align-items: center;
        padding: 5px;
        display: flex;
        padding-bottom: 1px;
    }

    .brief-profile p {
        margin: 0; 
        padding: 0px; 
        font-weight: 100;
        font-size: 12px;
    }
    .brief-profile h1 {
        font-size: 16px;
        margin: 0; 
        padding: 0px; 
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

    .dropbtn {
        color: white;
        font-size: 16px;
        border-radius: 5px;
        padding: 5px;
        border-radius: 5px;
        display: flex;
        align-items: center;
        margin-top: -5px;
        margin-bottom: -5px;
    }

    .logout-button:hover,
    .login-button:hover {
        background-color: #0056b3;
    }

    .verticalLine {
        border-left: 2px solid #ffffff;
    }

    .dropdown {
        position: relative;
        display: inline-block;
    }

    .dropdown-content {
        display: none;
        position: absolute;
        overflow: auto;
        background-color: #fff;
        border-radius: 2px;
        box-shadow: 0px 10px 10px 0px rgba(0, 0, 0, 0.4);
        z-index: 50;
        min-width: 150px;
        right: 0;
        top: 100%;
        white-space: nowrap;
    }

    .dropdown:hover .dropdown-content {
        display: block;
    }
</style>
