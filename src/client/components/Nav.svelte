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

    import Icon from "./Icon.svelte";
    import CaretRight from "../icons/CaretRight";
    import FileText from "../icons/FileText";
    import AiFile from "../icons/AiFile";
    import Images from "../icons/Images";
    import Home from "../icons/Home";
    import Gear from "../icons/Gear";

    $: section = $page.url.pathname.split("/")[1];

    const navBarElements = [
        { icon: Home, name: "Home", link: "/", section: "" },
        { icon: FileText, name: "Projects", link: "/projects", section: "projects" },
        { icon: Images, name: "Photos", link: "/images", section: "images" },
        { icon: Gear, name: "Admin", link: "/admin", section: "admin", predicate: () => $user?.accessLevel == AccessLevel.Admin },
        { icon: AiFile, name: "Docs", link: "/docs", section: "docs" }
    ]
</script>

<nav>
    <div class="main-navigation">
        {#each navBarElements as element}
            {#if element.predicate == undefined || element.predicate()}
                <a class="nav-element flex items-center p-2 rounded-lg mx-2 gap-2 {section == element.section ? " active" : ""}" href={element.link}>
                    {#if element.icon != undefined}
                        <Icon src={element.icon} size="1rem" color='white'/>
                    {/if}
                    <span>{element.name}</span>
                </a>
            {/if}
        {/each}
    </div>
    <div class="user-navigation">
        <Icon src={CaretRight} size="2rem" color="white"/>
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
        z-index: 100; 
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
        color: #fff;
        text-decoration: none;
    }

    .nav-element:hover, .active {
        background-color: darkred;
    }
</style>
