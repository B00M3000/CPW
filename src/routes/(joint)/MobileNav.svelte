<script lang=ts>
    import { user } from "@/client/stores/user";
    import { AccessLevel } from "@/lib/enums";
    import { page } from "$app/stores";
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

<nav class="bg-[#a32349] w-full sm:hidden grid grid-cols-5 px-2     ">
    {#each navBarElements as element}
        {#if element.predicate == undefined || element.predicate()}
        <div class="flex justify-center">
            <a class="p-2 px-4" href={element.link} data-sveltekit-preload-data>
                <div class="text-white h-full nav-element flex items-center p-4 rounded-lg gap-2 hover:bg-red-900 {section == element.section ? " bg-red-900" : ""}">
                    <Icon src={element.icon} size="1.2rem" color='white'/>
                </div>
            </a>
        </div>
        {/if}
    {/each}
</nav>
