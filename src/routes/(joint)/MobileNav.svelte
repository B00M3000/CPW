<script lang=ts>
    import { user } from "@/client/stores/user";
    import UserIconMenu from "@/client/components/UserIconMenu.svelte";

    import { AccessLevel, AccountType } from "@/lib/enums";
    import Credits from "@/client/components/Credits.svelte";

    import { page } from "$app/stores";

    import Icon from "../../client/components/Icon.svelte";
    import CaretRight from "../../client/icons/CaretRight";
    import FileText from "../../client/icons/FileText";
    import AiFile from "../../client/icons/AiFile";
    import Images from "../../client/icons/Images";
    import Home from "../../client/icons/Home";
    import Gear from "../../client/icons/Gear";
    import CaretLeft from "../../client/icons/CaretLeft";

    $: section = $page.url.pathname.split("/")[1];

    const navBarElements = [
        { icon: Home, name: "Home", link: "/", section: "" },
        { icon: FileText, name: "Projects", link: "/projects", section: "projects" },
        { icon: Images, name: "Photos", link: "/images", section: "images" },
        { icon: Gear, name: "Admin", link: "/admin", section: "admin", predicate: () => $user?.accessLevel == AccessLevel.Admin },
        { icon: AiFile, name: "Docs", link: "/docs", section: "docs" }
    ]
</script>

<nav class="bg-[#a32349] w-full sm:hidden grid grid-cols-5 px-5">
    {#each navBarElements as element}
        {#if element.predicate == undefined || element.predicate()}
        <a class="p-2" href={element.link}>
            <div class="text-white h-full decoration-0 nav-element flex items-center p-4 rounded-lg gap-2 hover:bg-red-900 {section == element.section ? " bg-red-900" : ""}">
                <Icon src={element.icon} size="1.2rem" color='white'/>
            </div>
        </a>
        {/if}
    {/each} 
</nav>
