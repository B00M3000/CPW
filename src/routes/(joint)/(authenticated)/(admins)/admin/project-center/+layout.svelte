<script lang=ts>
    import { ArrowLeft, Plus, Info, FolderOpen } from "lucide-svelte";
</script>

<main class="w-full h-full p-4">
    <div class="relative w-full h-full bg-gray-300 rounded-xl p-8 grid grid-rows-[auto_minmax(0,_1fr)]">
        <h1 class="text-4xl mb-8 flex items-center justify-center gap-4"><FolderOpen size={48} /> Project Center</h1>
        <div class="project-center-content-grid h-full">
            <div class="grid-create h-full w-full p-4 rounded-lg flex items-center gap-4">
                <a href=/admin/year-status class="flex gap-2 items-center bg-gray-500 hover:bg-gray-600 text-white p-2 px-3 rounded-md">
                    <Info />
                    <span>Year Status</span>
                </a>
                <a href=/admin/project-center/create class="flex gap-2 items-center bg-blue-500 hover:bg-blue-600 text-white p-2 px-3 rounded-md">
                    <Plus />
                    <span>Create Project</span>
                </a>
            </div>
            <div class="grid-other h-full w-full p-8 px-12 rounded-lg flex flex-col items-start">
                <h2 class="text-xl mb-4 text-center">Other:</h2>
                <span class="mb-2">To edit a project, open the editing menu through the year status page.</span>
            </div>
            <div class="grid-search h-full w-full p-8 px-12 rounded-lg flex flex-col items-start">
                <h2 class="text-xl mb-4 text-center">More:</h2>
            </div>
        </div>
        <a class="absolute top-0 left-0 bg-blue-500 hover:bg-blue-600 p-2 px-3 m-8 rounded-lg flex gap-2 items-center text-white" href=/admin>
            <ArrowLeft />
            <span>Back to Admin Dashboard</span>
        </a>
    </div>
</main>

<slot />

<style>
    .project-center-content-grid {
        display: grid;
        grid-template-columns: 4fr 3fr;
        grid-template-rows: auto minmax(0, 1fr);
        grid-template-areas:
            "search create"
            "search other";
        gap: 1.5rem;
    }

    .grid-create { grid-area: create; background-color: #bdc4cd; }
    .grid-search { grid-area: search; background-color: #bdc4cd; }
    .grid-other { grid-area: other; background-color: #bdc4cd; }
</style>
