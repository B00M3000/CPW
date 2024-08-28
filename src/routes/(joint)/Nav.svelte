<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script>
    import { user } from "@/client/stores/user";
    import Credits from "@/client/components/Credits.svelte";
    import { AccessLevel } from "@/lib/enums";
    import { navigating, page } from "$app/stores";
    import UserIconMenu2 from "@/routes/(joint)/UserIconMenu2.svelte";
    import { BarLoader } from "svelte-loading-spinners";
    import Icon from "../../client/components/Icon.svelte";
    import AiFile from "../../client/icons/AiFile";
    import FileText from "../../client/icons/FileText";
    import Gear from "../../client/icons/Gear";
    import Home from "../../client/icons/Home";
    import Images from "../../client/icons/Images";

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
                <a data-sveltekit-preload-data class="text-white decoration-0 nav-element flex items-center p-2 rounded-lg mx-2 gap-2 hover:bg-red-900 {section == element.section ? " bg-red-900" : ""}" href={element.link}>
                    <Icon src={element.icon} size="1rem" color='white'/>
                    <span class="text-base">{element.name}</span>
                </a>
            {/if}
        {/each}
    </div>
    <div class="flex items-center gap-4 mr-4">
        <UserIconMenu2 />
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
</style>
