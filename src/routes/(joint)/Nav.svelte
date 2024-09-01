<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script>
    import { user } from "@/client/stores/user";
    import Info from "@/routes/(joint)/Info.svelte";
    import { AccessLevel } from "@/lib/enums";
    import { navigating, page } from "$app/stores";
    import UserIconMenu2 from "@/routes/(joint)/UserIconMenu2.svelte";
    import { BarLoader } from "svelte-loading-spinners";
    import { CircleHelp, Settings, FolderOpen, House, Images } from "lucide-svelte";

    $: section = $page.url.pathname.split("/")[1];

    const navBarElements = [
        { iconComponent: House, name: "Home", link: "/", section: "" },
        { iconComponent: FolderOpen, name: "Projects", link: "/projects", section: "projects" },
        { iconComponent: Images, name: "Photos", link: "/images", section: "images" },
        { iconComponent: CircleHelp, name: "Help", link: "/help", section: "help" },
        { iconComponent: Settings, name: "Admin", link: "/admin", section: "admin", predicate: () => $user?.accessLevel == AccessLevel.Admin },
    ]
</script>


<nav class="flex justify-between bg-[#a32349] py-4 text-white h-[var(--nav-bar-height)] z-10 shadow-2xl">
    <div class="sm:hidden"></div>
    <div class="flex ml-4 items-center max-sm:hidden">
        {#each navBarElements as element}
            {#if element.predicate == undefined || element.predicate()}
                <a data-sveltekit-preload-data class="text-white decoration-0 nav-element flex items-center p-2 rounded-lg mx-2 gap-2 hover:bg-red-900 {section == element.section ? " bg-red-900" : ""}" href={element.link}>
                    <element.iconComponent size="1.2rem" color='white'/>
                    <span class="text-base">{element.name}</span>
                </a>
            {/if}
        {/each}
    </div>
    <div class="flex items-center gap-4 mr-4">
        <UserIconMenu2 />
        <Info />
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
