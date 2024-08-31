<script lang=ts>
    import { user } from "@/client/stores/user";
    import { AccessLevel } from "@/lib/enums";
    import { page } from "$app/stores";
    import { House, Images, FolderOpen, Cog, CircleHelp } from "lucide-svelte";

    $: section = $page.url.pathname.split("/")[1];

    const navBarElements = [
        { iconComponent: House, name: "Home", link: "/", section: "" },
        { iconComponent: FolderOpen, name: "Projects", link: "/projects", section: "projects" },
        { iconComponent: Images, name: "Photos", link: "/images", section: "images" },
        { iconComponent: CircleHelp, name: "Help", link: "/help", section: "help" },
        { iconComponent: Cog, name: "Admin", link: "/admin", section: "admin", predicate: () => $user?.accessLevel == AccessLevel.Admin },
    ]
</script>

<nav class="bg-[#a32349] w-full sm:hidden grid grid-cols-5 px-2     ">
    {#each navBarElements as element}
        {#if element.predicate == undefined || element.predicate()}
        <div class="flex justify-center">
            <a class="p-2" href={element.link} data-sveltekit-preload-data>
                <div class="text-white h-full nav-element flex items-center p-4 rounded-lg gap-2 hover:bg-red-900 {section == element.section ? " bg-red-900" : ""}">
                    <element.iconComponent size="1.6rem" color='white'/>
                </div>
            </a>
        </div>
        {:else}
        <div></div>
        {/if}
    {/each}
</nav>
