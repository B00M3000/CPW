<script lang="ts">
    import { user } from "@/client/stores/user";
</script>

{#if $user}
<div class="container">
    <div class="user-card">
        <img src={$user.picture} alt="User Profile" />
        <span>{$user.name}</span>
    </div>
    <div class="user-dropdown">
        <button class="logout-button" on:click={() => user.logout() }>Log Out</button>
    </div>
</div>
<!-- <button class="logout-button" on:click={() => user.logout() }>Log Out</button> -->
{:else}
<span>ERROR: NOT LOGGED IN</span>
{/if}

<style lang="scss">
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

    .user-dropdown {
        float: left;
        overflow: hidden;
    }

    .user-dropdown {
        display: none;
        position: absolute;
        background-color: #f9f9f9;
        min-width: 160px;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        z-index: 1;
    }

    .container:hover .user-dropdown {
        display: flex;
    }
</style>