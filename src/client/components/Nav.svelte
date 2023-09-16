<script>
    import { user } from "@/client/stores/user";
    import UserIconMenu from "@/client/components/UserIconMenu.svelte";

    import { AccessLevel, AccountType } from "@/lib/enums";
</script>

<nav>
    <div class="main-navigation">
        <a href="/">Home</a>
        <a href="/projects">Projects</a>
        {#if $user?.accountType == AccountType.Student}
        <a href="/manage-projects">Manage Projects</a>
        {/if}
        {#if $user?.accountType == AccountType.Advisor}
        <a href="/manage-advisees">Manage Advisees</a>
        {/if}
        {#if $user?.accessLevel == AccessLevel.Admin}
        <a href="/admin">Admin</a>
        {/if}
    </div>
    <div class="user-navigation">
        {#if $user}
            <UserIconMenu />
        {:else}
            <a class="login-button" href="/login">Log In</a>
        {/if}
    </div>
</nav>

<style lang="scss">
    nav {
        display: flex;
        justify-content: space-between;
        background-color: #a4123f;
        padding: 0rem 1rem;
        color: #fff;
        height: var(--nav-bar-height);
        z-index: 1; 
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
        border-bottom: 2px solid;
    }


</style>
