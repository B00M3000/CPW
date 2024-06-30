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
    import CaretLeft from "../icons/CaretLeft";

    $: section = $page.url.pathname.split("/")[1];

    const navBarElements = [
        { icon: Home, name: "Home", link: "/", section: "" },
        { icon: FileText, name: "Projects", link: "/projects", section: "projects" },
        { icon: Images, name: "Photos", link: "/images", section: "images" },
        { icon: Gear, name: "Admin", link: "/admin", section: "admin", predicate: () => $user?.accessLevel == AccessLevel.Admin },
        { icon: AiFile, name: "Docs", link: "/docs", section: "docs" }
    ]

    let showingMobileSideBar = true;
</script>

<nav class="flex justify-between bg-[#a4123f] py-4 text-white h-[var(--nav-bar-height)] z-10">
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

<slot />

<div class="sm:hidden flex justify-center items-center py-4 text-white absolute {showingMobileSideBar ? "" : "-translate-x-[136px]"} -translate-y-1/2 transform top-1/2 z-10 transition-side-bar">
    <div class="flex flex-col items-center justify-center gap-3 bg-[#a4123f] w-36 rounded-r-md py-3">
        {#each navBarElements as element}
            {#if element.predicate == undefined || element.predicate()}
                <a class="text-white decoration-0 nav-element flex items-center p-2 rounded-lg mx-2 gap-2 hover:bg-red-900 {section == element.section ? " bg-red-900" : ""}" href={element.link}>
                    <Icon src={element.icon} size="1.75rem" color='white'/>
                    <span>{element.name}</span>
                </a>
            {/if}
        {/each} 
    </div>
    <button class="inline-flex bg-[#a4123f] rounded-r-md py-3 px-1" on:click={() => showingMobileSideBar = !showingMobileSideBar}>
        <Icon src={showingMobileSideBar ? CaretLeft : CaretRight} color="white" size="1.25rem"/>
    </button>
</div>

<style lang="scss">
    .animate-red-glowing {
        animation: glowing 1500ms infinite;
    }

    @keyframes glowing {
        0% { background-color: #B20000; box-shadow: 0 0 3px #B20000; }
        50% { background-color: #FF0000; box-shadow: 0 0 40px #FF0000; }
        100% { background-color: #B20000; box-shadow: 0 0 3px #B20000; }
    }

    .transition-side-bar {
        transition: cubic-bezier(1, 0, 0, 1) 0.25s transform;
    }
</style>
