<script lang="ts">
    import { marked } from 'marked';
    import MainCollection from "@client/help/students/searching.md?raw";
    import Gallery from "@client/help/students/photogallery.md?raw";
    import ManageProjects from "@client/help/students/manageprojects.md?raw";
    import ManagePhotos from "@client/help/students/managephotos.md?raw";
    import Issues from "@client/help/students/issues.md?raw";

    let activeMarkdown = MainCollection;
</script>

<main class="w-full h-full flex flex-col items-center">
    <div class="grid max-sm:grid-rows-[auto_minmax(0,_1fr)] sm:grid-cols-[auto_minmax(0,_1fr)] sm:h-full m-4 sm:m-12 gap-8">
        <aside class="flex flex-col h-full sm:px-12 pt-8 sm:pt-[15vh] p-4 bg-gray-50 rounded-lg">
            <h1 class="mb-8 text-3xl">Student Help Menu: </h1>

            <div class="flex flex-col items-start text-lg gap-4 text-left text-blue-950">
                <button class="w-full bg-blue-500 hover:bg-blue-600 p-2 px-4 rounded-lg" on:click={() => { activeMarkdown = MainCollection }}>The Main Collection</button>
                <button class="w-full bg-blue-500 hover:bg-blue-600 p-2 px-4 rounded-lg" on:click={() => { activeMarkdown = Gallery }}>The Gallery Page</button>
                <button class="w-full bg-blue-500 hover:bg-blue-600 p-2 px-4 rounded-lg" on:click={() => { activeMarkdown = ManageProjects }}>Manage Projects</button>
                <button class="w-full bg-blue-500 hover:bg-blue-600 p-2 px-4 rounded-lg" on:click={() => { activeMarkdown = ManagePhotos }}>Manage Photo</button>
                <button class="w-full bg-blue-500 hover:bg-blue-600 p-2 px-4 rounded-lg" on:click={() => { activeMarkdown = Issues }}>Fixing Issues</button>
            </div>
        </aside>

        <div class="h-full p-4 sm:p-[0.75in] bg-gray-50">
            <div class="markdown h-full overflow-y-auto max-w-[9.5in] ">
                {@html marked(activeMarkdown)}
            </div>
        </div>
    </div>
</main>

<style type=scss scoped>
    @import "../markdown.scss";
</style>
