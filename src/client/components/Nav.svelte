<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script>
    import { user } from "@/client/stores/user";
    import UserIconMenu from "@/client/components/UserIconMenu.svelte";

    import { AccessLevel, AccountType } from "@/lib/enums";
    import Credits from "@/client/components/Credits.svelte";

    import { page } from "$app/stores";

    $: section = $page.url.pathname.split("/")[1];
</script>

<nav>
    <div class="main-navigation">
        <a href="/" class={section == "" ? "active" : ""}>Home</a>
        <a href="/projects" class={section == "projects" ? "active" : ""}>Projects</a>
        <a href="/images" class={section == "images" ? "active" : ""}>Photos</a>
        
        {#if $user?.accountType == AccountType.Student}<a href="/manage-projects" class={section == "manage-projects" ? "active" : ""}>Manage Projects</a>{/if}
        {#if $user?.accountType == AccountType.Advisor}<a href="/manage-advisees" class={section == "manage-advisees" ? "active" : ""}>Manage Advisees</a>{/if}
        {#if $user?.accessLevel == AccessLevel.Admin}<a href="/admin" class={section == "admin" ? "active" : ""}>Admin</a>{/if}

        <a href="/docs" class={section == "docs" ? "active" : ""}>Documentation</a>
    </div>
    <div class="user-navigation">
        {#if $user}
            <UserIconMenu />
        {:else}
            <a class="login-button" href="/login">Log In</a>
        {/if}
        <Credits />
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
        gap: 1rem;  
    }

    a {
        margin: 0 1rem;
        color: #fff;
        text-decoration: none;
    }

    a:hover, .active {
        border-bottom: 2px solid;
    }
</style>
