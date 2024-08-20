<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script>
    import { user } from "@/client/stores/user";
    import UserIconMenu from "@/client/components/UserIconMenu.svelte";

    import { AccessLevel, AccountType } from "@/lib/enums";
    import Credits from "@/client/components/Credits.svelte";

    import { navigating, page } from "$app/stores";

    import Icon from "../../client/components/Icon.svelte";
    import CaretRight from "../../client/icons/CaretRight";
    import FileText from "../../client/icons/FileText";
    import AiFile from "../../client/icons/AiFile";
    import Images from "../../client/icons/Images";
    import Home from "../../client/icons/Home";
    import Gear from "../../client/icons/Gear";
    import CaretLeft from "../../client/icons/CaretLeft";
    import { BarLoader } from "svelte-loading-spinners";

    $: section = $page.url.pathname.split("/")[1];

    const navBarElements = [
        { icon: Home, name: "Home", link: "/", section: "" },
        { icon: FileText, name: "Projects", link: "/projects", section: "projects" },
        { icon: Images, name: "Photos", link: "/images", section: "images" },
        { icon: Gear, name: "Admin", link: "/admin", section: "admin", predicate: () => $user?.accessLevel == AccessLevel.Admin },
        { icon: AiFile, name: "Docs", link: "/docs", section: "docs" }
    ]
</script>


<nav class="flex justify-between bg-[#a32349] py-4 text-white h-[var(--nav-bar-height)] z-10 shadow-2xl">
    <div class="sm:hidden"></div>
    <div class="flex ml-4 items-center max-sm:hidden">
        {#each navBarElements as element}
            {#if element.predicate == undefined || element.predicate()}
                <a class="text-white decoration-0 nav-element flex items-center p-2 rounded-lg mx-2 gap-2 hover:bg-red-900 {section == element.section ? " bg-red-900" : ""}" href={element.link}>
                    <Icon src={element.icon} size="1rem" color='white'/>
                    <span>{element.name}</span>
                </a>
            {/if}
        {/each} 
    </div>
    <div class="flex items-center gap-4 mr-4">
        {#if $user}
            <UserIconMenu />
        {:else}
            <a class="p-2 bg-rose-600 shadow-xl hover:shadow-sm hover:bg-rose-700 rounded-xl text-xl animate-red-glowing" href="/login">Login</a>
        {/if}
        <Credits />
    </div>
</nav>
{#if $navigating}
<div class="loader">
    <BarLoader size=100 unit="vw" duration="30s" color="#e65984" />
</div>
{/if}

<style lang="scss">
    .loader {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 21;
        height: 0.2rem;
        overflow: hidden;
    }

    .animate-red-glowing {
        animation: glowing 1500ms infinite;
    }

    @keyframes glowing {
        0% { background-color: #B20000; box-shadow: 0 0 3px #B20000; }
        50% { background-color: #FF0000; box-shadow: 0 0 40px #FF0000; }
        100% { background-color: #B20000; box-shadow: 0 0 3px #B20000; }
    }

    .transition-side-bar {
        transition: cubic-bezier(1, 0, 0, 1) 0.15s transform;
    }
</style>
